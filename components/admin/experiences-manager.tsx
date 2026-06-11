"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Save, X } from "lucide-react";
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
import { TagInput } from "@/components/admin/tag-input";
import { dateRange } from "@/lib/utils";
import type { ExperienceWithBullets } from "@/lib/data";

type Draft = {
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  summary: string;
  techTags: string[];
  sortOrder: number;
  bullets: string[];
};

function toDraft(e?: ExperienceWithBullets | null): Draft {
  return {
    role: e?.role ?? "",
    organization: e?.organization ?? "",
    location: e?.location ?? "",
    startDate: e?.startDate ?? "",
    endDate: e?.endDate ?? "",
    summary: e?.summary ?? "",
    techTags: e?.techTags ?? [],
    sortOrder: e?.sortOrder ?? 0,
    bullets: e?.bullets.map((b) => b.text) ?? [""],
  };
}

export function ExperiencesManager({
  experiences,
}: {
  experiences: ExperienceWithBullets[];
}) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<
    ExperienceWithBullets | "new" | null
  >(null);

  async function remove(e: ExperienceWithBullets) {
    if (!confirm(`Delete "${e.role}"?`)) return;
    const res = await fetch(`/api/admin/experiences/${e.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Experience deleted");
      router.refresh();
    } else toast.error("Delete failed");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Experience</h1>
          <p className="text-muted-foreground">
            Roles shown on your timeline, ordered by the order field.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> Add role
        </Button>
      </div>

      <div className="space-y-2">
        {experiences.map((e) => (
          <div
            key={e.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{e.role}</p>
              <p className="truncate text-sm text-muted-foreground">
                {e.organization} · {dateRange(e.startDate, e.endDate)} ·{" "}
                {e.bullets.length} bullet{e.bullets.length === 1 ? "" : "s"}
              </p>
            </div>
            <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">
              #{e.sortOrder}
            </span>
            <button
              onClick={() => setEditing(e)}
              className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => remove(e)}
              className="rounded p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {experiences.length === 0 && (
          <p className="text-sm text-muted-foreground">No experience yet.</p>
        )}
      </div>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          {editing !== null && (
            <ExperienceDialog
              experience={editing === "new" ? null : editing}
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

function ExperienceDialog({
  experience,
  onDone,
}: {
  experience: ExperienceWithBullets | null;
  onDone: () => void;
}) {
  const [draft, setDraft] = React.useState<Draft>(toDraft(experience));
  const [saving, setSaving] = React.useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  function setBullet(i: number, value: string) {
    setDraft((d) => {
      const bullets = [...d.bullets];
      bullets[i] = value;
      return { ...d, bullets };
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...draft,
        bullets: draft.bullets.map((b) => b.trim()).filter(Boolean),
      };
      const res = await fetch(
        experience
          ? `/api/admin/experiences/${experience.id}`
          : "/api/admin/experiences",
        {
          method: experience ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      toast.success(experience ? "Experience updated" : "Experience added");
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
        <DialogTitle>
          {experience ? "Edit experience" : "Add experience"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={save} className="space-y-4">
        <Field label="Role / Title">
          <Input value={draft.role} onChange={(e) => set("role", e.target.value)} required />
        </Field>
        <Field label="Organization">
          <Input
            value={draft.organization}
            onChange={(e) => set("organization", e.target.value)}
            required
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Location">
            <Input value={draft.location} onChange={(e) => set("location", e.target.value)} />
          </Field>
          <Field label="Start" hint="e.g. Jan 2025">
            <Input value={draft.startDate} onChange={(e) => set("startDate", e.target.value)} required />
          </Field>
          <Field label="End" hint="blank = Present">
            <Input value={draft.endDate} onChange={(e) => set("endDate", e.target.value)} />
          </Field>
        </div>
        <Field label="Summary (optional)">
          <Input value={draft.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
        <Field label="Tech tags">
          <TagInput value={draft.techTags} onChange={(v) => set("techTags", v)} />
        </Field>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground/90">
              Bullet points
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => set("bullets", [...draft.bullets, ""])}
            >
              <Plus className="h-3.5 w-3.5" /> Add bullet
            </Button>
          </div>
          {draft.bullets.map((b, i) => (
            <div key={i} className="flex gap-2">
              <Textarea
                value={b}
                onChange={(e) => setBullet(i, e.target.value)}
                rows={2}
                placeholder="Accomplishment with a metric…"
                className="text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  set(
                    "bullets",
                    draft.bullets.filter((_, idx) => idx !== i)
                  )
                }
                className="mt-1 h-fit rounded p-1.5 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

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
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {experience ? "Save changes" : "Add experience"}
          </Button>
        </div>
      </form>
    </>
  );
}
