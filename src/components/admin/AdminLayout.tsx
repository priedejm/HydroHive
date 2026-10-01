import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { adminPostJson } from "@/lib/admin/api";
import { ADMIN_SESSION_KEY, useAdminSession } from "@/lib/admin/session";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session } = useAdminSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await adminPostJson("/api/admin/logout.php", {}, session?.csrfToken);
    } catch {
      // Session may already be gone server-side; proceed to clear it locally either way.
    }
    queryClient.setQueryData(ADMIN_SESSION_KEY, { authenticated: false });
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/admin" className="font-display text-lg text-navy">
            Hydro Hive Admin
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-navy"
            >
              View site
            </a>
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
