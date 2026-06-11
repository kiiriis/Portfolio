import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  Database,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { hasOpenAI } from "@/lib/openai";
import { embeddingCount } from "@/lib/rag";
import { RebuildButton } from "@/components/admin/rebuild-button";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [projects, experiences, education, skills, embeds] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.skill.count(),
    embeddingCount().catch(() => 0),
  ]);
  const openai = hasOpenAI();

  const cards = [
    { label: "Profile", href: "/admin/profile", icon: User, value: "Edit" },
    {
      label: "Experience",
      href: "/admin/experiences",
      icon: Briefcase,
      value: experiences,
    },
    {
      label: "Education",
      href: "/admin/education",
      icon: GraduationCap,
      value: education,
    },
    {
      label: "Projects",
      href: "/admin/projects",
      icon: FolderGit2,
      value: projects,
    },
    { label: "Skills", href: "/admin/skills", icon: Wrench, value: skills },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your portfolio content. Changes appear on the site immediately.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="group rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/40"
          >
            <c.icon className="h-5 w-5 text-primary" />
            <div className="mt-3 font-display text-2xl font-bold">
              {c.value}
            </div>
            <div className="text-sm text-muted-foreground group-hover:text-foreground">
              {c.label}
            </div>
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Database className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold">
              Chatbot knowledge index
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The RAG chatbot answers visitor questions from your content.
              Edits re-index automatically; use this to do a full rebuild.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="inline-flex items-center gap-1.5">
                {openai ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                )}
                OpenAI key {openai ? "configured" : "missing"}
              </span>
              <span className="text-muted-foreground">
                {embeds} chunk{embeds === 1 ? "" : "s"} indexed
              </span>
            </div>

            {!openai && (
              <p className="mt-2 text-xs text-amber-400/90">
                Add <code className="font-mono">OPENAI_API_KEY</code> to your
                environment to enable the chatbot, then rebuild.
              </p>
            )}

            <div className="mt-4">
              <RebuildButton hasKey={openai} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
