import { Reveal, DrawRule } from "./reveal";
import { cn } from "@/lib/utils";

/**
 * Document-style section header:
 *   FIG. 02 ———————————————— EXPERIENCE
 *   Where I've worked
 */
export function SectionHeading({
  no,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  no?: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("mb-12", className)}>
      <Reveal>
        <div className="flex items-center gap-4">
          {no && (
            <span className="annotation shrink-0 text-primary">
              FIG. {no}
            </span>
          )}
          <DrawRule className="block h-px flex-1 bg-ink/25" />
          <span className="annotation shrink-0 text-muted-foreground">
            {eyebrow}
          </span>
        </div>
      </Reveal>
      <div
        className={cn(
          "mt-6 max-w-2xl",
          align === "center" && "mx-auto text-center"
        )}
      >
        <Reveal delay={0.08}>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {title}
          </h2>
        </Reveal>
        {description && (
          <Reveal delay={0.16}>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
