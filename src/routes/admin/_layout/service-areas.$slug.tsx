import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StringListField } from "@/components/admin/ListFields";
import { SectionEditorGate } from "@/components/admin/SectionEditorGate";
import { useSiteContentQuery, CONTENT_QUERY_KEY } from "@/lib/content/hooks";
import { useAdminSession } from "@/lib/admin/session";
import { saveSection } from "@/lib/admin/api";
import type { LocationSlug } from "@/lib/site";

export const Route = createFileRoute("/admin/_layout/service-areas/$slug")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <SectionEditorGate>
      <AdminLocationEdit />
    </SectionEditorGate>
  ),
});

function AdminLocationEdit() {
  const { slug } = Route.useParams();
  const locationSlug = slug as LocationSlug;
  const { data: content } = useSiteContentQuery();
  const { data: session } = useAdminSession();
  const queryClient = useQueryClient();

  const initial = content.locations.find((l) => l.slug === locationSlug);

  const [form, setForm] = useState(() => ({
    region: initial?.region ?? "",
    short: initial?.short ?? "",
    long: initial?.long ?? "",
    neighborhoods: initial?.neighborhoods ?? [],
  }));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const nextLocations = content.locations.map((l) =>
        l.slug === locationSlug ? { ...l, ...form } : l,
      );
      await saveSection("locations", nextLocations, session?.csrfToken);
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
        {locationSlug.replace(/-/g, " ")}
      </h1>

      <div>
        <Label>Region label</Label>
        <Input
          value={form.region}
          onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
          className="mt-1.5"
        />
      </div>
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

      <StringListField
        label="Neighborhoods"
        values={form.neighborhoods}
        onChange={(v) => setForm((f) => ({ ...f, neighborhoods: v }))}
      />

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
