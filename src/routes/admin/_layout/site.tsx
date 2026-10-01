import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionEditorGate } from "@/components/admin/SectionEditorGate";
import { useSiteContentQuery, CONTENT_QUERY_KEY } from "@/lib/content/hooks";
import { useAdminSession } from "@/lib/admin/session";
import { saveSection, adminPostJson } from "@/lib/admin/api";

export const Route = createFileRoute("/admin/_layout/site")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: () => (
    <SectionEditorGate>
      <AdminSiteEdit />
    </SectionEditorGate>
  ),
});

const FIELDS: Array<{
  key: keyof ReturnType<typeof useSiteContentQuery>["data"]["site"];
  label: string;
}> = [
  { key: "name", label: "Business name (short)" },
  { key: "legalName", label: "Legal business name" },
  { key: "tagline", label: "Tagline" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone (display)" },
  { key: "phoneHref", label: "Phone (tel: link, e.g. tel:+18542229125)" },
  { key: "city", label: "City, State (display)" },
  { key: "street", label: "Street address" },
  { key: "addressLocality", label: "City" },
  { key: "addressRegion", label: "State" },
  { key: "postalCode", label: "ZIP code" },
  { key: "fullAddress", label: "Full address (display)" },
  { key: "instagram", label: "Instagram URL" },
  { key: "established", label: "Established label (e.g. Est. 2025)" },
  { key: "googleReviewsUrl", label: "Google reviews URL" },
];

function AdminSiteEdit() {
  const { data: content } = useSiteContentQuery();
  const { data: session } = useAdminSession();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(content.site);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await saveSection("site", form, session?.csrfToken);
      await queryClient.invalidateQueries({ queryKey: CONTENT_QUERY_KEY });
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    setChangingPassword(true);
    try {
      await adminPostJson(
        "/api/admin/change-password.php",
        { currentPassword, newPassword },
        session?.csrfToken,
      );
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="mt-2 font-display text-2xl text-navy">Site settings</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <Label>{f.label}</Label>
            <Input
              value={form[f.key] as string}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              className="mt-1.5"
            />
          </div>
        ))}
        <div>
          <Label>Google rating (e.g. 5.0)</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={form.googleRating}
            onChange={(e) => setForm((s) => ({ ...s, googleRating: Number(e.target.value) }))}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>Google review count</Label>
          <Input
            type="number"
            min="0"
            value={form.googleReviewCount}
            onChange={(e) => setForm((s) => ({ ...s, googleReviewCount: Number(e.target.value) }))}
            className="mt-1.5"
          />
        </div>
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>

      <div className="border-t border-border pt-6">
        <h2 className="font-display text-lg text-navy">Change admin password</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Current password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>New password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
        <Button
          onClick={changePassword}
          disabled={changingPassword || !currentPassword || newPassword.length < 10}
          variant="outline"
          className="mt-4"
        >
          {changingPassword ? "Updating…" : "Update password"}
        </Button>
      </div>
    </div>
  );
}
