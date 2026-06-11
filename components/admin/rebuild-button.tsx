"use client";

import * as React from "react";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RebuildButton({ hasKey }: { hasKey: boolean }) {
  const [loading, setLoading] = React.useState(false);

  async function rebuild() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/embeddings/rebuild", {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Rebuild failed");
      toast.success(`Rebuilt chatbot index — ${data.count} chunks.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Rebuild failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={rebuild}
      disabled={loading || !hasKey}
      variant="outline"
      title={hasKey ? undefined : "Set OPENAI_API_KEY to enable the chatbot index"}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      Rebuild chatbot index
    </Button>
  );
}
