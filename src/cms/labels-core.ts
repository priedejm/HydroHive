/**
 * Friendly names for the admin form. The form itself is generated from the
 * shape of DEFAULTS; this only decides what each page/section/field is called.
 * Anything without a label gets a readable version of its key ("ctaLabel" -> "Cta label").
 */

export type PageDef = {
  /** Top-level key in DEFAULTS. */
  key: string;
  label: string;
  /** Live page to preview (omit for site-wide content). */
  path?: string;
};

export type LabelConfig = {
  pages: PageDef[];
  /** "home.hero" -> "Top of page". */
  sections: Record<string, string>;
  /**
   * Field labels. Looked up by full path first ("site.contact.text", list
   * indexes written as "[]": "home.reviews.items[].body"), then by bare key.
   */
  fields: Record<string, string>;
  /** Extra help under a field, same lookup as `fields`. */
  hints?: Record<string, string>;
  /** Keys that always get a multi-line box. */
  long: string[];
  /** What one item in a list is called, by list path ("team.members" -> "Team member"). */
  itemNouns?: Record<string, string>;
};

export type Path = (string | number)[];

export function normPath(path: Path): string {
  return path.reduce<string>((acc, p) => (typeof p === "number" ? `${acc}[]` : acc ? `${acc}.${p}` : p), "");
}

export function humanize(key: string): string {
  const s = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function lastKey(path: Path): string {
  for (let i = path.length - 1; i >= 0; i--) if (typeof path[i] === "string") return path[i] as string;
  return "";
}

export function fieldLabel(cfg: LabelConfig, path: Path): string {
  const full = normPath(path);
  const key = lastKey(path);
  return cfg.fields[full] ?? cfg.sections[full] ?? cfg.fields[key] ?? humanize(key);
}

export function fieldHint(cfg: LabelConfig, path: Path, def: unknown): string | undefined {
  const full = normPath(path);
  const key = lastKey(path);
  const explicit = cfg.hints?.[full] ?? cfg.hints?.[key];
  if (explicit) return explicit;
  if (typeof def === "string") {
    const tips: string[] = [];
    if (def.includes("*")) tips.push("Words between *asterisks* are shown in the italic accent style.");
    if (def.includes("\n\n")) tips.push("Leave a blank line between paragraphs.");
    return tips.join(" ") || undefined;
  }
  return undefined;
}

export function sectionLabel(cfg: LabelConfig, page: string, section: string): string {
  return cfg.sections[`${page}.${section}`] ?? humanize(section);
}

export function itemNoun(cfg: LabelConfig, path: Path): string {
  return cfg.itemNouns?.[normPath(path)] ?? "Item";
}

export function isLong(cfg: LabelConfig, path: Path, def: unknown, value: string): boolean {
  const key = lastKey(path);
  if (cfg.long.includes(key)) return true;
  if (typeof def === "string" && (def.length > 90 || def.includes("\n"))) return true;
  return value.length > 90 || value.includes("\n");
}
