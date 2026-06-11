import "server-only";
import { prisma } from "@/lib/db";
import { embedOne } from "@/lib/embeddings";

export type RetrievedChunk = {
  content: string;
  sourceType: string;
  distance: number;
};

/** Embed the question and return the k most similar content chunks (cosine). */
export async function retrieve(
  question: string,
  k = 6
): Promise<RetrievedChunk[]> {
  const v = await embedOne(question);
  const literal = `[${v.join(",")}]`;
  const rows = await prisma.$queryRaw<RetrievedChunk[]>`
    SELECT "content", "sourceType", ("embedding" <=> ${literal}::vector) AS distance
    FROM "Embedding"
    ORDER BY "embedding" <=> ${literal}::vector
    LIMIT ${k}
  `;
  return rows;
}

/** Total number of indexed chunks (used to detect an empty index). */
export async function embeddingCount(): Promise<number> {
  const rows = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS count FROM "Embedding"
  `;
  return Number(rows[0]?.count ?? 0);
}
