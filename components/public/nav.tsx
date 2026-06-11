"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, FileText, Github } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "#about", label: "About", no: "01" },
  { href: "#experience", label: "Experience", no: "02" },
  { href: "#projects", label: "Projects", no: "04" },
  { href: "#skills", label: "Skills", no: "06" },
  { href: "#contact", label: "Contact", no: "07" },
];

export function Nav({
  name,
  resumeUrl,
  githubUrl,
}: {
  name: string;
  resumeUrl?: string | null;
  githubUrl?: string | null;
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mark = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-all duration-300",
        scrolled
          ? "border-ink/20 bg-background/85 backdrop-blur-md"
          : "border-transparent"
      )}
    >
      <nav className="container flex h-16 items-center justify-between">
        <a href="#top" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border border-ink bg-background font-display text-sm font-bold transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            {mark}
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-sm font-semibold">{name}</span>
            <span className="annotation mt-1 text-[9px] text-muted-foreground">
              Spec sheet · Rev 2026
            </span>
          </span>
        </a>

        <div className="hidden items-center md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="mr-1 text-[9px] text-primary">{l.no}</span>
              <span className="draw-link pb-0.5">{l.label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 w-9 items-center justify-center border border-transparent text-muted-foreground transition-colors hover:border-ink hover:text-foreground sm:flex"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 border border-ink bg-background px-3.5 py-2 font-mono text-xs font-medium uppercase tracking-[0.14em] transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-hard-sm sm:inline-flex"
            >
              <FileText className="h-3.5 w-3.5" />
              Résumé
            </a>
          )}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center border border-ink text-foreground md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Redline scroll progress along the header's bottom edge. */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-primary"
        style={{ scaleX: progress }}
      />

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-ink/20 bg-background/95 backdrop-blur-md md:hidden"
          >
            <div className="container flex flex-col py-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-3 border-b border-ink/10 px-1 py-3 font-mono text-sm uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-primary"
                >
                  <span className="text-[10px] text-primary">{l.no}</span>
                  {l.label}
                </a>
              ))}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 flex items-center gap-2 px-1 font-mono text-sm font-medium uppercase tracking-[0.14em] text-primary"
                >
                  <FileText className="h-4 w-4" />
                  Résumé
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
