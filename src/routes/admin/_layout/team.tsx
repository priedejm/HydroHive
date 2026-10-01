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
import { StringListField } from "@/components/admin/ListFields";
import { SectionEditorGate } from "@/components/admin/SectionEditorGate";
import { useSiteContentQuery, CONTENT_QUERY_KEY } from "@/lib/content/hooks";
import { useAdminSession } from "@/lib/admin/session";
import { saveSection } from "@/lib/admin/api";

export const Route = createFileRoute("/admin/_layout/team")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <SectionEditorGate>
      <AdminTeamEdit />
    </SectionEditorGate>
  ),
});

function AdminTeamEdit() {
  const { data: content } = useSiteContentQuery();
  const { data: session } = useAdminSession();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(content.team);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await saveSection("team", form, session?.csrfToken);
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
      <h1 className="font-display text-2xl text-navy">Team</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Page heading</Label>
          <Input
            value={form.heroTitle}
            onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
            className="mt-1.5"
          />
        </div>
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
      <ImageField
        label="Crew photo"
        value={form.heroImage}
        csrfToken={session?.csrfToken}
        onChange={(url) => setForm((f) => ({ ...f, heroImage: url }))}
      />

      <div className="space-y-6">
        {form.members.map((m, i) => (
          <div key={i} className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-navy">Team member {i + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setForm((f) => ({ ...f, members: f.members.filter((_, idx) => idx !== i) }))
                }
              >
                <Trash2 className="mr-1 h-4 w-4" /> Remove
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>First name</Label>
                <Input
                  value={m.first}
                  onChange={(e) => {
                    const next = [...form.members];
                    next[i] = { ...next[i], first: e.target.value };
                    setForm((f) => ({ ...f, members: next }));
                  }}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  value={m.role}
                  onChange={(e) => {
                    const next = [...form.members];
                    next[i] = { ...next[i], role: e.target.value };
                    setForm((f) => ({ ...f, members: next }));
                  }}
                  className="mt-1.5"
                />
              </div>
            </div>
            <ImageField
              label="Photo"
              value={m.photo}
              csrfToken={session?.csrfToken}
              onChange={(url) => {
                const next = [...form.members];
                next[i] = { ...next[i], photo: url };
                setForm((f) => ({ ...f, members: next }));
              }}
            />
            <StringListField
              label="Bio paragraphs"
              values={m.bio}
              onChange={(v) => {
                const next = [...form.members];
                next[i] = { ...next[i], bio: v };
                setForm((f) => ({ ...f, members: next }));
              }}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setForm((f) => ({
              ...f,
              members: [...f.members, { first: "", photo: "", role: "", bio: [] }],
            }))
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Add team member
        </Button>
      </div>

      <div>
        <Label>"Our story" heading</Label>
        <Input
          value={form.storyTitle}
          onChange={(e) => setForm((f) => ({ ...f, storyTitle: e.target.value }))}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>"Our story" body</Label>
        <Textarea
          value={form.storyBody}
          onChange={(e) => setForm((f) => ({ ...f, storyBody: e.target.value }))}
          rows={4}
          className="mt-1.5"
        />
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
