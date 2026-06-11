import OpenAI from "openai";

let client: OpenAI | null = null;

export function hasOpenAI(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
export const EMBED_MODEL =
  process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";
export const EMBED_DIM = 1536;
