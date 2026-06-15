"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Save, LinkIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/admin/field";
import { ImageInput } from "@/components/admin/image-input";
import type { Favorite } from "@prisma/client";

const CATEGORY_SUGGESTIONS = ["Music", "Film & TV", "Books"];

type Draft = {
  category: string;
  title: string;
  subtitle: string;
  note: string;
  url: string;
  imageUrl: string;
  sortOrder: number;
};

function toDraft(f?: Favorite | null): Draft {
  return {
    category: f?.category ?? "Music",
    title: f?.title ?? "",
    subtitle: f?.subtitle ?? "",
    note: f?.note ?? "",
    url: f?.url ?? "",
    imageUrl: f?.imageUrl ?? "",
    sortOrder: f?.sortOrder ?? 0,
  };
}

export function FavoritesManager({ favorites }: { favorites: Favorite[] }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<Favorite | "new" | null>(null);

  async function remove(f: Favorite) {
    if (!confirm(`Delete "${f.title}"?`)) return;
    const res = await fetch(`/api/admin/favorites/${f.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Removed");
      router.refresh();
    } else toast.error("Delete failed");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Personal · Off the Clock
          </h1>
          <p className="text-muted-foreground">
            Music, film, books, and anything else you&apos;re into. Add a cover
            image and a link so visitors can check it out.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> Add favorite
        </Button>
      </div>

      <div className="space-y-2">
        {favorites.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3"
          >
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded border border-border bg-secondary">
              {f.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.imageUrl}
                  alt={f.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{f.title}</span>
                <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {f.category}
                </span>
                {f.url && (
                  <LinkIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
                )}
              </div>
              {f.subtitle && (
                <p className="truncate text-sm text-muted-foreground">
                  {f.subtitle}
                </p>
              )}
            </div>
            <button
              onClick={() => setEditing(f)}
              className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => remove(f)}
              className="rounded p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {favorites.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nothing here yet. Add your first favorite — it&apos;ll appear in the
            &ldquo;Off the Clock&rdquo; section on your site.
          </p>
        )}
      </div>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          {editing !== null && (
            <FavoriteDialog
              favorite={editing === "new" ? null : editing}
              onDone={() => {
                setEditing(null);
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FavoriteDialog({
  favorite,
  onDone,
}: {
  favorite: Favorite | null;
  onDone: () => void;
}) {
  const [draft, setDraft] = React.useState<Draft>(toDraft(favorite));
  const [saving, setSaving] = React.useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        favorite ? `/api/admin/favorites/${favorite.id}` : "/api/admin/favorites",
        {
          method: favorite ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      toast.success(favorite ? "Updated" : "Added");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{favorite ? "Edit favorite" : "Add favorite"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={save} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" hint="e.g. Music, Film & TV, Books">
            <Input
              list="fav-categories"
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
              required
            />
            <datalist id="fav-categories">
              {CATEGORY_SUGGESTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Title" hint="Song / film / book name">
            <Input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </Field>
        </div>
        <Field label="Subtitle" hint="Artist / director / author (optional)">
          <Input
            value={draft.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
          />
        </Field>
        <Field label="Note" hint="A short personal line — why you love it (optional)">
          <Input
            value={draft.note}
            onChange={(e) => set("note", e.target.value)}
          />
        </Field>
        <Field
          label="Link"
          hint="Spotify, Letterboxd, Goodreads, YouTube… (optional)"
        >
          <Input
            value={draft.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://"
          />
        </Field>
        <Field
          label="Cover image"
          hint="Album / poster / book cover. Paste a URL or upload. (Last one wins.)"
        >
          <ImageInput
            value={draft.imageUrl ? [draft.imageUrl] : []}
            onChange={(arr) => set("imageUrl", arr[arr.length - 1] ?? "")}
          />
        </Field>
        <div className="flex items-center gap-2 text-sm">
          <span>Order</span>
          <Input
            type="number"
            value={draft.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
            className="h-8 w-20"
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {favorite ? "Save changes" : "Add favorite"}
          </Button>
        </div>
      </form>
    </>
  );
}
