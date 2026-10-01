import { DEFAULT_CONTENT } from "./defaults";
import { sectionSchemas } from "./schema";
import type { SectionKey, SiteContent } from "./types";

export async function fetchContent(): Promise<SiteContent> {
  let raw: Record<string, unknown>;
  try {
    const res = await fetch("/api/content.php");
    if (!res.ok) throw new Error(`content.php responded ${res.status}`);
    const body = await res.json();
    if (typeof body !== "object" || body === null)
      throw new Error("content.php did not return an object");
    raw = body as Record<string, unknown>;
  } catch (err) {
    console.error(
      "[content] API unreachable or returned invalid JSON, using defaults for everything",
      err,
    );
    return DEFAULT_CONTENT;
  }

  // Validate each section independently: one malformed/missing section (a
  // partial admin save, an unseeded row) falls back to just that section's
  // default instead of the whole site reverting to defaults.
  const result = {} as SiteContent;
  for (const key of Object.keys(sectionSchemas) as SectionKey[]) {
    const schema = sectionSchemas[key];
    const parsed = schema.safeParse(raw[key]);
    if (parsed.success) {
      (result as Record<SectionKey, unknown>)[key] = parsed.data;
    } else {
      console.error(
        `[content] Section "${key}" failed validation, using its default`,
        parsed.error,
      );
      (result as Record<SectionKey, unknown>)[key] = DEFAULT_CONTENT[key];
    }
  }
  return result;
}
