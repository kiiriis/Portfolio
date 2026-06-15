import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { favoriteSchema } from "@/lib/validators";
import { reindexSource } from "@/lib/embeddings";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  const json = await req.json().catch(() => null);
  const parsed = favoriteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const fav = await prisma.favorite.update({
    where: { id },
    data: parsed.data,
  });
  try {
    await reindexSource("favorites", "");
  } catch (e) {
    console.error("reindex favorites failed", e);
  }
  return NextResponse.json(fav);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;

  await prisma.favorite.delete({ where: { id } });
  try {
    await reindexSource("favorites", "");
  } catch (e) {
    console.error("reindex favorites failed", e);
  }
  return NextResponse.json({ ok: true });
}
