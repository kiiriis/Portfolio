"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

type VTDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export function ThemeToggle({
  className,
  variant = "icon",
}: {
  className?: string;
  variant?: "icon" | "row";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const toggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const next = isDark ? "light" : "dark";
      const doc = document as VTDocument;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Fallback: just switch (no View Transitions support or reduced motion).
      if (!doc.startViewTransition || reduced) {
        setTheme(next);
        return;
      }

      // Circular reveal centered on the click point (the toggle button).
      const x = e?.clientX ?? window.innerWidth - 24;
      const y = e?.clientY ?? 24;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = doc.startViewTransition(() => setTheme(next));
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 520,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    },
    [isDark, setTheme]
  );

  if (variant === "row") {
    return (
      <button
        onClick={(e) => toggle(e)}
        className={cn(
          "flex items-center gap-3 px-1 py-3 font-mono text-sm uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-primary",
          className
        )}
        aria-label="Toggle color theme"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme"}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => toggle(e)}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center overflow-hidden border border-transparent text-muted-foreground transition-colors hover:border-ink hover:text-foreground",
        className
      )}
      aria-label="Toggle color theme"
      title={isDark ? "Switch to light" : "Switch to dark"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ y: 14, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.18 }}
          className="absolute"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
