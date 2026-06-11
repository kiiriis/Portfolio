import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { projectSchema } from "@/lib/validators";
import { reindexSource, deleteSourceEmbeddings } from "@/lib/embeddings";
import { slugify } from "@/lib/utils";

async function uniqueSlug(base: string, excludeId: string): Promise<string> {
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const json = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { slug, ...rest } = parsed.data;
  const finalSlug = await uniqueSlug(slug || rest.title, id);
  const project = await prisma.project.update({
    where: { id },
    data: { ...rest, slug: finalSlug },
  });

  try {
    await reindexSource("project", id);
  } catch (e) {
    console.error("reindex project failed", e);
  }

  return NextResponse.json(project);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  await prisma.project.delete({ where: { id } });
  try {
    await deleteSourceEmbeddings("project", id);
  } catch (e) {
    console.error("delete project embeddings failed", e);
  }
  return NextResponse.json({ ok: true });
}
