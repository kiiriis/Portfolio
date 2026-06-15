import { ExternalLink } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { normalizeImageUrl } from "@/lib/utils";
import type { FavoriteGroup } from "@/lib/data";
import type { Favorite } from "@prisma/client";

/** Posters/books read better tall; albums square. */
function aspectFor(category: string): string {
  if (/film|tv|movie|show|cinema|series|watch/i.test(category))
    return "aspect-[2/3]";
  if (/book|read|novel|literature/i.test(category)) return "aspect-[2/3]";
  return "aspect-square";
}

function FavoriteCard({ fav, aspect }: { fav: Favorite; aspect: string }) {
  const cover = normalizeImageUrl(fav.imageUrl);

  const body = (
    <>
      <div
        className={`relative ${aspect} overflow-hidden border border-ink bg-card shadow-hard-sm transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-hard`}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={fav.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/25 via-card to-card p-3 text-center">
            <span className="font-display text-base font-semibold leading-tight">
              {fav.title}
            </span>
          </div>
        )}
        {fav.url && (
          <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/85 text-foreground opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
            <ExternalLink className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <div className="mt-2.5">
        <p className="truncate text-sm font-medium leading-tight transition-colors group-hover:text-primary">
          {fav.title}
        </p>
        {fav.subtitle && (
          <p className="truncate font-mono text-[11px] text-muted-foreground">
            {fav.subtitle}
          </p>
        )}
        {fav.note && (
          <p className="mt-0.5 line-clamp-2 text-xs italic text-muted-foreground">
            {fav.note}
          </p>
        )}
      </div>
    </>
  );

  return fav.url ? (
    <a
      href={fav.url}
      target="_blank"
      rel="noreferrer"
      className="group block"
    >
      {body}
    </a>
  ) : (
    <div className="group block">{body}</div>
  );
}

export function FavoritesSection({ groups }: { groups: FavoriteGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <section
      id="personal"
      className="scroll-mt-20 border-y border-ink/15 bg-gradient-to-b from-primary/[0.06] via-card/40 to-background py-28"
    >
      <div className="container">
        <SectionHeading
          no="07"
          eyebrow="Off the Clock"
          title="Beyond the code"
          description="The stuff that doesn't fit on a résumé — what I'm listening to, watching, and reading. Tap a cover to check it out."
        />

        <div className="space-y-14">
          {groups.map((group, gi) => (
            <Reveal key={group.category} delay={Math.min(gi * 0.05, 0.15)}>
              <div>
                <div className="mb-5 flex items-center gap-4">
                  <span className="annotation text-primary">
                    {group.category}
                  </span>
                  <span className="h-px flex-1 bg-ink/15" />
                  <span className="annotation text-muted-foreground">
                    {group.items.length} pick
                    {group.items.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {group.items.map((fav) => (
                    <FavoriteCard
                      key={fav.id}
                      fav={fav}
                      aspect={aspectFor(group.category)}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
