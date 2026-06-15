-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "note" TEXT,
    "url" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Favorite_category_idx" ON "Favorite"("category");

-- NOTE: `prisma migrate diff` also wants to DROP the pgvector HNSW index (it lives
-- outside Prisma's schema). We keep it — drop removed, index re-asserted.
CREATE INDEX IF NOT EXISTS "embedding_hnsw_idx" ON "Embedding" USING hnsw (embedding vector_cosine_ops);
