import ReactMarkdown from "react-markdown";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { CountUp } from "./count-up";

const STATS = [
  { value: "526K", label: "Raft txns / second" },
  { value: "1.2 TB", label: "imagery processed / day" },
  { value: "50+", label: "web solutions shipped" },
  { value: "3.84", label: "graduate GPA" },
];

export function About({ aboutMd }: { aboutMd: string }) {
  return (
    <section id="about" className="container scroll-mt-20 py-28">
      <SectionHeading no="01" eyebrow="About" title="A bit about me" />
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <div className="prose-portfolio drop-cap text-base">
            <ReactMarkdown>{aboutMd}</ReactMarkdown>
          </div>
        </Reveal>

        {/* Nameplate: measured values, riveted to the page. */}
        <Reveal delay={0.12}>
          <div className="relative border border-ink bg-card shadow-hard-sm">
            <div className="annotation flex items-center justify-between border-b border-ink px-5 py-3 text-muted-foreground">
              <span>Data plate</span>
              <span className="text-primary">Measured values</span>
            </div>
            <dl>
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={
                    "flex items-baseline justify-between gap-4 px-5 py-4" +
                    (i > 0 ? " border-t border-ink/15" : "")
                  }
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="font-display text-3xl font-semibold tabular-nums text-foreground">
                    <CountUp value={s.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
