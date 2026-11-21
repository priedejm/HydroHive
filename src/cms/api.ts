/**
 * Admin-side calls to the PHP endpoints in /api.
 * Every write sends `X-CMS: 1` (the server rejects writes without it - a cheap
 * CSRF guard on top of the SameSite=Strict session cookie).
 */

type ApiResult<T> = { success: true } & T;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parse<T>(res: Response): Promise<ApiResult<T>> {
  let data: unknown = null;
  const type = res.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }
  const obj = (data ?? {}) as { success?: boolean; error?: string };
  if (!res.ok || !obj.success) {
    const msg =
      obj.error ??
      (res.status === 413
        ? "That file is too large for the server."
        : res.status === 404 || !type.includes("application/json")
          ? "The admin server isn't reachable. (The admin only works on the live site, not in local preview.)"
          : `Request failed (${res.status}).`);
    throw new ApiError(msg, res.status);
  }
  return obj as ApiResult<T>;
}

export async function apiGet<T = object>(path: string): Promise<ApiResult<T>> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`/api/${path}${sep}t=${Date.now()}`, {
    credentials: "same-origin",
    cache: "no-store",
    headers: { "X-CMS": "1" },
  });
  return parse<T>(res);
}

export async function apiPost<T = object>(path: string, body: unknown): Promise<ApiResult<T>> {
  const res = await fetch(`/api/${path}`, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json", "X-CMS": "1" },
    body: JSON.stringify(body ?? {}),
  });
  return parse<T>(res);
}

/** Multipart upload with progress (fetch can't report upload progress). */
export function apiUpload(
  slot: string,
  files: File[],
  onProgress?: (fraction: number) => void,
): Promise<ApiResult<{ files: { url: string; name: string }[]; errors?: string[] }>> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("slot", slot);
    files.forEach((f, i) => form.append(`file${i}`, f, f.name));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload-media.php");
    xhr.withCredentials = true;
    xhr.setRequestHeader("X-CMS", "1");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
    };
    xhr.onerror = () => reject(new ApiError("Upload failed - check your connection and try again.", 0));
    xhr.onload = () => {
      let data: { success?: boolean; error?: string } | null = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        data = null;
      }
      if (xhr.status >= 200 && xhr.status < 300 && data?.success) {
        resolve(data as ApiResult<{ files: { url: string; name: string }[]; errors?: string[] }>);
      } else {
        const msg =
          data?.error ??
          (xhr.status === 413
            ? "That file is too large for the server."
            : `Upload failed (${xhr.status || "network error"}).`);
        reject(new ApiError(msg, xhr.status));
      }
    };
    xhr.send(form);
  });
}

/** Overwrite an uploaded photo with a smaller version of itself (same address). */
export async function apiReplaceMedia(path: string, file: File): Promise<ApiResult<{ size: number }>> {
  const form = new FormData();
  form.append("path", path);
  form.append("file0", file, file.name);
  const res = await fetch("/api/replace-media.php", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "X-CMS": "1" },
    body: form,
  });
  return parse<{ size: number }>(res);
}

export const api = {
  /** maxUpload: the server's per-file limit in bytes (admins only; 0 = unknown). */
  session: () => apiGet<{ loggedIn: boolean; maxUpload?: number }>("session.php"),
  login: (password: string) => apiPost("login.php", { password }),
  logout: () => apiPost("logout.php", {}),
  saveContent: (content: unknown) => apiPost("save-content.php", { content }),
  deleteMedia: (path: string) => apiPost("delete-media.php", { path }),
  reorder: (slot: string, order: string[], hidden: string[]) => apiPost("reorder-media.php", { slot, order, hidden }),
  listBackups: () => apiGet<{ backups: { name: string; modified: number; size: number }[] }>("list-backups.php"),
  restoreBackup: (name: string) => apiPost("restore-backup.php", { name }),
  upload: apiUpload,
  replaceMedia: apiReplaceMedia,
};
