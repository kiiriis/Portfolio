import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { experienceSchema } from "@/lib/validators";
import { reindexSource, deleteSourceEmbeddings } from "@/lib/embeddings";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const json = await req.json().catch(() => null);
  const parsed = experienceSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { bullets, ...fields } = parsed.data;
  await prisma.experienceBullet.deleteMany({ where: { experienceId: id } });
  const exp = await prisma.experience.update({
    where: { id },
    data: {
      ...fields,
      bullets: {
        create: bullets.map((text, i) => ({ text, sortOrder: i })),
      },
    },
  });

  try {
    await reindexSource("experience", id);
  } catch (e) {
    console.error("reindex experience failed", e);
  }

  return NextResponse.json(exp);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  await prisma.experience.delete({ where: { id } });
  try {
    await deleteSourceEmbeddings("experience", id);
  } catch (e) {
    console.error("delete experience embeddings failed", e);
  }
  return NextResponse.json({ ok: true });
}
