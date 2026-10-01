import type { ReactNode } from "react";
import { useSiteContentQuery } from "@/lib/content/hooks";

// Every admin edit form seeds its local state from live content with
// `useState(content.section)`, which only runs on the form's first render.
// If that render happened before the live /api/content.php fetch resolved,
// the form would be permanently seeded with the bundled DEFAULT_CONTENT
// values instead of the real current DB content - and saving would silently
// overwrite any previous live edits with those stale defaults.
//
// This gate defers rendering `children` (the actual form) until the content
// query's first real fetch has settled, so whatever mounts inside always
// initializes its state from genuine live data.
export function SectionEditorGate({ children }: { children: ReactNode }) {
  const { isFetched } = useSiteContentQuery();
  if (!isFetched) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Loading current content…
      </div>
    );
  }
  return <>{children}</>;
}
