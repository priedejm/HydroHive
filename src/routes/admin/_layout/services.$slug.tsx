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
import { StringListField, FaqListField, GalleryListField } from "@/components/admin/ListFields";
import { SectionEditorGate } from "@/components/admin/SectionEditorGate";
import { useSiteContentQuery, CONTENT_QUERY_KEY } from "@/lib/content/hooks";
import { useAdminSession } from "@/lib/admin/session";
import { saveSection } from "@/lib/admin/api";
import type { ServiceSlug } from "@/lib/site";

export const Route = createFileRoute("/admin/_layout/services/$slug")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <SectionEditorGate>
      <AdminServiceEdit />
    </SectionEditorGate>
  ),
});

function AdminServiceEdit() {
  const { slug } = Route.useParams();
  const serviceSlug = slug as ServiceSlug;
  const { data: content } = useSiteContentQuery();
  const { data: session } = useAdminSession();
  const queryClient = useQueryClient();

  const initialService = content.services.find((s) => s.slug === serviceSlug);
  const initialContent = content.service_content[serviceSlug];

  const [form, setForm] = useState(() => ({
    short: initialService?.short ?? "",
    long: initialService?.long ?? "",
    cta: initialService?.cta ?? "",
  }));
  const [contentForm, setContentForm] = useState(() => ({
    image: initialContent?.image ?? "",
    bullets: initialContent?.bullets ?? [],
    faqs: initialContent?.faqs ?? [],
    gallery: initialContent?.gallery ?? [],
  }));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const nextServices = content.services.map((s) =>
        s.slug === serviceSlug ? { ...s, ...form } : s,
      );
      const nextServiceContent = { ...content.service_content, [serviceSlug]: contentForm };
      await Promise.all([
        saveSection("services", nextServices, session?.csrfToken),
        saveSection("service_content", nextServiceContent, session?.csrfToken),
      ]);
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
      <h1 className="font-display text-2xl text-navy capitalize">
        {serviceSlug.replace("-", " ")}
      </h1>

      <div>
        <Label>Short description</Label>
        <Textarea
          value={form.short}
          onChange={(e) => setForm((f) => ({ ...f, short: e.target.value }))}
          rows={2}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Long description</Label>
        <Textarea
          value={form.long}
          onChange={(e) => setForm((f) => ({ ...f, long: e.target.value }))}
          rows={4}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Call-to-action button text</Label>
        <Input
          value={form.cta}
          onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))}
          className="mt-1.5"
        />
      </div>

      <ImageField
        label="Main photo"
        value={contentForm.image}
        csrfToken={session?.csrfToken}
        onChange={(url) => setContentForm((c) => ({ ...c, image: url }))}
      />

      <StringListField
        label="Bullet points"
        values={contentForm.bullets}
        onChange={(v) => setContentForm((c) => ({ ...c, bullets: v }))}
      />

      <FaqListField
        label="FAQs"
        values={contentForm.faqs}
        onChange={(v) => setContentForm((c) => ({ ...c, faqs: v }))}
      />

      <GalleryListField
        label="Extra gallery photos (optional)"
        values={contentForm.gallery}
        csrfToken={session?.csrfToken}
        onChange={(v) => setContentForm((c) => ({ ...c, gallery: v }))}
      />

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
