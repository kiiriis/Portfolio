import { Reveal } from "./reveal";
import { dateRange } from "@/lib/utils";
import type { Education as Edu } from "@prisma/client";

export function Education({ education }: { education: Edu[] }) {
  if (education.length === 0) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {education.map((e, i) => (
        <Reveal key={e.id} delay={i * 0.08}>
          <div className="lift-card h-full border border-ink bg-card">
            <div className="annotation flex items-center justify-between border-b border-ink px-5 py-2.5 text-muted-foreground">
              <span>Edu—{String(i + 1).padStart(2, "0")}</span>
              <span>{dateRange(e.startDate, e.endDate)}</span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl font-semibold leading-snug tracking-tight">
                {e.degree}
              </h3>
              <p className="annotation mt-2 text-primary">{e.institution}</p>
              {e.gpa && (
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  GPA — <span className="text-foreground">{e.gpa}</span>
                </p>
              )}
              {e.details && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {e.details}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
