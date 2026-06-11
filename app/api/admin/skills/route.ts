import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { reindexSource } from "@/lib/embeddings";
import { slugify } from "@/lib/utils";

const bulkSchema = z.object({
  groups: z.array(
    z.object({
      category: z.string().min(1),
      names: z.array(z.string().min(1)),
    })
  ),
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json(skills);
}

/** Bulk replace: wipes all skills and recreates from the provided groups. */
export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const json = await req.json().catch(() => null);
  const parsed = bulkSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const rows = parsed.data.groups.flatMap((g) =>
    g.names.map((name, i) => ({
      id: `skill-${slugify(g.category)}-${slugify(name)}`,
      category: g.category,
      name,
      sortOrder: i,
    }))
  );

  await prisma.$transaction([
    prisma.skill.deleteMany({}),
    prisma.skill.createMany({ data: rows, skipDuplicates: true }),
  ]);

  try {
    await reindexSource("skills", "");
  } catch (e) {
    console.error("reindex skills failed", e);
  }

  return NextResponse.json({ ok: true, count: rows.length });
}
