import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionEditorGate } from "@/components/admin/SectionEditorGate";
import { useSiteContentQuery, CONTENT_QUERY_KEY } from "@/lib/content/hooks";
import { useAdminSession } from "@/lib/admin/session";
import { saveSection } from "@/lib/admin/api";

export const Route = createFileRoute("/admin/_layout/seo")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <SectionEditorGate>
      <AdminSeoEdit />
    </SectionEditorGate>
  ),
});

function AdminSeoEdit() {
  const { data: content } = useSiteContentQuery();
  const { data: session } = useAdminSession();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(content.seo);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await saveSection("seo", form, session?.csrfToken);
      await queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
      toast.success("Saved. Browser tab titles update on the visitor's next visit.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const paths = Object.keys(form).sort();

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <div>
        <h1 className="font-display text-2xl text-navy">SEO</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Page title and search description for each page. Search engines may take time to reflect
          changes.
        </p>
      </div>

      <div className="sticky top-0 z-10 -mx-4 bg-muted/30 px-4 py-2 sm:-mx-6 sm:px-6">
        <Button onClick={save} disabled={saving} size="sm">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <div className="space-y-4">
        {paths.map((path) => (
          <div key={path} className="rounded-lg border border-border p-4 space-y-2">
            <div className="text-xs font-mono text-muted-foreground">{path}</div>
            <div>
              <Label>Title</Label>
              <Input
                value={form[path].title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [path]: { ...f[path], title: e.target.value } }))
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form[path].description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [path]: { ...f[path], description: e.target.value } }))
                }
                rows={2}
                className="mt-1.5"
              />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
