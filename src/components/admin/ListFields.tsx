import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageField } from "@/components/admin/ImageField";

export function StringListField({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-semibold text-navy">{label}</Label>
      <div className="mt-2 space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={v}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...values, ""])}>
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  );
}

export type Faq = { q: string; a: string };

export function FaqListField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: Faq[];
  onChange: (next: Faq[]) => void;
}) {
  return (
    <div>
      <Label className="text-sm font-semibold text-navy">{label}</Label>
      <div className="mt-2 space-y-4">
        {values.map((f, i) => (
          <div key={i} className="rounded-lg border border-border p-3 space-y-2">
            <Input
              value={f.q}
              placeholder="Question"
              onChange={(e) => {
                const next = [...values];
                next[i] = { ...next[i], q: e.target.value };
                onChange(next);
              }}
            />
            <Textarea
              value={f.a}
              placeholder="Answer"
              rows={3}
              onChange={(e) => {
                const next = [...values];
                next[i] = { ...next[i], a: e.target.value };
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="mr-1 h-4 w-4" /> Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...values, { q: "", a: "" }])}
        >
          <Plus className="mr-1 h-4 w-4" /> Add question
        </Button>
      </div>
    </div>
  );
}

export type GalleryImage = { src: string; alt: string };

export function GalleryListField({
  label,
  values,
  onChange,
  csrfToken,
}: {
  label: string;
  values: GalleryImage[];
  onChange: (next: GalleryImage[]) => void;
  csrfToken: string | undefined;
}) {
  return (
    <div>
      <Label className="text-sm font-semibold text-navy">{label}</Label>
      <div className="mt-2 space-y-4">
        {values.map((g, i) => (
          <div key={i} className="rounded-lg border border-border p-3 space-y-2">
            <ImageField
              label="Photo"
              value={g.src}
              csrfToken={csrfToken}
              onChange={(url) => {
                const next = [...values];
                next[i] = { ...next[i], src: url };
                onChange(next);
              }}
            />
            <Input
              value={g.alt}
              placeholder="Photo description (for accessibility)"
              onChange={(e) => {
                const next = [...values];
                next[i] = { ...next[i], alt: e.target.value };
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="mr-1 h-4 w-4" /> Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...values, { src: "", alt: "" }])}
        >
          <Plus className="mr-1 h-4 w-4" /> Add photo
        </Button>
      </div>
    </div>
  );
}
