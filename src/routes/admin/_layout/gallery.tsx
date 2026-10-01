import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageField } from "@/components/admin/ImageField";
import { SectionEditorGate } from "@/components/admin/SectionEditorGate";
import { useSiteContentQuery, CONTENT_QUERY_KEY } from "@/lib/content/hooks";
import { useAdminSession } from "@/lib/admin/session";
import { saveSection } from "@/lib/admin/api";

export const Route = createFileRoute("/admin/_layout/gallery")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <SectionEditorGate>
      <AdminGalleryEdit />
    </SectionEditorGate>
  ),
});

function AdminGalleryEdit() {
  const { data: content } = useSiteContentQuery();
  const { data: session } = useAdminSession();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(content.gallery);
  const [saving, setSaving] = useState(false);

  const addPair = () => {
    setForm((f) => ({
      ...f,
      items: [...f.items, { id: crypto.randomUUID(), label: "", before: "", after: "" }],
    }));
  };

  const removePair = (i: number) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  };

  const save = async () => {
    // Drop any pair the admin added but never finished uploading photos for,
    // rather than publishing a broken <img> on the live site.
    const incomplete = form.items.filter((item) => !item.before || !item.after);
    const complete = { ...form, items: form.items.filter((item) => item.before && item.after) };

    setSaving(true);
    try {
      await saveSection("gallery", complete, session?.csrfToken);
      await queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
      setForm(complete);
      if (incomplete.length > 0) {
        toast.warning(
          `Saved, but skipped ${incomplete.length} pair(s) missing a before or after photo.`,
        );
      } else {
        toast.success("Saved. The home page shows the first 3 photo pairs below.");
      }
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
      <h1 className="font-display text-2xl text-navy">Before &amp; after gallery</h1>
      <p className="text-sm text-muted-foreground">
        The first 3 pairs below also appear on the home page, so updating or reordering them here
        updates both pages.
      </p>

      <div>
        <Label>Page heading</Label>
        <Input
          value={form.heroTitle}
          onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Page subheading</Label>
        <Textarea
          value={form.heroSub}
          onChange={(e) => setForm((f) => ({ ...f, heroSub: e.target.value }))}
          rows={2}
          className="mt-1.5"
        />
      </div>

      <div className="space-y-6">
        {form.items.map((item, i) => (
          <div key={item.id} className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Input
                value={item.label}
                placeholder="Label (e.g. Deck & Siding Soft Wash)"
                onChange={(e) => {
                  const next = [...form.items];
                  next[i] = { ...next[i], label: e.target.value };
                  setForm((f) => ({ ...f, items: next }));
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePair(i)}
                aria-label="Remove this pair"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ImageField
                label="Before photo"
                value={item.before}
                csrfToken={session?.csrfToken}
                onChange={(url) => {
                  const next = [...form.items];
                  next[i] = { ...next[i], before: url };
                  setForm((f) => ({ ...f, items: next }));
                }}
              />
              <ImageField
                label="After photo"
                value={item.after}
                csrfToken={session?.csrfToken}
                onChange={(url) => {
                  const next = [...form.items];
                  next[i] = { ...next[i], after: url };
                  setForm((f) => ({ ...f, items: next }));
                }}
              />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addPair}>
          <Plus className="mr-1 h-4 w-4" /> Add before/after pair
        </Button>
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
