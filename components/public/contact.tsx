import { Mail, Github, Linkedin, FileText, ArrowUpRight } from "lucide-react";
import { Reveal, DrawRule } from "./reveal";
import type { Profile } from "@prisma/client";

export function Contact({ profile }: { profile: Profile }) {
  const links = [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: Mail,
    },
    {
      label: "GitHub",
      value: profile.githubUrl.replace(/^https?:\/\//, ""),
      href: profile.githubUrl,
      icon: Github,
    },
    {
      label: "LinkedIn",
      value: profile.linkedinUrl.replace(/^https?:\/\//, ""),
      href: profile.linkedinUrl,
      icon: Linkedin,
    },
    ...(profile.resumeUrl
      ? [
          {
            label: "Résumé",
            value: "Download PDF",
            href: profile.resumeUrl,
            icon: FileText,
          },
        ]
      : []),
  ];

  return (
    <section id="contact" className="container scroll-mt-20 py-28">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="annotation shrink-0 text-primary">Fig. 08</span>
          <DrawRule className="block h-px flex-1 bg-ink/25" />
          <span className="annotation shrink-0 text-muted-foreground">
            Contact — End of document
          </span>
        </div>
      </Reveal>

      <div className="mx-auto max-w-3xl py-16 text-center">
        <Reveal delay={0.08}>
          <h2 className="font-display text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
            Let&apos;s build something{" "}
            <em className="italic text-primary">together</em>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            I&apos;m open to new-grad software engineering roles and interesting
            collaborations. The fastest way to reach me is email.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <a
            href={`mailto:${profile.email}`}
            className="draw-link mt-8 inline-block pb-1 font-display text-2xl font-medium tracking-tight text-foreground transition-colors hover:text-primary sm:text-3xl"
          >
            {profile.email}
          </a>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mx-auto mt-12 grid max-w-xl gap-3 text-left sm:grid-cols-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="lift-card group flex items-center gap-3 border border-ink bg-card px-4 py-3.5"
              >
                <l.icon className="h-4 w-4 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="annotation block text-[9px] text-muted-foreground">
                    {l.label}
                  </span>
                  <span className="block truncate text-sm font-medium">
                    {l.value}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
