"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Github, ExternalLink, PlayCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectCard } from "./project-card";
import { youTubeId } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Project } from "@prisma/client";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const [filter, setFilter] = React.useState("All");
  const [active, setActive] = React.useState<Project | null>(null);

  const visible = projects.filter(
    (p) => filter === "All" || p.category === filter
  );

  return (
    <>
      {categories.length > 2 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all",
                filter === c
                  ? "border-ink bg-ink text-background shadow-hard-sm"
                  : "border-ink/30 text-muted-foreground hover:border-ink hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              onOpen={() => setActive(p)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl rounded-none border-ink shadow-hard">
          {active && <ProjectDetail project={active} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const yt = youTubeId(project.demoVideoUrl);
  return (
    <>
      <DialogHeader>
        {project.category && (
          <span className="annotation text-primary">
            Spec sheet — {project.category}
          </span>
        )}
        <DialogTitle className="pt-1 font-display text-3xl font-semibold tracking-tight">
          {project.title}
        </DialogTitle>
        <p className="text-pretty text-muted-foreground">{project.tagline}</p>
      </DialogHeader>

      {yt ? (
        <div className="aspect-video w-full overflow-hidden border border-ink">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${yt}`}
            title={`${project.title} demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        project.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full border border-ink"
          />
        )
      )}

      <div className="prose-portfolio text-sm">
        <ReactMarkdown>{project.description}</ReactMarkdown>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[11px] text-muted-foreground">
        {project.techTags.map((t) => (
          <span key={t}>[{t}]</span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-all hover:-translate-y-0.5 hover:shadow-hard-sm"
          >
            <Github className="h-4 w-4" /> Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-background transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-hard-sm"
          >
            <ExternalLink className="h-4 w-4" /> Live site
          </a>
        )}
        {project.demoVideoUrl && !yt && (
          <a
            href={project.demoVideoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-all hover:-translate-y-0.5 hover:shadow-hard-sm"
          >
            <PlayCircle className="h-4 w-4" /> Demo video
          </a>
        )}
      </div>
    </>
  );
}
