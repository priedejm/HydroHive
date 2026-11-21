import { Fragment, type ReactNode } from "react";

/**
 * Renders editable text with a tiny, client-friendly markup:
 *   *words*        -> <em className={em}>words</em>  (the italic accent style)
 *   single newline -> <br />
 */
export function Rich({ text, em = "italic" }: { text: string; em?: string }) {
  return <>{renderInline(text ?? "", em)}</>;
}

function renderInline(text: string, em: string): ReactNode[] {
  const parts = text.split(/(\*[^*\n]+\*)/g);
  return parts.map((part, i) => {
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className={em}>
          {part.slice(1, -1)}
        </em>
      );
    }
    const lines = part.split("\n");
    return (
      <Fragment key={i}>
        {lines.map((line, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Fragment>
    );
  });
}

/** Splits text on blank lines and renders each chunk as its own <p>. */
export function Paras({ text, className, em }: { text: string; className?: string; em?: string }) {
  const paras = splitParas(text);
  return (
    <>
      {paras.map((p, i) => (
        <p key={i} className={className}>
          <Rich text={p} em={em} />
        </p>
      ))}
    </>
  );
}

export function splitParas(text: string): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** "843-913-8558" -> "tel:+18439138558" */
export function telHref(phone: string, scheme: "tel" | "sms" = "tel") {
  const digits = (phone ?? "").replace(/\D/g, "");
  const full = digits.length === 10 ? `+1${digits}` : digits ? `+${digits}` : "";
  return `${scheme}:${full}`;
}
