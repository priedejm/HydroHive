import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionEditorGate } from "@/components/admin/SectionEditorGate";
import { useSiteContentQuery, CONTENT_QUERY_KEY } from "@/lib/content/hooks";
import { useAdminSession } from "@/lib/admin/session";
import { saveSection } from "@/lib/admin/api";

export const Route = createFileRoute("/admin/_layout/reviews")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <SectionEditorGate>
      <AdminReviewsEdit />
    </SectionEditorGate>
  ),
});

function AdminReviewsEdit() {
  const { data: content } = useSiteContentQuery();
  const { data: session } = useAdminSession();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(content.reviews);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await saveSection("reviews", form, session?.csrfToken);
      await queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <div>
        <h1 className="font-display text-2xl text-navy">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {form.length} review{form.length === 1 ? "" : "s"} shown across the site. The overall
          rating and count shown next to them come from Site settings.
        </p>
      </div>

      <div className="sticky top-0 z-10 -mx-4 bg-muted/30 px-4 py-2 sm:-mx-6 sm:px-6">
        <Button onClick={save} disabled={saving} size="sm">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <div className="space-y-4">
        {form.map((r, i) => (
          <div key={i} className="rounded-lg border border-border p-4 space-y-2">
            <div className="grid gap-2 sm:grid-cols-3">
              <Input
                value={r.name}
                placeholder="Name"
                onChange={(e) => {
                  const next = [...form];
                  next[i] = { ...next[i], name: e.target.value };
                  setForm(next);
                }}
              />
              <Input
                value={r.meta}
                placeholder="e.g. 4 reviews"
                onChange={(e) => {
                  const next = [...form];
                  next[i] = { ...next[i], meta: e.target.value };
                  setForm(next);
                }}
              />
              <Input
                value={r.timeAgo}
                placeholder="e.g. a month ago"
                onChange={(e) => {
                  const next = [...form];
                  next[i] = { ...next[i], timeAgo: e.target.value };
                  setForm(next);
                }}
              />
            </div>
            <Textarea
              value={r.text}
              rows={3}
              onChange={(e) => {
                const next = [...form];
                next[i] = { ...next[i], text: e.target.value };
                setForm(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setForm(form.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="mr-1 h-4 w-4" /> Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setForm([{ name: "", meta: "", timeAgo: "", text: "" }, ...form])}
        >
          <Plus className="mr-1 h-4 w-4" /> Add review
        </Button>
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
