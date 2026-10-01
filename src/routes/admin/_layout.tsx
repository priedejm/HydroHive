import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  ADMIN_SESSION_KEY,
  ADMIN_SESSION_STALE_TIME,
  fetchAdminSession,
} from "@/lib/admin/session";

export const Route = createFileRoute("/admin/_layout")({
  beforeLoad: async ({ location, context }) => {
    if (location.pathname === "/admin/login") return;
    const session = await context.queryClient.ensureQueryData({
      queryKey: ADMIN_SESSION_KEY,
      queryFn: fetchAdminSession,
      staleTime: ADMIN_SESSION_STALE_TIME,
    });
    if (!session.authenticated) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminRootLayout,
});

function AdminRootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";
  if (isLogin) return <Outlet />;
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
