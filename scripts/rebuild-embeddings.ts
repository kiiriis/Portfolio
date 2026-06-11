/**
 * Rebuilds the entire RAG embedding index from current DB content.
 * Requires OPENAI_API_KEY in .env. Run after seeding or any bulk content change:
 *   npm run embeddings:rebuild
 */
import { config } from "dotenv";
config();

import { rebuildAll } from "../lib/embeddings";
import { prisma } from "../lib/db";

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error(
      "✗ OPENAI_API_KEY is not set in .env — add it, then re-run this command."
    );
    process.exit(1);
  }
  console.log("Rebuilding embedding index…");
  const count = await rebuildAll();
  console.log(`✓ Indexed ${count} chunks.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
