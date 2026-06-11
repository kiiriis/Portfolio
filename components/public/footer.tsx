import { Github, Linkedin, Mail } from "lucide-react";
import type { Profile } from "@prisma/client";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="relative overflow-hidden border-t border-ink/25">
      {/* Watermark wordmark bleeding off the bottom edge, like an embossed stamp. */}
      <div
        aria-hidden
        className="pointer-events-none select-none text-center font-display text-[18vw] font-bold leading-[0.72] tracking-tight text-ink/[0.05]"
      >
        {profile.name.split(/\s+/)[0]}
      </div>

      <div className="container relative flex flex-col items-center justify-between gap-4 border-t border-ink/15 py-6 sm:flex-row">
        <p className="annotation text-muted-foreground">
          © {profile.name} · Next.js / Neon / a dash of AI
        </p>
        <p className="annotation hidden text-muted-foreground md:block">
          End of document <span className="text-primary">✦</span>
        </p>
        <div className="flex items-center gap-4 text-muted-foreground">
          <a
            href={`mailto:${profile.email}`}
            className="transition-colors hover:text-primary"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-primary"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-primary"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
