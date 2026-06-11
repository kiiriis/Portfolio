import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { projectSchema } from "@/lib/validators";
import { reindexSource } from "@/lib/embeddings";
import { slugify } from "@/lib/utils";

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "project";
  let slug = root;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${root}-${n++}`;
  }
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const items = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const json = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { slug, ...rest } = parsed.data;
  const finalSlug = await uniqueSlug(slug || rest.title);
  const project = await prisma.project.create({
    data: { ...rest, slug: finalSlug },
  });

  try {
    await reindexSource("project", project.id);
  } catch (e) {
    console.error("reindex project failed", e);
  }

  return NextResponse.json(project, { status: 201 });
}
