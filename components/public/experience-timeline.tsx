import { Reveal, DrawRule } from "./reveal";
import { SectionHeading } from "./section-heading";
import { dateRange } from "@/lib/utils";
import type { ExperienceWithBullets } from "@/lib/data";

/** Ledger-style experience log: numbered entries under hairline rules. */
export function ExperienceTimeline({
  experiences,
}: {
  experiences: ExperienceWithBullets[];
}) {
  if (experiences.length === 0) return null;
  return (
    <section id="experience" className="container scroll-mt-20 py-28">
      <SectionHeading
        no="02"
        eyebrow="Experience"
        title="Where I've worked"
        description="Research, full-stack engineering, and large-scale ML infrastructure."
      />

      <div>
        {experiences.map((exp, i) => (
          <Reveal key={exp.id} delay={Math.min(i * 0.06, 0.2)}>
            <article className="group relative">
              <DrawRule className="block h-px w-full bg-ink/30" />
              <div className="grid gap-x-8 gap-y-3 py-8 md:grid-cols-[100px_1fr_auto] md:py-10">
                <span className="annotation pt-1.5 text-muted-foreground transition-colors group-hover:text-primary">
                  Exp—{String(i + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {exp.role}
                  </h3>
                  <p className="annotation mt-2 text-primary">
                    {exp.organization}
                    {exp.location && (
                      <span className="text-muted-foreground">
                        {" "}
                        · {exp.location}
                      </span>
                    )}
                  </p>

                  <ul className="mt-5 max-w-2xl space-y-2.5">
                    {exp.bullets.map((b) => (
                      <li
                        key={b.id}
                        className="flex gap-3 text-sm leading-relaxed text-ink-soft"
                      >
                        <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-primary" />
                        <span className="text-pretty">{b.text}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.techTags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[11px] text-muted-foreground">
                      {exp.techTags.map((t) => (
                        <span
                          key={t}
                          className="transition-colors hover:text-primary"
                        >
                          [{t}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <span className="annotation pt-1.5 text-muted-foreground md:text-right">
                  {dateRange(exp.startDate, exp.endDate)}
                </span>
              </div>
            </article>
          </Reveal>
        ))}
        <DrawRule className="block h-px w-full bg-ink/30" />
      </div>
    </section>
  );
}
