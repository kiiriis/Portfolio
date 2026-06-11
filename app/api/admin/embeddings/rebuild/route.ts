import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { hasOpenAI } from "@/lib/openai";
import { rebuildAll } from "@/lib/embeddings";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!hasOpenAI()) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    const count = await rebuildAll();
    return NextResponse.json({ ok: true, count });
  } catch (e) {
    console.error("rebuild embeddings failed", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Rebuild failed" },
      { status: 500 }
    );
  }
}
