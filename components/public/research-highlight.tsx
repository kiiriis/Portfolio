import ReactMarkdown from "react-markdown";
import { FlaskConical, Github, BookOpen } from "lucide-react";
import { Reveal } from "./reveal";
import { CountUp } from "./count-up";
import type { Project } from "@prisma/client";

/**
 * The one inverted panel on the page: research presented as a blueprint —
 * dark drafting-board ink, fine grid, paper-and-orange line work.
 */
export function ResearchHighlight({ project }: { project: Project }) {
  return (
    <section id="research" className="container scroll-mt-20 py-28">
      <Reveal>
        <div className="relative overflow-hidden border border-ink bg-[hsl(var(--blueprint))] text-[hsl(var(--blueprint-foreground))] shadow-hard">
          <div className="bg-blueprint-grid pointer-events-none absolute inset-0" />

          {/* Corner registration marks, inverted. */}
          <span className="reg-mark reg-mark-light absolute left-4 top-4" aria-hidden />
          <span className="reg-mark reg-mark-light absolute right-4 top-4" aria-hidden />
          <span className="reg-mark reg-mark-light absolute bottom-4 left-4" aria-hidden />
          <span className="reg-mark reg-mark-light absolute bottom-4 right-4" aria-hidden />

          <div className="relative p-8 md:p-14">
            <div className="annotation flex flex-wrap items-center justify-between gap-3 text-[hsl(var(--blueprint-foreground)/0.55)]">
              <span className="inline-flex items-center gap-2 text-primary">
                <FlaskConical className="h-4 w-4" />
                Fig. 03 — Research
              </span>
              <span>Master&apos;s thesis</span>
            </div>

            <h2 className="mt-6 max-w-3xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              {project.title}
            </h2>
            <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-[hsl(var(--blueprint-foreground)/0.7)]">
              {project.tagline}
            </p>

            <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr]">
              <div className="prose-portfolio !text-[hsl(var(--blueprint-foreground)/0.78)] [&_li::before]:!bg-primary [&_li]:!text-[hsl(var(--blueprint-foreground)/0.78)] [&_p]:!text-[hsl(var(--blueprint-foreground)/0.78)] [&_strong]:!text-primary">
                <ReactMarkdown>{project.description}</ReactMarkdown>
              </div>

              <div className="flex flex-col gap-6">
                <div className="border border-[hsl(var(--blueprint-foreground)/0.25)] bg-[hsl(var(--blueprint-foreground)/0.04)] p-7 text-center">
                  <div className="font-display text-6xl font-semibold tabular-nums text-primary">
                    <CountUp value="526K" />
                  </div>
                  <div className="annotation mt-3 text-[hsl(var(--blueprint-foreground)/0.55)]">
                    committed txns / second
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[11px] text-[hsl(var(--blueprint-foreground)/0.6)]">
                  {project.techTags.map((t) => (
                    <span key={t} className="transition-colors hover:text-primary">
                      [{t}]
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="draw-link inline-flex w-fit items-center gap-2 pb-1 font-mono text-xs uppercase tracking-[0.16em] text-primary"
                    >
                      <BookOpen className="h-4 w-4" /> Read the thesis
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="draw-link inline-flex w-fit items-center gap-2 pb-1 font-mono text-xs uppercase tracking-[0.16em] text-primary"
                    >
                      <Github className="h-4 w-4" /> View related code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
