"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/admin/tag-input";
import type { SkillGroup } from "@/lib/data";

type Group = { category: string; names: string[] };

export function SkillsEditor({ groups: initial }: { groups: SkillGroup[] }) {
  const router = useRouter();
  const [groups, setGroups] = React.useState<Group[]>(
    initial.length
      ? initial.map((g) => ({
          category: g.category,
          names: g.skills.map((s) => s.name),
        }))
      : [{ category: "", names: [] }]
  );
  const [saving, setSaving] = React.useState(false);

  function update(i: number, patch: Partial<Group>) {
    setGroups((gs) => gs.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        groups: groups
          .map((g) => ({ category: g.category.trim(), names: g.names }))
          .filter((g) => g.category && g.names.length > 0),
      };
      const res = await fetch("/api/admin/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      toast.success("Skills saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Skills</h1>
          <p className="text-muted-foreground">
            Group skills by category. Type a skill and press Enter to add it.
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save all
        </Button>
      </div>

      <div className="space-y-4">
        {groups.map((g, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-border bg-card/50 p-4"
          >
            <div className="flex items-center gap-2">
              <Input
                value={g.category}
                onChange={(e) => update(i, { category: e.target.value })}
                placeholder="Category name (e.g. Languages)"
                className="max-w-xs font-medium"
              />
              <button
                onClick={() =>
                  setGroups((gs) => gs.filter((_, idx) => idx !== i))
                }
                className="ml-auto rounded p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                title="Remove category"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <TagInput
              value={g.names}
              onChange={(names) => update(i, { names })}
              placeholder="Add a skill and press Enter…"
            />
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() => setGroups((gs) => [...gs, { category: "", names: [] }])}
      >
        <Plus className="h-4 w-4" /> Add category
      </Button>
    </div>
  );
}
