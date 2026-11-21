import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ImagePlus, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { blankOf, isPlainObject } from "../merge";
import { api } from "../api";
import { optimizeImage } from "./optimizeImage";
import { fieldHint, fieldLabel, isLong, itemNoun, type LabelConfig, type Path } from "../labels-core";

export type EditorCtx = {
  cfg: LabelConfig;
  resolveImage: (value: string) => string;
};

type Props = {
  path: Path;
  value: unknown;
  /** The bundled default at this position (used for "restore" + new list items). */
  def: unknown;
  onChange: (v: unknown) => void;
  ctx: EditorCtx;
};

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const MAX_IMAGE_MB = 15;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-navy">{label}</label>
      {children}
      {hint && <p className="text-xs text-navy/55">{hint}</p>}
    </div>
  );
}

export function FieldEditor({ path, value, def, onChange, ctx }: Props) {
  const key = String(path[path.length - 1]);
  const label = fieldLabel(ctx.cfg, path);
  const hint = fieldHint(ctx.cfg, path, def);

  if (key === "photo" && typeof value === "string") {
    return (
      <Field label={label} hint={hint}>
        <ImageField value={value} def={typeof def === "string" ? def : ""} onChange={onChange} ctx={ctx} />
      </Field>
    );
  }

  if (typeof value === "string") {
    const long = isLong(ctx.cfg, path, def, value);
    const changed = typeof def === "string" && def !== "" && def !== value;
    return (
      <Field label={label} hint={hint}>
        <div className="flex items-start gap-2">
          {long ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={Math.min(14, Math.max(3, Math.ceil(value.length / 85) + (value.match(/\n/g)?.length ?? 0)))}
              className="bg-white"
            />
          ) : (
            <Input value={value} onChange={(e) => onChange(e.target.value)} className="bg-white" />
          )}
          {changed && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Put back the original text"
              onClick={() => onChange(def)}
              className="shrink-0 text-navy/50 hover:text-navy"
            >
              <RotateCcw className="size-4" />
            </Button>
          )}
        </div>
      </Field>
    );
  }

  if (typeof value === "boolean") {
    return (
      <div className="flex items-center gap-3">
        <Switch checked={value} onCheckedChange={(v) => onChange(v)} />
        <span className="text-sm text-navy">{label}</span>
        {hint && <span className="text-xs text-navy/55">{hint}</span>}
      </div>
    );
  }

  if (typeof value === "number") {
    return (
      <Field label={label} hint={hint}>
        <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="bg-white" />
      </Field>
    );
  }

  if (Array.isArray(value)) {
    return (
      <Field label={label} hint={hint}>
        <ListEditor path={path} value={value} def={def} onChange={onChange} ctx={ctx} />
      </Field>
    );
  }

  if (isPlainObject(value)) {
    const d = isPlainObject(def) ? def : {};
    return (
      <fieldset className="space-y-5 rounded-xl border border-navy/10 bg-[#f7f8fa] p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-navy/60">{label}</legend>
        <ObjectFields path={path} value={value} def={d} onChange={onChange} ctx={ctx} />
      </fieldset>
    );
  }

  return null;
}

export function ObjectFields({
  path,
  value,
  def,
  onChange,
  ctx,
}: {
  path: Path;
  value: Record<string, unknown>;
  def: Record<string, unknown>;
  onChange: (v: unknown) => void;
  ctx: EditorCtx;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {Object.keys(value).map((k) => {
        const v = value[k];
        // Short one-line fields sit side by side; everything else takes the full width.
        const half = typeof v === "number" || (typeof v === "string" && k !== "photo" && !isLong(ctx.cfg, [...path, k], def[k], v));
        return (
          <div key={k} className={half ? "min-w-0" : "min-w-0 md:col-span-2"}>
            <FieldEditor path={[...path, k]} value={v} def={def[k]} onChange={(nv) => onChange({ ...value, [k]: nv })} ctx={ctx} />
          </div>
        );
      })}
    </div>
  );
}

function preview(item: unknown): string {
  if (typeof item === "string") return item;
  if (!isPlainObject(item)) return "";
  for (const k of ["name", "title", "label", "first", "q", "quote", "d", "category", "service", "k"]) {
    const v = item[k];
    if (typeof v === "string" && v.trim()) return v.replace(/\*/g, "");
  }
  return "";
}

function ListEditor({ path, value, def, onChange, ctx }: Props & { value: unknown[] }) {
  const defArr = Array.isArray(def) ? def : [];
  const tpl = defArr[0] ?? (value[0] !== undefined ? blankOf(value[0]) : "");
  const noun = itemNoun(ctx.cfg, path);
  const simple = typeof tpl !== "object" || tpl === null;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    if (openIdx === i) setOpenIdx(j);
  };
  const remove = (i: number) => {
    if (!simple && !window.confirm(`Remove this ${noun.toLowerCase()}? (Nothing is final until you press Save.)`)) return;
    onChange(value.filter((_, k) => k !== i));
    setOpenIdx(null);
  };
  const add = () => {
    onChange([...value, blankOf(tpl)]);
    setOpenIdx(value.length);
  };
  const itemDef = (i: number) => (i < defArr.length ? defArr[i] : blankOf(tpl));

  const controls = (i: number) => (
    <div className="flex shrink-0 items-center">
      <Button type="button" variant="ghost" size="icon" title="Move up" disabled={i === 0} onClick={(e) => (e.preventDefault(), move(i, -1))}>
        <ArrowUp className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Move down"
        disabled={i === value.length - 1}
        onClick={(e) => (e.preventDefault(), move(i, 1))}
      >
        <ArrowDown className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Remove"
        className="text-red-600 hover:text-red-700"
        onClick={(e) => (e.preventDefault(), remove(i))}
      >
        {simple ? <X className="size-4" /> : <Trash2 className="size-4" />}
      </Button>
    </div>
  );

  return (
    <div className="space-y-2">
      {value.map((item, i) =>
        simple ? (
          <div key={i} className="flex items-center gap-1">
            {typeof item === "string" && (item.length > 90 ? (
              <Textarea value={item} rows={3} onChange={(e) => onChange(value.map((v, k) => (k === i ? e.target.value : v)))} className="bg-white" />
            ) : (
              <Input value={item} onChange={(e) => onChange(value.map((v, k) => (k === i ? e.target.value : v)))} className="bg-white" />
            ))}
            {controls(i)}
          </div>
        ) : (
          <div key={i} className="rounded-xl border border-navy/15 bg-white">
            <div className="flex items-center gap-2 pl-4">
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2 py-3 text-left text-sm"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="shrink-0 font-medium text-navy">
                  {noun} {i + 1}
                </span>
                <span className="truncate text-navy/55">{preview(item)}</span>
                <span className="ml-auto shrink-0 text-xs font-medium text-[color:var(--cms-accent)]">{openIdx === i ? "Close" : "Edit"}</span>
              </button>
              {controls(i)}
            </div>
            {openIdx === i && isPlainObject(item) && (
              <div className="border-t border-navy/10 p-4">
                <ObjectFields
                  path={[...path, i]}
                  value={item}
                  def={isPlainObject(itemDef(i)) ? (itemDef(i) as Record<string, unknown>) : {}}
                  onChange={(v) => onChange(value.map((x, k) => (k === i ? v : x)))}
                  ctx={ctx}
                />
              </div>
            )}
          </div>
        ),
      )}
      <Button type="button" variant="outline" size="sm" onClick={add} className="mt-1">
        <Plus className="size-4" /> Add {simple ? "line" : noun.toLowerCase()}
      </Button>
    </div>
  );
}

function ImageField({
  value,
  def,
  onChange,
  ctx,
}: {
  value: string;
  def: string;
  onChange: (v: unknown) => void;
  ctx: EditorCtx;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const url = ctx.resolveImage(value);
  // Uploads are slow: by the time one finishes, another photo field (e.g. "after")
  // may have changed. Always apply the result through the latest onChange, whose
  // parents spread the current content - not the content from when the upload began.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setProgress(0);
    try {
      // Shrink phone photos first (size + Safari memory), then check the limit.
      const small = await optimizeImage(file);
      if (small.size > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`That photo is over ${MAX_IMAGE_MB}MB. Please use a smaller version.`);
      const r = await api.upload("content", [small], setProgress);
      const up = r.files?.[0];
      if (!up) throw new Error(r.errors?.[0] ?? "Upload failed.");
      // flushSync re-renders right away so a second upload finishing in the next
      // moment sees this photo too.
      flushSync(() => onChangeRef.current(up.url));
      toast.success("Photo uploaded. Press Save to publish it.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProgress(null);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="size-24 shrink-0 overflow-hidden rounded-lg border border-navy/15 bg-[#f3f5f8]">
        {url ? <img src={url} alt="" className="size-full object-cover" /> : <div className="flex size-full items-center justify-center text-xs text-navy/40">No photo</div>}
      </div>
      <div className="flex flex-wrap gap-2">
        <input ref={input} type="file" accept={IMAGE_ACCEPT} className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        <Button type="button" variant="outline" size="sm" disabled={progress !== null} onClick={() => input.current?.click()}>
          <ImagePlus className="size-4" />
          {progress !== null ? `Uploading ${Math.round(progress * 100)}%` : url ? "Replace photo" : "Upload photo"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            Remove
          </Button>
        )}
        {def && def !== value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(def)}>
            <RotateCcw className="size-4" /> Original
          </Button>
        )}
      </div>
    </div>
  );
}
