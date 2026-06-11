"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Loader2,
  Save,
  GripVertical,
  EyeOff,
} from "lucide-react";
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
import { ImageInput } from "@/components/admin/image-input";
import type { Project } from "@prisma/client";

type Draft = {
  title: string;
  tagline: string;
  category: string;
  description: string;
  techTags: string[];
  githubUrl: string;
  liveUrl: string;
  demoVideoUrl: string;
  images: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

function toDraft(p?: Project | null): Draft {
  return {
    title: p?.title ?? "",
    tagline: p?.tagline ?? "",
    category: p?.category ?? "",
    description: p?.description ?? "",
    techTags: p?.techTags ?? [],
    githubUrl: p?.githubUrl ?? "",
    liveUrl: p?.liveUrl ?? "",
    demoVideoUrl: p?.demoVideoUrl ?? "",
    images: p?.images ?? [],
    featured: p?.featured ?? false,
    published: p?.published ?? true,
    sortOrder: p?.sortOrder ?? 0,
  };
}

export function ProjectsManager({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<Project | "new" | null>(null);

  async function remove(p: Project) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/projects/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Project deleted");
      router.refresh();
    } else {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Projects</h1>
          <p className="text-muted-foreground">
            Add projects, demo videos, links, and images. Use the{" "}
            <span className="font-mono text-xs">Research</span> category for
            your thesis highlight.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> Add project
        </Button>
      </div>

      <div className="space-y-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3"
          >
            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {p.featured && (
                  <Star className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />
                )}
                {!p.published && (
                  <EyeOff className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate font-medium">{p.title}</span>
                {p.category && (
                  <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {p.category}
                  </span>
                )}
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {p.tagline}
              </p>
            </div>
            <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">
              #{p.sortOrder}
            </span>
            <button
              onClick={() => setEditing(p)}
              className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => remove(p)}
              className="rounded p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No projects yet. Add your first one.
          </p>
        )}
      </div>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          {editing !== null && (
            <ProjectDialog
              project={editing === "new" ? null : editing}
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

function ProjectDialog({
  project,
  onDone,
}: {
  project: Project | null;
  onDone: () => void;
}) {
  const [draft, setDraft] = React.useState<Draft>(toDraft(project));
  const [saving, setSaving] = React.useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        project ? `/api/admin/projects/${project.id}` : "/api/admin/projects",
        {
          method: project ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      toast.success(project ? "Project updated" : "Project added");
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
        <DialogTitle>{project ? "Edit project" : "Add project"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={save} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <Input value={draft.title} onChange={(e) => set("title", e.target.value)} required />
          </Field>
          <Field label="Category" hint="e.g. Web App, Distributed Systems, AI/ML, Research">
            <Input value={draft.category} onChange={(e) => set("category", e.target.value)} />
          </Field>
        </div>
        <Field label="Tagline">
          <Input value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} required />
        </Field>
        <Field label="Description (Markdown)">
          <Textarea
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            rows={8}
            className="font-mono text-xs"
            required
          />
        </Field>
        <Field label="Tech tags">
          <TagInput value={draft.techTags} onChange={(v) => set("techTags", v)} placeholder="React, Go, Postgres…" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="GitHub URL">
            <Input value={draft.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://" />
          </Field>
          <Field label="Live URL">
            <Input value={draft.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} placeholder="https://" />
          </Field>
          <Field label="Demo video URL" >
            <Input value={draft.demoVideoUrl} onChange={(e) => set("demoVideoUrl", e.target.value)} placeholder="YouTube / Loom" />
          </Field>
        </div>
        <Field label="Images" hint="Paste image URLs or upload. First image is the card cover.">
          <ImageInput value={draft.images} onChange={(v) => set("images", v)} />
        </Field>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => set("published", e.target.checked)}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
            />
            Published (visible on site)
          </label>
          <div className="flex items-center gap-2 text-sm">
            <span>Order</span>
            <Input
              type="number"
              value={draft.sortOrder}
              onChange={(e) => set("sortOrder", Number(e.target.value))}
              className="h-8 w-20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {project ? "Save changes" : "Add project"}
          </Button>
        </div>
      </form>
    </>
  );
}
