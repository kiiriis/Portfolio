import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { educationSchema } from "@/lib/validators";
import { reindexSource, deleteSourceEmbeddings } from "@/lib/embeddings";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const json = await req.json().catch(() => null);
  const parsed = educationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const edu = await prisma.education.update({
    where: { id },
    data: parsed.data,
  });
  try {
    await reindexSource("education", id);
  } catch (e) {
    console.error("reindex education failed", e);
  }
  return NextResponse.json(edu);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  await prisma.education.delete({ where: { id } });
  try {
    await deleteSourceEmbeddings("education", id);
  } catch (e) {
    console.error("delete education embeddings failed", e);
  }
  return NextResponse.json({ ok: true });
}
