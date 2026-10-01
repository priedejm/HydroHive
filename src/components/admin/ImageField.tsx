import { useRef, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { adminUploadImage } from "@/lib/admin/api";

export function ImageField({
  label,
  value,
  onChange,
  csrfToken,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  csrfToken: string | undefined;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const { url } = await adminUploadImage(file, csrfToken);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <Label className="text-sm font-semibold text-navy">{label}</Label>
      <div className="mt-2 flex items-center gap-4">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-20 w-20 rounded-lg border border-border object-cover"
          />
        ) : (
          <div className="h-20 w-20 rounded-lg border border-dashed border-border" />
        )}
        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
          />
          {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
        </div>
      </div>
    </div>
  );
}
