import { useQuery, useQueryClient } from "@tanstack/react-query";

export const ADMIN_SESSION_KEY = ["admin-session"] as const;
// Shared between useAdminSession() and the /admin route guard's
// ensureQueryData() call so route navigation doesn't re-hit me.php (and
// have it reissue a new server-side CSRF token) more often than the hook
// itself would refetch - see src/routes/admin/_layout.tsx.
export const ADMIN_SESSION_STALE_TIME = 60_000;

export type AdminSession = { authenticated: boolean; csrfToken?: string };

export async function fetchAdminSession(): Promise<AdminSession> {
  try {
    const res = await fetch("/api/admin/me.php");
    if (!res.ok) return { authenticated: false };
    const data = await res.json();
    return typeof data?.authenticated === "boolean" ? data : { authenticated: false };
  } catch {
    // Unreachable API, or a non-JSON response (e.g. the PHP endpoint isn't
    // deployed yet) - treat as logged out rather than breaking route load.
    return { authenticated: false };
  }
}

export function useAdminSession() {
  return useQuery({
    queryKey: ADMIN_SESSION_KEY,
    queryFn: fetchAdminSession,
    staleTime: ADMIN_SESSION_STALE_TIME,
  });
}

export function useSetAdminSession() {
  const queryClient = useQueryClient();
  return (session: AdminSession) => queryClient.setQueryData(ADMIN_SESSION_KEY, session);
}
