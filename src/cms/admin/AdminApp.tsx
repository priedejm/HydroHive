import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  History as HistoryIcon,
  Home,
  Images,
  LayoutGrid,
  LogOut,
  Menu,
  PencilLine,
  Phone,
  RotateCcw,
  Save,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, ApiError } from "../api";
import { fetchSiteData } from "../SiteData";
import { composeSingle } from "../compose";
import { isPlainObject, mergeContent } from "../merge";
import { sectionLabel, type LabelConfig, type PageDef } from "../labels-core";
import type { ServerSlot, SlotDef } from "../types";
import { FieldEditor, ObjectFields, type EditorCtx } from "./FieldEditor";
import { MediaManager, SlotCard, slotsForPage } from "./MediaManager";
import { ShrinkPhotos } from "./ShrinkPhotos";

export type AdminConfig = {
  siteName: string;
  defaults: Record<string, unknown>;
  labels: LabelConfig;
  slots: Record<string, SlotDef>;
  resolveImage: (value: string) => string;
  /** Brand colour for buttons and highlights, e.g. "var(--color-forest)". */
  accent: string;
  /** A single-photo slot shown in the Overview banner. */
  heroSlot?: string;
};

type Obj = Record<string, unknown>;
type Backup = { name: string; modified: number; size: number };
type View = { kind: "overview" } | { kind: "page"; key: string } | { kind: "media" } | { kind: "history" };

/* Shared class names. The accent colour comes from the --cms-accent variable set on the root. */
const ACCENT_BTN = "bg-[color:var(--cms-accent)] text-white hover:bg-[color:var(--cms-accent)] hover:brightness-110";
const OUTLINE_BTN =
  "inline-flex h-9 items-center gap-2 rounded-md border border-navy/15 bg-white px-4 text-sm font-medium text-navy shadow-xs transition-colors hover:bg-navy/5";
const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.18em] text-navy/45";
const CARD = "rounded-2xl border border-navy/10 bg-white shadow-sm";

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Only what differs from the bundled defaults is saved, so future copy fixes in code still show up. */
function diffContent(def: unknown, val: unknown): unknown {
  if (Array.isArray(def)) return same(def, val) ? undefined : val;
  if (isPlainObject(def) && isPlainObject(val)) {
    const out: Obj = {};
    for (const k of Object.keys(def)) {
      const d = diffContent(def[k], val[k]);
      if (d !== undefined) out[k] = d;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return def === val ? undefined : val;
}

/** "Dr. Rodney Andrews" -> "RA", "Charleston Medicine" -> "CM" (titles like "Dr." are skipped). */
function initials(name: string): string {
  const words = name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w) && !w.endsWith("."));
  const pick = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return pick.map((w) => w[0].toUpperCase()).join("") || "A";
}

function themeStyle(accent: string): CSSProperties {
  return {
    "--cms-accent": accent,
    "--cms-accent-soft": `color-mix(in srgb, ${accent} 12%, white)`,
  } as CSSProperties;
}

export function AdminApp({ config }: { config: AdminConfig }) {
  const [state, setState] = useState<"checking" | "login" | "ready" | "offline">("checking");

  useEffect(() => {
    api
      .session()
      .then((r) => setState(r.loggedIn ? "ready" : "login"))
      .catch((e: ApiError) => setState(e.status === 401 ? "login" : "offline"));
  }, []);

  let body: ReactNode;
  if (state === "checking") body = <p className="pt-24 text-center text-sm text-navy/50">Loading...</p>;
  else if (state === "offline")
    body = (
      <Centered siteName={config.siteName}>
        <h1 className="mt-8 font-serif text-3xl text-navy">Admin unavailable</h1>
        <p className="mt-3 text-sm text-navy/65">
          The admin server isn't reachable. It only works on the live website (it needs the site's PHP server), not in a
          local preview.
        </p>
      </Centered>
    );
  else if (state === "login") body = <Login siteName={config.siteName} onDone={() => setState("ready")} />;
  else body = <Dashboard config={config} onLogout={() => setState("login")} />;

  return (
    <div style={themeStyle(config.accent)} className="min-h-screen bg-[#f3f5f8] font-sans text-navy">
      {body}
    </div>
  );
}

function Monogram({ siteName, className = "size-10 text-sm" }: { siteName: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-[color:var(--cms-accent)] font-semibold tracking-wide text-white ${className}`}
    >
      {initials(siteName)}
    </span>
  );
}

function Brand({ siteName }: { siteName: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Monogram siteName={siteName} />
      <div className="min-w-0">
        <p className="truncate font-serif text-lg leading-tight text-navy">{siteName}</p>
        <p className={EYEBROW}>Content studio</p>
      </div>
    </div>
  );
}

function Centered({ siteName, children }: { siteName: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className={`w-full max-w-sm p-8 ${CARD}`}>
        <Brand siteName={siteName} />
        {children}
      </div>
    </div>
  );
}

function Login({ siteName, onDone }: { siteName: string; onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw) return;
    setBusy(true);
    setError("");
    try {
      await api.login(pw);
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Centered siteName={siteName}>
      <form onSubmit={submit}>
        <h1 className="mt-8 font-serif text-3xl text-navy">Welcome back.</h1>
        <p className="mt-1 text-sm text-navy/60">Enter the admin password to edit your website.</p>
        <label htmlFor="cms-password" className="mt-6 block text-sm font-medium text-navy">
          Password
        </label>
        <div className="relative mt-1.5">
          <Input
            id="cms-password"
            type={show ? "text" : "password"}
            autoFocus
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="bg-white pr-11"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            title={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-navy/45 transition-colors hover:text-navy"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <Button type="submit" className={`mt-5 w-full ${ACCENT_BTN}`} disabled={busy || !pw}>
          {busy ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Centered>
  );
}

const VIEW_KEY = "cms-admin-view";

function readSavedView(pages: PageDef[]): View {
  try {
    const v = JSON.parse(sessionStorage.getItem(VIEW_KEY) ?? "null") as View | null;
    if (v?.kind === "page") return pages.some((p) => p.key === v.key) ? v : { kind: "overview" };
    if (v?.kind === "media" || v?.kind === "history") return v;
  } catch {
    /* storage blocked or bad data - start on the overview */
  }
  return { kind: "overview" };
}

function Dashboard({ config, onLogout }: { config: AdminConfig; onLogout: () => void }) {
  const { defaults, labels } = config;
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<Obj>(defaults);
  const [draft, setDraft] = useState<Obj>(defaults);
  const [media, setMedia] = useState<Record<string, ServerSlot>>({});
  const [backups, setBackups] = useState<Backup[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<View>(() => readSavedView(labels.pages));
  const [navOpen, setNavOpen] = useState(false);

  const load = useCallback(
    async (resetDraft: boolean) => {
      try {
        const d = await fetchSiteData();
        const merged = mergeContent(defaults, d.content) as Obj;
        setSaved(merged);
        if (resetDraft) setDraft(merged);
        setMedia(d.media);
      } catch (e) {
        toast.error((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [defaults],
  );

  const loadBackups = useCallback(() => {
    api
      .listBackups()
      .then((r) => setBackups(r.backups))
      .catch((e) => {
        toast.error((e as Error).message);
        setBackups([]);
      });
  }, []);

  useEffect(() => {
    load(true);
    loadBackups();
  }, [load, loadBackups]);

  const dirty = useMemo(() => !same(saved, draft), [saved, draft]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const go = (v: View) => {
    setView(v);
    setNavOpen(false);
    window.scrollTo(0, 0);
    try {
      sessionStorage.setItem(VIEW_KEY, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.saveContent(diffContent(defaults, draft) ?? {});
      toast.success("Saved - your changes are live.");
      await load(true);
      loadBackups();
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        toast.error("Your session expired. Sign in again (your edits are kept in this tab until you reload).");
      } else toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const discard = () => window.confirm("Throw away all unsaved changes?") && setDraft(saved);

  const logout = async () => {
    if (dirty && !window.confirm("You have unsaved changes. Sign out anyway?")) return;
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    onLogout();
  };

  const ctx: EditorCtx = { cfg: labels, resolveImage: config.resolveImage };
  const contentPages = labels.pages.filter((p) => p.path);
  const sitePage = labels.pages.find((p) => !p.path);
  const status = (key: string) => ({
    unsaved: !same(draft[key], saved[key]),
    edited: !same(saved[key], defaults[key]),
  });

  const currentPage = view.kind === "page" ? labels.pages.find((p) => p.key === view.key) : undefined;
  const crumb =
    view.kind === "overview"
      ? "Overview"
      : view.kind === "media"
        ? "Photos & videos"
        : view.kind === "history"
          ? "History"
          : (currentPage?.label ?? "");

  const navItem = (active: boolean, onClick: () => void, icon: ReactNode, label: string, dot?: boolean) => (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        active ? "bg-[color:var(--cms-accent-soft)] font-medium text-navy" : "text-navy/70 hover:bg-navy/5 hover:text-navy"
      }`}
    >
      <span className={active ? "text-[color:var(--cms-accent)]" : "text-navy/40"}>{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {dot && <span title="Unsaved changes" className="size-2 shrink-0 rounded-full bg-[color:var(--cms-accent)]" />}
    </button>
  );

  const isPage = (key: string) => view.kind === "page" && view.key === key;

  return (
    <>
      {/* Sidebar */}
      {navOpen && <div className="fixed inset-0 z-40 bg-navy/30 lg:hidden" onClick={() => setNavOpen(false)} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-navy/10 bg-white transition-transform lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-5 pb-4 pt-5">
          <Brand siteName={config.siteName} />
          <button type="button" className="text-navy/50 lg:hidden" onClick={() => setNavOpen(false)} aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          <div>{navItem(view.kind === "overview", () => go({ kind: "overview" }), <LayoutGrid className="size-4" />, "Overview")}</div>
          <div>
            <p className={`mb-1.5 px-3 ${EYEBROW}`}>Pages</p>
            <div className="space-y-0.5">
              {contentPages.map((p) => (
                <div key={p.key}>
                  {navItem(
                    isPage(p.key),
                    () => go({ kind: "page", key: p.key }),
                    p.path === "/" ? <Home className="size-4" /> : <FileText className="size-4" />,
                    p.label,
                    status(p.key).unsaved,
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className={`mb-1.5 px-3 ${EYEBROW}`}>Manage</p>
            <div className="space-y-0.5">
              {navItem(view.kind === "media", () => go({ kind: "media" }), <Images className="size-4" />, "Photos & videos")}
              {sitePage &&
                navItem(
                  isPage(sitePage.key),
                  () => go({ kind: "page", key: sitePage.key }),
                  <Phone className="size-4" />,
                  sitePage.label,
                  status(sitePage.key).unsaved,
                )}
              {navItem(view.kind === "history", () => go({ kind: "history" }), <HistoryIcon className="size-4" />, "History")}
            </div>
          </div>
        </nav>
        <div className="space-y-3 border-t border-navy/10 p-4">
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-navy/70 hover:bg-navy/5 hover:text-navy">
            <ExternalLink className="size-4 text-navy/40" /> View website
          </a>
          <div className="flex items-center gap-3 rounded-xl bg-[#f3f5f8] px-3 py-2.5">
            <Monogram siteName={config.siteName} className="size-8 text-xs" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-navy">{config.siteName}</p>
              <p className="text-xs text-navy/50">Signed in</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-navy/10 bg-white/90 px-4 backdrop-blur lg:px-8">
          <button type="button" className="text-navy/60 lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <p className="min-w-0 truncate text-sm text-navy/45">
            Site <span className="px-1">/</span> Admin <span className="px-1">/</span>
            <span className="text-navy">{crumb}</span>
          </p>
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {dirty && (
              <>
                <span className="mr-1 hidden text-sm text-[color:var(--cms-accent)] md:inline">Unsaved changes</span>
                <Button variant="ghost" size="sm" onClick={discard} disabled={saving} className="hidden sm:inline-flex">
                  Discard
                </Button>
                <Button size="sm" onClick={save} disabled={saving} className={ACCENT_BTN}>
                  <Save className="size-4" /> {saving ? "Saving..." : "Save"}
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="size-4" /> <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 lg:px-10 lg:py-10">
          {loading ? (
            <p className="text-sm text-navy/50">Loading...</p>
          ) : view.kind === "overview" ? (
            <Overview
              config={config}
              media={media}
              backups={backups}
              contentPages={contentPages}
              sitePage={sitePage}
              status={status}
              go={go}
            />
          ) : view.kind === "media" ? (
            <>
              <PageHeader eyebrow="Manage" title="Photos & videos">
                Photos and videos change on the site as soon as you upload - no Save needed. Photos that belong to a piece
                of text (like a photo beside a paragraph) are changed with that text on its page.
              </PageHeader>
              <ShrinkPhotos media={media} content={saved} />
              <MediaManager slots={config.slots} media={media} refresh={() => load(false)} />
            </>
          ) : view.kind === "history" ? (
            <HistoryView
              list={backups}
              dirty={dirty}
              onRestored={async () => {
                await load(true);
                loadBackups();
              }}
            />
          ) : currentPage ? (
            <PageEditor
              key={currentPage.key}
              page={currentPage}
              config={config}
              draft={draft}
              saved={saved}
              setDraft={setDraft}
              media={media}
              refreshMedia={() => load(false)}
              ctx={ctx}
              dirty={dirty}
              saving={saving}
              save={save}
            />
          ) : null}
        </main>
      </div>
    </>
  );
}

function PageHeader({
  eyebrow,
  title,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 max-w-2xl">
        <p className={EYEBROW}>{eyebrow}</p>
        <h1 className="mt-1 font-serif text-4xl leading-tight text-navy md:text-5xl">{title}</h1>
        {children && <div className="mt-2 text-sm text-navy/60">{children}</div>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

function Overview({
  config,
  media,
  backups,
  contentPages,
  sitePage,
  status,
  go,
}: {
  config: AdminConfig;
  media: Record<string, ServerSlot>;
  backups: Backup[] | null;
  contentPages: PageDef[];
  sitePage?: PageDef;
  status: (key: string) => { unsaved: boolean; edited: boolean };
  go: (v: View) => void;
}) {
  const home = contentPages.find((p) => p.path === "/") ?? contentPages[0];
  const heroDef = config.heroSlot ? config.slots[config.heroSlot] : undefined;
  const heroUrl = heroDef?.type === "single" ? composeSingle(heroDef, media[config.heroSlot!]).url : "";
  const uploads = Object.values(media).reduce((n, s) => n + (s?.uploads?.length ?? 0), 0);
  const editedPages = contentPages.filter((p) => status(p.key).edited).length;

  const actions: { icon: ReactNode; label: string; onClick: () => void }[] = [
    ...(home ? [{ icon: <PencilLine className="size-5" />, label: "Edit homepage text", onClick: () => go({ kind: "page", key: home.key }) }] : []),
    { icon: <Upload className="size-5" />, label: "Add or replace photos & videos", onClick: () => go({ kind: "media" }) },
    ...(sitePage
      ? [{ icon: <Phone className="size-5" />, label: "Update contact details", onClick: () => go({ kind: "page", key: sitePage.key }) }]
      : []),
    { icon: <RotateCcw className="size-5" />, label: "Restore an earlier version", onClick: () => go({ kind: "history" }) },
  ];

  const stats: { label: string; value: string | number; icon: ReactNode }[] = [
    { label: "Pages", value: contentPages.length, icon: <FileText className="size-4" /> },
    { label: "Pages you've edited", value: editedPages, icon: <PencilLine className="size-4" /> },
    { label: "Your uploads", value: uploads, icon: <Images className="size-4" /> },
    { label: "Saved versions", value: backups ? backups.length : "-", icon: <HistoryIcon className="size-4" /> },
  ];

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Your website, at a glance"
        title="Welcome back."
        actions={
          <a href="/" target="_blank" rel="noopener" className={OUTLINE_BTN}>
            View website <ExternalLink className="size-4" />
          </a>
        }
      />

      {home && (
        <div className="relative -mt-4 overflow-hidden rounded-2xl bg-navy text-white shadow-sm">
          {heroUrl && <img src={heroUrl} alt="" className="absolute inset-y-0 right-0 h-full w-full object-cover md:w-3/5" />}
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/40 md:via-navy/80 md:to-transparent" />
          <div className="relative max-w-md p-8 md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Your homepage</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">{config.siteName}</h2>
            <p className="mt-3 text-sm text-white/75">Change the headline, text and photos visitors see first.</p>
            <Button onClick={() => go({ kind: "page", key: home.key })} className={`mt-6 ${ACCENT_BTN}`}>
              Edit homepage <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <section>
        <h2 className="mb-4 font-serif text-2xl text-navy">What would you like to do?</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className={`group flex items-center gap-3 p-4 text-left transition-shadow hover:shadow-md ${CARD}`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--cms-accent-soft)] text-[color:var(--cms-accent)]">
                {a.icon}
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-navy">{a.label}</span>
              <ArrowRight className="size-4 shrink-0 text-navy/30 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl text-navy">On your website</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`border-t-[3px] border-t-[color:var(--cms-accent)] p-5 ${CARD}`}>
              <div className="flex items-center justify-between gap-2 text-navy/50">
                <span className="text-xs font-medium">{s.label}</span>
                {s.icon}
              </div>
              <p className="mt-3 font-serif text-4xl text-navy">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-2xl text-navy">Your pages</h2>
        <ul className={`divide-y divide-navy/10 overflow-hidden ${CARD}`}>
          {contentPages.map((p) => {
            const st = status(p.key);
            return (
              <li key={p.key}>
                <button
                  type="button"
                  onClick={() => go({ kind: "page", key: p.key })}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-navy/[0.03]"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f3f5f8] text-navy/50">
                    {p.path === "/" ? <Home className="size-4" /> : <FileText className="size-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-navy">{p.label}</span>
                    <span className="block truncate text-xs text-navy/45">{p.path}</span>
                  </span>
                  <StatusPill {...st} />
                  <ChevronRight className="size-4 shrink-0 text-navy/30" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function StatusPill({ unsaved, edited }: { unsaved: boolean; edited: boolean }) {
  if (unsaved)
    return (
      <span className="hidden shrink-0 rounded-full bg-[color:var(--cms-accent-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--cms-accent)] sm:inline">
        Unsaved changes
      </span>
    );
  return (
    <span className="hidden shrink-0 rounded-full bg-[#f3f5f8] px-2.5 py-0.5 text-xs text-navy/55 sm:inline">
      {edited ? "Edited" : "Original content"}
    </span>
  );
}

function PageEditor({
  page,
  config,
  draft,
  saved,
  setDraft,
  media,
  refreshMedia,
  ctx,
  dirty,
  saving,
  save,
}: {
  page: PageDef;
  config: AdminConfig;
  draft: Obj;
  saved: Obj;
  setDraft: (fn: (d: Obj) => Obj) => void;
  media: Record<string, ServerSlot>;
  refreshMedia: () => Promise<void>;
  ctx: EditorCtx;
  dirty: boolean;
  saving: boolean;
  save: () => void;
}) {
  const value = (draft[page.key] ?? {}) as Obj;
  const savedVal = (saved[page.key] ?? {}) as Obj;
  const def = (config.defaults[page.key] ?? {}) as Obj;
  const setPage = (v: unknown) => setDraft((d) => ({ ...d, [page.key]: v }));
  const sections = Object.keys(value);
  const pageDirty = !same(value, savedVal);
  const pageSlots = slotsForPage(config.slots, page.label);

  return (
    <>
      <PageHeader
        eyebrow={page.path ? "Pages" : "Manage"}
        title={page.label}
        actions={
          <>
            {page.path && (
              <a href={page.path} target="_blank" rel="noopener" className={OUTLINE_BTN} title="Opens the live page (shows saved changes)">
                View live page <ExternalLink className="size-4" />
              </a>
            )}
            <Button onClick={save} disabled={!dirty || saving} className={ACCENT_BTN}>
              <Save className="size-4" /> {saving ? "Saving..." : "Save changes"}
            </Button>
          </>
        }
      >
        {sections.length} section{sections.length === 1 ? "" : "s"} ·{" "}
        {pageDirty ? <span className="font-medium text-[color:var(--cms-accent)]">Unsaved changes</span> : "All changes saved"}
      </PageHeader>

      <div className="space-y-4">
        {sections.map((sec) => {
          const secVal = value[sec];
          const secDef = def[sec];
          const unsaved = !same(secVal, savedVal[sec]);
          const edited = !same(secVal, secDef);
          return (
            <details key={sec} className={`group ${CARD}`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-5 [&::-webkit-details-marker]:hidden">
                <div className="min-w-0">
                  <h2 className="font-serif text-xl text-navy">{sectionLabel(config.labels, page.key, sec)}</h2>
                  <p className={`mt-0.5 text-xs ${unsaved ? "font-medium text-[color:var(--cms-accent)]" : "text-navy/45"}`}>
                    {unsaved ? "Unsaved changes" : edited ? "Edited" : "Original site content"}
                  </p>
                </div>
                <ChevronDown className="size-5 shrink-0 text-navy/35 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-navy/10 px-6 py-6">
                {isPlainObject(secVal) ? (
                  <ObjectFields
                    path={[page.key, sec]}
                    value={secVal}
                    def={isPlainObject(secDef) ? secDef : {}}
                    onChange={(v) => setPage({ ...value, [sec]: v })}
                    ctx={ctx}
                  />
                ) : (
                  <FieldEditor path={[page.key, sec]} value={secVal} def={secDef} onChange={(v) => setPage({ ...value, [sec]: v })} ctx={ctx} />
                )}
                {edited && (
                  <div className="mt-6 border-t border-navy/10 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-navy/55"
                      onClick={() =>
                        window.confirm("Put this whole section back to the original website text?") && setPage({ ...value, [sec]: secDef })
                      }
                    >
                      <RotateCcw className="size-4" /> Reset section to original
                    </Button>
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>

      {pageSlots.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-navy">Photos &amp; videos on this page</h2>
          <p className="mb-4 mt-1 text-sm text-navy/60">These change on the site as soon as you upload - no Save needed.</p>
          <div className="space-y-4">
            {pageSlots.map(([id, d]) => (
              <SlotCard key={id} id={id} def={d} server={media[id]} refresh={refreshMedia} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function HistoryView({ list, dirty, onRestored }: { list: Backup[] | null; dirty: boolean; onRestored: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);

  const restore = async (name: string) => {
    const msg = dirty
      ? "You have unsaved changes - they will be lost. Restore this version of the text?"
      : "Restore the website text to this version? (The current text is backed up first.)";
    if (!window.confirm(msg)) return;
    setBusy(true);
    try {
      await api.restoreBackup(name);
      toast.success("Restored - the site now shows that version.");
      await onRestored();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Manage" title="History">
        Every time text is saved, the previous version is kept here (the most recent 30). Restoring a version replaces the
        current text. Photos and videos aren't part of this history.
      </PageHeader>
      {list === null ? (
        <p className="text-sm text-navy/50">Loading...</p>
      ) : list.length === 0 ? (
        <div className={`p-8 text-center text-sm text-navy/55 ${CARD}`}>No earlier versions yet. They appear here after your first save.</div>
      ) : (
        <ul className={`divide-y divide-navy/10 overflow-hidden ${CARD}`}>
          {list.map((b, i) => (
            <li key={b.name} className="flex items-center gap-4 px-5 py-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f3f5f8] text-navy/50">
                <HistoryIcon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-navy">{new Date(b.modified * 1000).toLocaleString()}</span>
                {i === 0 && <span className="block text-xs text-navy/45">Most recent earlier version</span>}
              </span>
              <Button variant="outline" size="sm" disabled={busy} onClick={() => restore(b.name)}>
                <RotateCcw className="size-4" /> Restore
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
