import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { getOpenAI, hasOpenAI, EMBED_MODEL } from "@/lib/openai";
import { dateRange } from "@/lib/utils";

export type SourceType =
  | "profile"
  | "experience"
  | "education"
  | "project"
  | "skills"
  | "favorites";

export type Chunk = {
  sourceType: SourceType;
  sourceId: string;
  content: string;
};

/** pgvector text literal: [0.1,0.2,...] */
function toVectorLiteral(vec: number[]): string {
  return `[${vec.join(",")}]`;
}

/** Batch-embed an array of texts in a single OpenAI request. */
export async function embed(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const res = await getOpenAI().embeddings.create({
    model: EMBED_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding as number[]);
}

export async function embedOne(text: string): Promise<number[]> {
  const [v] = await embed([text]);
  return v;
}

// ---------- Canonical text builders (one coarse chunk per item) ----------

async function profileChunks(): Promise<Chunk[]> {
  const p = await prisma.profile.findUnique({ where: { id: "singleton" } });
  if (!p) return [];
  const content = [
    `${p.name} — ${p.headline}.`,
    p.heroTagline,
    p.location ? `Based in ${p.location}.` : "",
    `Contact: ${p.email}, GitHub ${p.githubUrl}, LinkedIn ${p.linkedinUrl}.`,
    "",
    p.aboutMd,
  ]
    .filter(Boolean)
    .join("\n");
  return [{ sourceType: "profile", sourceId: p.id, content }];
}

async function experienceChunks(id?: string): Promise<Chunk[]> {
  const rows = await prisma.experience.findMany({
    where: id ? { id } : undefined,
    include: { bullets: { orderBy: { sortOrder: "asc" } } },
  });
  return rows.map((e) => ({
    sourceType: "experience" as const,
    sourceId: e.id,
    content: [
      `Experience: ${e.role} at ${e.organization}${
        e.location ? ` (${e.location})` : ""
      }, ${dateRange(e.startDate, e.endDate)}.`,
      e.summary ?? "",
      ...e.bullets.map((b) => `- ${b.text}`),
      e.techTags.length ? `Technologies: ${e.techTags.join(", ")}.` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  }));
}

async function educationChunks(id?: string): Promise<Chunk[]> {
  const rows = await prisma.education.findMany({
    where: id ? { id } : undefined,
  });
  return rows.map((e) => ({
    sourceType: "education" as const,
    sourceId: e.id,
    content: [
      `Education: ${e.degree}, ${e.institution}${
        e.location ? ` (${e.location})` : ""
      }, ${dateRange(e.startDate, e.endDate)}.`,
      e.gpa ? `GPA: ${e.gpa}.` : "",
      e.details ?? "",
    ]
      .filter(Boolean)
      .join("\n"),
  }));
}

async function projectChunks(id?: string): Promise<Chunk[]> {
  const rows = await prisma.project.findMany({
    where: id ? { id } : undefined,
  });
  return rows.map((p) => ({
    sourceType: "project" as const,
    sourceId: p.id,
    content: [
      `Project: ${p.title}${p.category ? ` (${p.category})` : ""} — ${p.tagline}`,
      p.description,
      p.techTags.length ? `Tech stack: ${p.techTags.join(", ")}.` : "",
      [
        p.githubUrl ? `GitHub: ${p.githubUrl}` : "",
        p.liveUrl ? `Live: ${p.liveUrl}` : "",
        p.demoVideoUrl ? `Demo: ${p.demoVideoUrl}` : "",
      ]
        .filter(Boolean)
        .join(" · "),
    ]
      .filter(Boolean)
      .join("\n"),
  }));
}

async function skillChunks(): Promise<Chunk[]> {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  const byCat = new Map<string, string[]>();
  for (const s of skills) {
    if (!byCat.has(s.category)) byCat.set(s.category, []);
    byCat.get(s.category)!.push(s.name);
  }
  return Array.from(byCat.entries()).map(([category, names]) => ({
    sourceType: "skills" as const,
    sourceId: category,
    content: `Skills — ${category}: ${names.join(", ")}.`,
  }));
}

async function favoriteChunks(): Promise<Chunk[]> {
  const favorites = await prisma.favorite.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  const byCat = new Map<string, string[]>();
  for (const f of favorites) {
    if (!byCat.has(f.category)) byCat.set(f.category, []);
    byCat
      .get(f.category)!
      .push(f.subtitle ? `${f.title} (${f.subtitle})` : f.title);
  }
  return Array.from(byCat.entries()).map(([category, items]) => ({
    sourceType: "favorites" as const,
    sourceId: category,
    content: `Krish's personal favorites — ${category}: ${items.join(", ")}.`,
  }));
}

export async function buildCorpus(): Promise<Chunk[]> {
  const [profile, exp, edu, proj, skills, favorites] = await Promise.all([
    profileChunks(),
    experienceChunks(),
    educationChunks(),
    projectChunks(),
    skillChunks(),
    favoriteChunks(),
  ]);
  return [...profile, ...exp, ...edu, ...proj, ...skills, ...favorites];
}

// ---------- Persistence ----------

async function insertChunks(chunks: Chunk[]): Promise<void> {
  if (chunks.length === 0) return;
  const vectors = await embed(chunks.map((c) => c.content));
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    const literal = toVectorLiteral(vectors[i]);
    await prisma.$executeRaw`
      INSERT INTO "Embedding" ("id", "sourceType", "sourceId", "content", "embedding")
      VALUES (${randomUUID()}, ${c.sourceType}, ${c.sourceId}, ${c.content}, ${literal}::vector)
    `;
  }
}

/**
 * Re-index a single content source after an admin edit. Best-effort:
 * if OpenAI isn't configured it no-ops (leaving any prior index intact).
 * `skills` ignores sourceId and rebuilds every category chunk.
 */
export async function reindexSource(
  sourceType: SourceType,
  sourceId: string
): Promise<void> {
  if (!hasOpenAI()) return;

  let chunks: Chunk[] = [];
  switch (sourceType) {
    case "profile":
      chunks = await profileChunks();
      break;
    case "experience":
      chunks = await experienceChunks(sourceId);
      break;
    case "education":
      chunks = await educationChunks(sourceId);
      break;
    case "project":
      chunks = await projectChunks(sourceId);
      break;
    case "skills":
      chunks = await skillChunks();
      break;
    case "favorites":
      chunks = await favoriteChunks();
      break;
  }

  // Skills and favorites are re-indexed as a whole set (chunked per category).
  if (sourceType === "skills" || sourceType === "favorites") {
    await prisma.$executeRaw`DELETE FROM "Embedding" WHERE "sourceType" = ${sourceType}`;
  } else {
    await prisma.$executeRaw`
      DELETE FROM "Embedding" WHERE "sourceType" = ${sourceType} AND "sourceId" = ${sourceId}
    `;
  }
  await insertChunks(chunks);
}

/** Delete a source's embeddings (used when a row is deleted in admin). */
export async function deleteSourceEmbeddings(
  sourceType: SourceType,
  sourceId: string
): Promise<void> {
  await prisma.$executeRaw`
    DELETE FROM "Embedding" WHERE "sourceType" = ${sourceType} AND "sourceId" = ${sourceId}
  `;
}

/** Full re-index: wipe the table and re-embed the entire corpus. */
export async function rebuildAll(): Promise<number> {
  if (!hasOpenAI()) {
    throw new Error("OPENAI_API_KEY is not set — cannot build embeddings.");
  }
  const corpus = await buildCorpus();
  await prisma.$executeRaw`TRUNCATE TABLE "Embedding"`;
  // Embed in one batch, then insert.
  const vectors = await embed(corpus.map((c) => c.content));
  for (let i = 0; i < corpus.length; i++) {
    const c = corpus[i];
    const literal = toVectorLiteral(vectors[i]);
    await prisma.$executeRaw`
      INSERT INTO "Embedding" ("id", "sourceType", "sourceId", "content", "embedding")
      VALUES (${randomUUID()}, ${c.sourceType}, ${c.sourceId}, ${c.content}, ${literal}::vector)
    `;
  }
  return corpus.length;
}
