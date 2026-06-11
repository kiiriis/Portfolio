import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { experienceSchema } from "@/lib/validators";
import { reindexSource } from "@/lib/embeddings";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const items = await prisma.experience.findMany({
    orderBy: { sortOrder: "asc" },
    include: { bullets: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const json = await req.json().catch(() => null);
  const parsed = experienceSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { bullets, ...fields } = parsed.data;
  const exp = await prisma.experience.create({
    data: {
      ...fields,
      bullets: {
        create: bullets.map((text, i) => ({ text, sortOrder: i })),
      },
    },
  });

  try {
    await reindexSource("experience", exp.id);
  } catch (e) {
    console.error("reindex experience failed", e);
  }

  return NextResponse.json(exp, { status: 201 });
}
