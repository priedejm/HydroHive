/**
 * Content merging for the CMS.
 *
 * The bundled DEFAULTS object (src/content/defaults.ts) defines the *shape* of
 * all editable content. Whatever the server returns (site-data/content.json) is
 * laid over it:
 *   - objects merge key-by-key; keys unknown to DEFAULTS are dropped
 *   - arrays from the server replace the default arrays outright; each item is
 *     validated against the first default item (the "template")
 *   - scalars are taken from the server only when the type matches
 *
 * IMPORTANT: every array in DEFAULTS must contain at least one item, because
 * that first item is the template used to validate and create new items.
 */

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** An "empty" value with the same shape as `v` (used for new list items). */
export function blankOf<T>(v: T): T {
  if (typeof v === "string") return "" as T;
  if (typeof v === "number") return 0 as T;
  if (typeof v === "boolean") return false as T;
  if (Array.isArray(v)) return [] as unknown as T;
  if (isPlainObject(v)) {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v)) out[k] = blankOf(v[k]);
    return out as T;
  }
  return v;
}

function mergeValue(def: unknown, srv: unknown, blankMissing: boolean): unknown {
  if (Array.isArray(def)) {
    if (!Array.isArray(srv)) return blankMissing ? [] : def;
    const tpl = def[0];
    if (tpl === undefined) return srv;
    return srv.map((item) => mergeValue(tpl, item, true));
  }
  if (isPlainObject(def)) {
    const s = isPlainObject(srv) ? srv : {};
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(def)) {
      out[k] = k in s ? mergeValue(def[k], s[k], blankMissing) : blankMissing ? blankOf(def[k]) : def[k];
    }
    return out;
  }
  if (typeof srv === typeof def && srv !== null) return srv;
  return blankMissing ? blankOf(def) : def;
}

export function mergeContent<T>(defaults: T, server: unknown): T {
  if (!isPlainObject(server)) return defaults;
  return mergeValue(defaults, server, false) as T;
}

export type { Json };
