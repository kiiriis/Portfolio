import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { profileSchema } from "@/lib/validators";
import { reindexSource } from "@/lib/embeddings";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const profile = await prisma.profile.findUnique({
    where: { id: "singleton" },
  });
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const json = await req.json().catch(() => null);
  const parsed = profileSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const profile = await prisma.profile.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  try {
    await reindexSource("profile", "singleton");
  } catch (e) {
    console.error("reindex profile failed", e);
  }

  return NextResponse.json(profile);
}
