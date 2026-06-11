import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { educationSchema } from "@/lib/validators";
import { reindexSource } from "@/lib/embeddings";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const items = await prisma.education.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const json = await req.json().catch(() => null);
  const parsed = educationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const edu = await prisma.education.create({ data: parsed.data });
  try {
    await reindexSource("education", edu.id);
  } catch (e) {
    console.error("reindex education failed", e);
  }
  return NextResponse.json(edu, { status: 201 });
}
