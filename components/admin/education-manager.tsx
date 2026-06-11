"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
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
import { dateRange } from "@/lib/utils";
import type { Education } from "@prisma/client";

type Draft = {
  degree: string;
  institution: string;
  location: string;
  gpa: string;
  startDate: string;
  endDate: string;
  details: string;
  sortOrder: number;
};

function toDraft(e?: Education | null): Draft {
  return {
    degree: e?.degree ?? "",
    institution: e?.institution ?? "",
    location: e?.location ?? "",
    gpa: e?.gpa ?? "",
    startDate: e?.startDate ?? "",
    endDate: e?.endDate ?? "",
    details: e?.details ?? "",
    sortOrder: e?.sortOrder ?? 0,
  };
}

export function EducationManager({ education }: { education: Education[] }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<Education | "new" | null>(null);

  async function remove(e: Education) {
    if (!confirm(`Delete "${e.degree}"?`)) return;
    const res = await fetch(`/api/admin/education/${e.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Education deleted");
      router.refresh();
    } else toast.error("Delete failed");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Education</h1>
          <p className="text-muted-foreground">Degrees and institutions.</p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <div className="space-y-2">
        {education.map((e) => (
          <div
            key={e.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{e.degree}</p>
              <p className="truncate text-sm text-muted-foreground">
                {e.institution} · {dateRange(e.startDate, e.endDate)}
                {e.gpa ? ` · ${e.gpa}` : ""}
              </p>
            </div>
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
        {education.length === 0 && (
          <p className="text-sm text-muted-foreground">No education yet.</p>
        )}
      </div>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          {editing !== null && (
            <EducationDialog
              education={editing === "new" ? null : editing}
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

function EducationDialog({
  education,
  onDone,
}: {
  education: Education | null;
  onDone: () => void;
}) {
  const [draft, setDraft] = React.useState<Draft>(toDraft(education));
  const [saving, setSaving] = React.useState(false);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        education
          ? `/api/admin/education/${education.id}`
          : "/api/admin/education",
        {
          method: education ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      toast.success(education ? "Education updated" : "Education added");
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
        <DialogTitle>{education ? "Edit education" : "Add education"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={save} className="space-y-4">
        <Field label="Degree">
          <Input value={draft.degree} onChange={(e) => set("degree", e.target.value)} required />
        </Field>
        <Field label="Institution">
          <Input
            value={draft.institution}
            onChange={(e) => set("institution", e.target.value)}
            required
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location">
            <Input value={draft.location} onChange={(e) => set("location", e.target.value)} />
          </Field>
          <Field label="GPA">
            <Input value={draft.gpa} onChange={(e) => set("gpa", e.target.value)} />
          </Field>
          <Field label="Start">
            <Input value={draft.startDate} onChange={(e) => set("startDate", e.target.value)} />
          </Field>
          <Field label="End">
            <Input value={draft.endDate} onChange={(e) => set("endDate", e.target.value)} />
          </Field>
        </div>
        <Field label="Details (optional)">
          <Textarea value={draft.details} onChange={(e) => set("details", e.target.value)} rows={3} />
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
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {education ? "Save changes" : "Add education"}
          </Button>
        </div>
      </form>
    </>
  );
}
