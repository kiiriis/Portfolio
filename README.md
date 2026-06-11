# Krish Makadia — Portfolio

A personal portfolio site with a built-in **RAG chatbot** ("Ask about Krish") and a
password-protected **admin dashboard** for managing all content without touching code.

- **Public site** — hero, about, experience timeline, research highlight, filterable
  projects (with demo-video embeds), education, skills, contact. Sleek dark UI.
- **Admin** (`/admin`) — add/edit/delete projects, experience, education, skills, and
  profile via forms. Paste demo-video / live / GitHub links; paste or upload images.
- **Chatbot** — answers visitor questions grounded in your real content (RAG over
  pgvector, powered by OpenAI).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion ·
Prisma 6 · Neon Postgres (+ `pgvector`) · OpenAI (chat + embeddings) · iron-session.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

Environment variables live in `.env` (already created for local dev; see `.env.example`).
The Neon database is provisioned and migrated, and content is seeded.

### Enable the chatbot

The chatbot needs an OpenAI key (chat answers + embeddings):

1. Put your key in `.env`:
   ```
   OPENAI_API_KEY="sk-..."
   ```
2. Build the knowledge index from your content:
   ```bash
   npm run embeddings:rebuild
   ```
   (Or log into `/admin` → **Rebuild chatbot index**.)

Until a key is set, the chat widget responds gracefully that it isn't configured yet;
the rest of the site works fully.

### Admin

Visit `/login` and enter `ADMIN_PASSWORD` (in `.env`). Then manage everything at
`/admin`. Every content edit **re-indexes the chatbot automatically** (when the OpenAI
key is set). The "Research" project category renders as the highlighted thesis section.

### Résumé PDF

Drop your file at `public/resume.pdf`, then set the Résumé URL to `/resume.pdf` in
**Admin → Profile** (or paste any public PDF link).

## Useful commands

```bash
npm run dev                 # dev server
npm run build && npm start  # production build + serve
npm run seed                # (re)load base content (idempotent)
npm run embeddings:rebuild  # rebuild the RAG index (needs OPENAI_API_KEY)
npm run db:studio           # browse the database
npm run db:migrate          # apply migrations (prod)
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel (Next.js auto-detected; build runs `prisma generate && next build`).
3. Set environment variables in Vercel (from `.env.example`):
   `DATABASE_URL`, `DIRECT_URL`, `OPENAI_API_KEY`, `OPENAI_CHAT_MODEL`,
   `OPENAI_EMBED_MODEL`, `ADMIN_PASSWORD`, `SESSION_SECRET`,
   `NEXT_PUBLIC_SITE_URL` (your deployed URL), and optionally `BLOB_READ_WRITE_TOKEN`.
   You can reuse the local Neon connection strings, or use the Vercel ↔ Neon integration.
4. After the first deploy, run migrations + seed against the prod DB if it's new:
   ```bash
   DATABASE_URL=<prod-pooled> DIRECT_URL=<prod-direct> npm run db:migrate
   DATABASE_URL=<prod-pooled> npm run seed
   OPENAI_API_KEY=<key> DATABASE_URL=<prod-pooled> npm run embeddings:rebuild
   ```
   (The current Neon DB is already migrated + seeded, so if you reuse it, skip this.)
5. For image uploads, create a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN`.
   Without it, the admin still accepts pasted image URLs.

## Project layout

```
app/                 # routes: public page, /login, /admin/*, /api/*
  api/chat           # streaming RAG chat endpoint
  api/admin/*         # guarded CRUD + embeddings rebuild + upload
components/
  public/            # portfolio sections
  admin/             # dashboard managers & forms
  chat/              # floating chat widget
  ui/                # shadcn-style primitives
lib/
  db.ts  data.ts     # Prisma client + server read helpers
  session.ts         # iron-session admin auth
  openai.ts embeddings.ts rag.ts   # RAG core
  validators.ts      # zod schemas
prisma/schema.prisma # data model (+ pgvector Embedding)
scripts/             # seed.ts, rebuild-embeddings.ts
```
