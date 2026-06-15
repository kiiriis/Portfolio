"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/admin/field";
import { ImageInput } from "@/components/admin/image-input";
import type { Profile } from "@prisma/client";

type FormState = {
  name: string;
  headline: string;
  heroTagline: string;
  aboutMd: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  photos: string[];
};

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<FormState>({
    name: profile?.name ?? "",
    headline: profile?.headline ?? "",
    heroTagline: profile?.heroTagline ?? "",
    aboutMd: profile?.aboutMd ?? "",
    location: profile?.location ?? "",
    email: profile?.email ?? "",
    githubUrl: profile?.githubUrl ?? "",
    linkedinUrl: profile?.linkedinUrl ?? "",
    resumeUrl: profile?.resumeUrl ?? "",
    photos: profile?.photos ?? [],
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      toast.success("Profile saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5">
      <Field label="Name">
        <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
      </Field>
      <Field label="Headline" hint="The bold line under your name in the hero.">
        <Input
          value={form.headline}
          onChange={(e) => set("headline", e.target.value)}
        />
      </Field>
      <Field label="Hero tagline" hint="One-sentence summary of what you do.">
        <Textarea
          value={form.heroTagline}
          onChange={(e) => set("heroTagline", e.target.value)}
          rows={2}
        />
      </Field>
      <Field label="About (Markdown)" hint="Your story. Supports **bold**, lists, links.">
        <Textarea
          value={form.aboutMd}
          onChange={(e) => set("aboutMd", e.target.value)}
          rows={10}
          className="font-mono text-xs"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Location">
          <Input
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="GitHub URL">
          <Input
            value={form.githubUrl}
            onChange={(e) => set("githubUrl", e.target.value)}
          />
        </Field>
        <Field label="LinkedIn URL">
          <Input
            value={form.linkedinUrl}
            onChange={(e) => set("linkedinUrl", e.target.value)}
          />
        </Field>
      </div>
      <Field
        label="Résumé URL"
        hint="A public PDF link, or /resume.pdf if you drop the file in /public."
      >
        <Input
          value={form.resumeUrl}
          onChange={(e) => set("resumeUrl", e.target.value)}
          placeholder="/resume.pdf"
        />
      </Field>

      <Field
        label="Photos"
        hint="Your headshot / photos, shown in the About section. Paste an image URL, or upload a file (needs Vercel Blob). The first photo is the main portrait."
      >
        <ImageInput value={form.photos} onChange={(v) => set("photos", v)} />
      </Field>

      <Button type="submit" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save profile
      </Button>
    </form>
  );
}
