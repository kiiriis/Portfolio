-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- NOTE: `prisma migrate diff` tries to DROP the pgvector HNSW index here because
-- it lives outside Prisma's schema (the embedding column is Unsupported). We must
-- keep it, so the spurious DROP INDEX was removed and the index is (re)asserted.
CREATE INDEX IF NOT EXISTS "embedding_hnsw_idx" ON "Embedding" USING hnsw (embedding vector_cosine_ops);
