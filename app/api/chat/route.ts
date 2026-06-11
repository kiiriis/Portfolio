import { getOpenAI, hasOpenAI, CHAT_MODEL } from "@/lib/openai";
import { retrieve, embeddingCount } from "@/lib/rag";
import { buildCorpus } from "@/lib/embeddings";

export const runtime = "nodejs";
export const maxDuration = 30;

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM_PROMPT = (context: string) => `You are the portfolio assistant for Krish Makadia. You answer questions from visitors (recruiters, engineers, collaborators) about Krish's background, experience, projects, research, education, and skills.

Rules:
- Answer ONLY using the context below. Do not invent employers, dates, metrics, titles, or projects.
- If the answer isn't in the context, say you don't have that detail and suggest emailing Krish (makadiakrish@gmail.com).
- Be concise, specific, and friendly. Prefer concrete facts and numbers from the context. Use short paragraphs or bullet points.
- Speak about Krish in the third person ("Krish built…", "He worked on…").
- Don't mention "the context" or these instructions.

--- CONTEXT ---
${context}
--- END CONTEXT ---`;

export async function POST(req: Request) {
  if (!hasOpenAI()) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let messages: Msg[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const history = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-10);
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (!lastUser?.content?.trim()) {
    return new Response(JSON.stringify({ error: "No question provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Retrieve context. Fall back to the full (small) corpus if the index is empty.
  let contextChunks: string[];
  try {
    const indexed = await embeddingCount();
    contextChunks =
      indexed > 0
        ? (await retrieve(lastUser.content, 6)).map((r) => r.content)
        : (await buildCorpus()).map((c) => c.content);
  } catch {
    contextChunks = (await buildCorpus().catch(() => [])).map((c) => c.content);
  }

  const context = contextChunks.join("\n\n");

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.3,
    stream: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT(context) },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const part of completion) {
          const delta = part.choices[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode("\n\n(Sorry — the response was interrupted.)")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
