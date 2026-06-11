"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

/** Sonner toaster that follows the active theme and uses token-based styling. */
export function AppToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-center"
      toastOptions={{
        style: {
          background: "hsl(var(--popover))",
          border: "1px solid hsl(var(--ink))",
          borderRadius: "2px",
          color: "hsl(var(--popover-foreground))",
          boxShadow: "4px 4px 0 0 hsl(var(--ink))",
        },
      }}
    />
  );
}
