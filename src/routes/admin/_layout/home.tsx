import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageField } from "@/components/admin/ImageField";
import { SectionEditorGate } from "@/components/admin/SectionEditorGate";
import { useSiteContentQuery, CONTENT_QUERY_KEY } from "@/lib/content/hooks";
import { useAdminSession } from "@/lib/admin/session";
import { saveSection } from "@/lib/admin/api";

export const Route = createFileRoute("/admin/_layout/home")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <SectionEditorGate>
      <AdminHomeEdit />
    </SectionEditorGate>
  ),
});

function AdminHomeEdit() {
  const { data: content } = useSiteContentQuery();
  const { data: session } = useAdminSession();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(content.home);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      await saveSection("home", form, session?.csrfToken);
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
      <h1 className="font-display text-2xl text-navy">Home page</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Headline, line 1</Label>
          <Input
            value={form.heroHeadlineLine1}
            onChange={(e) => set("heroHeadlineLine1", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Headline, line 2</Label>
          <Input
            value={form.heroHeadlineLine2}
            onChange={(e) => set("heroHeadlineLine2", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>
      <div>
        <Label>Hero subheading</Label>
        <Textarea
          value={form.heroSub}
          onChange={(e) => set("heroSub", e.target.value)}
          rows={2}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label className="text-sm font-semibold text-navy">Stat row</Label>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {form.statRow.map((s, i) => (
            <div key={i} className="space-y-1.5 rounded-lg border border-border p-3">
              <Input
                value={s.k}
                placeholder="Value"
                onChange={(e) => {
                  const next = [...form.statRow];
                  next[i] = { ...next[i], k: e.target.value };
                  set("statRow", next);
                }}
              />
              <Input
                value={s.v}
                placeholder="Label"
                onChange={(e) => {
                  const next = [...form.statRow];
                  next[i] = { ...next[i], v: e.target.value };
                  set("statRow", next);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Services section eyebrow</Label>
          <Input
            value={form.serviceTeaserEyebrow}
            onChange={(e) => set("serviceTeaserEyebrow", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Services section heading</Label>
          <Input
            value={form.serviceTeaserHeading}
            onChange={(e) => set("serviceTeaserHeading", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>
      <div>
        <Label>Services section subheading</Label>
        <Textarea
          value={form.serviceTeaserSub}
          onChange={(e) => set("serviceTeaserSub", e.target.value)}
          rows={2}
          className="mt-1.5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ImageField
          label="Residential teaser photo"
          value={form.images.residential}
          csrfToken={session?.csrfToken}
          onChange={(url) => set("images", { ...form.images, residential: url })}
        />
        <ImageField
          label="Commercial teaser photo"
          value={form.images.commercial}
          csrfToken={session?.csrfToken}
          onChange={(url) => set("images", { ...form.images, commercial: url })}
        />
        <ImageField
          label="Dock teaser photo"
          value={form.images.dock}
          csrfToken={session?.csrfToken}
          onChange={(url) => set("images", { ...form.images, dock: url })}
        />
        <ImageField
          label="Drone block photo"
          value={form.images.droneBlock}
          csrfToken={session?.csrfToken}
          onChange={(url) => set("images", { ...form.images, droneBlock: url })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Before/after eyebrow</Label>
          <Input
            value={form.beforeAfterEyebrow}
            onChange={(e) => set("beforeAfterEyebrow", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Before/after heading</Label>
          <Input
            value={form.beforeAfterHeading}
            onChange={(e) => set("beforeAfterHeading", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Drone block eyebrow</Label>
          <Input
            value={form.droneEyebrow}
            onChange={(e) => set("droneEyebrow", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Drone block heading</Label>
          <Input
            value={form.droneHeading}
            onChange={(e) => set("droneHeading", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>
      <div>
        <Label>Drone block body</Label>
        <Textarea
          value={form.droneBody}
          onChange={(e) => set("droneBody", e.target.value)}
          rows={3}
          className="mt-1.5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Final CTA heading</Label>
          <Input
            value={form.finalCtaHeading}
            onChange={(e) => set("finalCtaHeading", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Final CTA subheading</Label>
          <Input
            value={form.finalCtaSub}
            onChange={(e) => set("finalCtaSub", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
