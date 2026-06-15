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

export function About({
  aboutMd,
  photos = [],
  name,
}: {
  aboutMd: string;
  photos?: string[];
  name: string;
}) {
  const [portrait, ...rest] = photos;

  return (
    <section id="about" className="container scroll-mt-20 py-28">
      <SectionHeading no="01" eyebrow="About" title="A bit about me" />
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <div className="prose-portfolio drop-cap text-base">
            <ReactMarkdown>{aboutMd}</ReactMarkdown>
          </div>
        </Reveal>

        <div className="space-y-6">
          {/* Portrait: a photo mounted like an ID plate on the document. */}
          {portrait && (
            <Reveal delay={0.08}>
              <figure className="group relative border border-ink bg-card shadow-hard-sm">
                <figcaption className="annotation flex items-center justify-between border-b border-ink px-5 py-3 text-muted-foreground">
                  <span>Fig. 01 — Portrait</span>
                  <span className="text-primary">{name.split(/\s+/)[0]}</span>
                </figcaption>
                <div className="relative aspect-[4/5] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={portrait}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                {rest.length > 0 && (
                  <div className="grid grid-cols-3 gap-px border-t border-ink bg-ink">
                    {rest.slice(0, 3).map((src, i) => (
                      <div
                        key={i}
                        className="aspect-square overflow-hidden bg-card"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`${name} — ${i + 2}`}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </figure>
            </Reveal>
          )}

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
      </div>
    </section>
  );
}
