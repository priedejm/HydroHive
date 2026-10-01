// Thin fetch wrapper for the authenticated /api/admin/* endpoints. Every
// mutating request must carry the X-CSRF-Token header issued at login (see
// src/lib/admin/session.ts) - the PHP side rejects mutations without it.

class AdminApiError extends Error {}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.error === "string") return data.error;
  } catch {
    // fall through to generic message
  }
  return `Request failed (${res.status})`;
}

export async function adminPostJson<T>(
  path: string,
  body: unknown,
  csrfToken: string | undefined,
): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new AdminApiError(await parseErrorMessage(res));
  return res.json();
}

export async function adminUploadImage(
  file: File,
  csrfToken: string | undefined,
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch("/api/admin/upload.php", {
    method: "POST",
    headers: csrfToken ? { "X-CSRF-Token": csrfToken } : undefined,
    body: formData,
  });
  if (!res.ok) throw new AdminApiError(await parseErrorMessage(res));
  return res.json();
}

export async function saveSection(
  key: string,
  data: unknown,
  csrfToken: string | undefined,
): Promise<void> {
  await adminPostJson("/api/admin/section.php", { key, data }, csrfToken);
}
