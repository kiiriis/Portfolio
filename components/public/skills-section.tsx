import { Reveal, DrawRule } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { SkillGroup } from "@/lib/data";

/** Skills set as a bill of materials: category rows with part-like entries. */
export function SkillsSection({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <section id="skills" className="container scroll-mt-20 py-28">
      <SectionHeading
        no="06"
        eyebrow="Skills"
        title="Bill of materials"
        description="From systems programming and consensus protocols to full-stack web and applied AI."
      />

      <div>
        {groups.map((group, i) => (
          <Reveal key={group.category} delay={Math.min(i * 0.06, 0.18)}>
            <div className="group/row">
              <DrawRule className="block h-px w-full bg-ink/30" />
              <div className="grid gap-x-8 gap-y-3 py-6 md:grid-cols-[220px_1fr]">
                <div className="annotation pt-2 text-muted-foreground transition-colors group-hover/row:text-primary">
                  <span className="mr-3 text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {group.category}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((s) => (
                    <span
                      key={s.id}
                      className="cursor-default border border-ink/30 bg-card px-3 py-1.5 font-mono text-xs text-ink-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
        <DrawRule className="block h-px w-full bg-ink/30" />
      </div>
    </section>
  );
}
