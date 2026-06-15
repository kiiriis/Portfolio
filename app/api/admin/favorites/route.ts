import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { favoriteSchema } from "@/lib/validators";
import { reindexSource } from "@/lib/embeddings";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const items = await prisma.favorite.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const json = await req.json().catch(() => null);
  const parsed = favoriteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const fav = await prisma.favorite.create({ data: parsed.data });
  try {
    await reindexSource("favorites", "");
  } catch (e) {
    console.error("reindex favorites failed", e);
  }
  return NextResponse.json(fav, { status: 201 });
}
