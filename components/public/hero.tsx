"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};
const lineUp = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const MARQUEE = [
  "Distributed systems",
  "Raft consensus — 526K txn/s",
  "Full-stack engineering",
  "Applied AI · RAG",
  "1.2 TB satellite imagery / day",
  "Systems that survive failure",
];

/** Rotating circular stamp — "available for work" rendered like a document seal. */
function Stamp() {
  return (
    <div className="relative h-36 w-36 select-none">
      <svg
        viewBox="0 0 144 144"
        className="h-full w-full animate-spin-slow"
        aria-hidden
      >
        <defs>
          <path
            id="stamp-circle"
            d="M 72,72 m -54,0 a 54,54 0 1,1 108,0 a 54,54 0 1,1 -108,0"
          />
        </defs>
        <circle
          cx="72"
          cy="72"
          r="70"
          fill="none"
          stroke="hsl(var(--ink) / 0.35)"
          strokeWidth="1"
        />
        <text className="fill-ink font-mono text-[11px] uppercase tracking-[0.26em]">
          <textPath href="#stamp-circle">
            Open to work · new grad 2026 · open to work ·
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <ArrowDown className="h-6 w-6 text-primary" />
      </span>
    </div>
  );
}

export function Hero({
  name,
  headline,
  heroTagline,
  location,
  email,
  githubUrl,
  linkedinUrl,
  resumeUrl,
}: {
  name: string;
  headline: string;
  heroTagline: string;
  location?: string | null;
  email: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  resumeUrl?: string | null;
}) {
  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.join(" ");

  return (
    <section id="top" className="relative overflow-hidden border-b border-ink/20">
      <div className="bg-graph bg-graph-fade pointer-events-none absolute inset-0" />

      <div className="container relative flex min-h-[92vh] flex-col justify-center pb-20 pt-32">
        {/* Registration marks pin the page like a printed sheet. */}
        <span className="reg-mark absolute left-6 top-24" aria-hidden />
        <span className="reg-mark absolute right-6 top-24" aria-hidden />
        <span className="reg-mark absolute bottom-24 left-6" aria-hidden />
        <span className="reg-mark absolute bottom-24 right-6" aria-hidden />

        <motion.div variants={container} initial="hidden" animate="show">
          {/* Document meta line */}
          <motion.div
            variants={item}
            className="annotation flex flex-wrap items-center justify-between gap-3 text-muted-foreground"
          >
            <span>
              Portfolio — Doc. No.{" "}
              <span className="text-foreground">KM-2026</span> / Rev. A
            </span>
            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> {location}
              </span>
            )}
          </motion.div>

          <motion.div variants={item} className="mt-10">
            <span className="inline-flex items-center gap-2.5 border border-ink/40 bg-card px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              <span className="h-2 w-2 animate-pulse-dot bg-primary" />
              Available for new-grad SWE roles · 2026
            </span>
          </motion.div>

          {/* The name, set like a masthead. */}
          <h1 className="mt-6 font-display font-semibold leading-[0.95] tracking-tight">
            <span className="block overflow-hidden">
              <motion.span
                variants={lineUp}
                className="block text-[clamp(3.6rem,11.5vw,9.5rem)]"
              >
                {firstName}
              </motion.span>
            </span>
            {lastName && (
              <span className="block overflow-hidden">
                <motion.span
                  variants={lineUp}
                  className="block text-[clamp(3.6rem,11.5vw,9.5rem)] italic text-primary"
                >
                  {lastName}
                </motion.span>
              </span>
            )}
          </h1>

          <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <motion.p
                variants={item}
                className="max-w-xl font-display text-2xl font-medium leading-snug text-balance sm:text-3xl"
              >
                {headline}
              </motion.p>
              <motion.p
                variants={item}
                className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground"
              >
                {heroTagline}
              </motion.p>

              <motion.div
                variants={item}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-background transition-all hover:-translate-x-1 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground hover:shadow-hard"
                >
                  View projects
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 border border-ink bg-transparent px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard"
                >
                  Get in touch
                </a>
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 border border-ink bg-transparent px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground hover:shadow-hard"
                  >
                    <FileText className="h-4 w-4" /> Résumé
                  </a>
                )}
              </motion.div>

              <motion.div
                variants={item}
                className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground"
              >
                <a
                  href={`mailto:${email}`}
                  className="draw-link inline-flex items-center gap-1.5 pb-0.5 transition-colors hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5" /> {email}
                </a>
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="draw-link inline-flex items-center gap-1.5 pb-0.5 transition-colors hover:text-foreground"
                  >
                    <Github className="h-3.5 w-3.5" /> GitHub
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="draw-link inline-flex items-center gap-1.5 pb-0.5 transition-colors hover:text-foreground"
                  >
                    <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                  </a>
                )}
              </motion.div>
            </div>

            <motion.div
              variants={item}
              className="hidden justify-end pr-4 lg:flex"
            >
              <Stamp />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Ticker tape of what the document covers. */}
      <div className="relative border-t border-ink/20 bg-card/60 py-3.5">
        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            {[...MARQUEE, ...MARQUEE].map((t, i) => (
              <span key={i} className="flex items-center gap-8">
                <span>{t}</span>
                <span className="text-primary">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
