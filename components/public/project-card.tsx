"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, PlayCircle, ArrowUpRight } from "lucide-react";
import type { Project } from "@prisma/client";

export function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const cover = project.images[0];
  const no = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="lift-card group relative flex flex-col border border-ink bg-card"
    >
      {/* Spec-sheet header strip */}
      <div className="annotation flex items-center justify-between border-b border-ink px-4 py-2.5 text-muted-foreground">
        <span className="transition-colors group-hover:text-primary">
          P—{no}
        </span>
        <span>{project.category ?? "Project"}</span>
        {project.featured && <span className="text-primary">✦ Featured</span>}
      </div>

      <button
        onClick={onOpen}
        className="relative aspect-[16/9] w-full overflow-hidden border-b border-ink text-left"
        aria-label={`Open ${project.title}`}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={project.title}
            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
          />
        ) : (
          <div className="bg-graph relative flex h-full w-full items-center justify-center bg-secondary/40">
            <span className="annotation border border-ink/30 bg-card px-3 py-1.5 text-ink-soft">
              {project.category ?? "Project"}
            </span>
          </div>
        )}
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center border border-ink bg-card text-foreground opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <button onClick={onOpen} className="text-left">
          <h3 className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
            {project.title}
          </h3>
        </button>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.tagline}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
          {project.techTags.slice(0, 4).map((t) => (
            <span key={t}>[{t}]</span>
          ))}
          {project.techTags.length > 4 && (
            <span>+{project.techTags.length - 4}</span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-ink/15 pt-4 text-muted-foreground">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="transition-colors hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="transition-colors hover:text-primary"
              aria-label="Live site"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.demoVideoUrl && (
            <a
              href={project.demoVideoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="transition-colors hover:text-primary"
              aria-label="Demo video"
            >
              <PlayCircle className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={onOpen}
            className="draw-link ml-auto pb-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground"
          >
            Details →
          </button>
        </div>
      </div>
    </motion.article>
  );
}
