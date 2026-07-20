import { useState, type ReactNode } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Home, Building2, Anchor, Send, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { SERVICES, type ServiceSlug } from "@/lib/site";

const ICONS: Record<ServiceSlug, typeof Home> = {
  residential: Home,
  commercial: Building2,
  dock: Anchor,
  "drone-cleaning": Send,
};

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: z.string().trim().min(7, "Please enter a valid phone").max(30),
  address: z.string().trim().min(3, "Please enter your address").max(200),
});

const STEPS = ["Service", "Property", "Contact", "Review"] as const;

export function QuoteWizard({ initialService }: { initialService?: ServiceSlug }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<ServiceSlug | undefined>(initialService);
  const [size, setSize] = useState<string>("");
  const [stories, setStories] = useState<string>("1");
  const [addons, setAddons] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferred, setPreferred] = useState("email");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const toggleAddon = (v: string) =>
    setAddons((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));

  const canNext = () => {
    if (step === 0) return !!service;
    if (step === 1) return !!size;
    if (step === 2) {
      const r = contactSchema.safeParse({ name, email, phone, address });
      if (!r.success) {
        const e: Record<string, string> = {};
        r.error.issues.forEach((i) => (e[String(i.path[0])] = i.message));
        setErrors(e);
        return false;
      }
      setErrors({});
      return true;
    }
    return true;
  };

  const next = () => canNext() && setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    const payload = { service, size, stories, addons, name, email, phone, address, preferred, notes };
    // TODO: connect form submission to backend / CRM (Supabase, email service, or getquotepage.com integration).
    console.log("[Hydro Hive quote submission]", payload);
    toast.success("Thanks! We'll get back to you within 24 hours.");
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-3xl bg-card p-8 sm:p-12 text-center shadow-sm border border-border">
        <div className="mx-auto h-16 w-16 rounded-full bg-gold grid place-items-center">
          <Check className="h-8 w-8 text-navy" strokeWidth={3} />
        </div>
        <h3 className="mt-6 font-display text-2xl sm:text-3xl text-navy">You're all set.</h3>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Thanks for reaching out. Someone from the Hive will be in touch within 24 hours to lock in
          your free estimate.
        </p>
        <Button
          onClick={() => {
            setDone(false);
            setStep(0);
            setService(undefined);
          }}
          variant="outline"
          className="mt-6 rounded-full"
        >
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card p-6 sm:p-8 shadow-sm border border-border">
      {/* Progress */}
      <ol className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "h-2 flex-1 rounded-full",
                i <= step ? "bg-gold" : "bg-muted",
              )}
            />
            <span
              className={cn(
                "hidden sm:inline text-xs font-semibold whitespace-nowrap",
                i <= step ? "text-navy" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <StepShell title="What can we clean for you?" subtitle="Pick the service closest to what you need - you can add details in a moment.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICES.map((s) => {
              const Icon = ICONS[s.slug];
              const active = service === s.slug;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setService(s.slug)}
                  className={cn(
                    "text-left rounded-2xl border-2 p-5 transition-all hover:-translate-y-0.5",
                    active
                      ? "border-navy bg-navy text-primary-foreground shadow-lg"
                      : "border-border bg-card hover:border-navy/40",
                  )}
                >
                  <div className={cn("h-10 w-10 rounded-xl grid place-items-center", active ? "bg-gold text-navy" : "bg-cream text-navy")}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-3 font-display text-lg">{s.name}</div>
                  <div className={cn("mt-1 text-sm", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    {s.short}
                  </div>
                </button>
              );
            })}
          </div>
        </StepShell>
      )}

      {step === 1 && (
        <StepShell title="Tell us about the property" subtitle="Rough numbers are fine - we'll confirm on-site.">
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold text-navy">Approximate size</Label>
              <RadioGroup value={size} onValueChange={setSize} className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Under 1,500 sq ft", "1,500–3,000 sq ft", "3,000–5,000 sq ft", "5,000+ sq ft"].map((v) => (
                  <label
                    key={v}
                    className={cn(
                      "cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-medium transition-all",
                      size === v ? "border-navy bg-navy text-primary-foreground" : "border-border hover:border-navy/40",
                    )}
                  >
                    <RadioGroupItem value={v} className="sr-only" />
                    {v}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-semibold text-navy">Stories</Label>
              <RadioGroup value={stories} onValueChange={setStories} className="mt-3 flex flex-wrap gap-2">
                {["1", "2", "3+"].map((v) => (
                  <label
                    key={v}
                    className={cn(
                      "cursor-pointer rounded-full border-2 px-5 py-2 text-sm font-medium",
                      stories === v ? "border-navy bg-navy text-primary-foreground" : "border-border hover:border-navy/40",
                    )}
                  >
                    <RadioGroupItem value={v} className="sr-only" />
                    {v} {v === "1" ? "story" : "stories"}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-semibold text-navy">Add-ons</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Windows", "Gutter brightening", "Roof soft wash", "Dock/deck", "Drone reach"].map((v) => {
                  const active = addons.includes(v);
                  return (
                    <label
                      key={v}
                      className={cn(
                        "cursor-pointer inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-medium",
                        active ? "border-navy bg-navy text-primary-foreground" : "border-border hover:border-navy/40",
                      )}
                    >
                      <Checkbox checked={active} onCheckedChange={() => toggleAddon(v)} className="sr-only" />
                      {v}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </StepShell>
      )}

      {step === 2 && (
        <StepShell title="How can we reach you?" subtitle="Your info stays with the Hive. We'll never share it.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(843) 555-0123" />
            </Field>
            <Field label="Email" error={errors.email} className="sm:col-span-2">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </Field>
            <Field label="Property address" error={errors.address} className="sm:col-span-2">
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 King St, Charleston, SC" />
            </Field>
          </div>
        </StepShell>
      )}

      {step === 3 && (
        <StepShell title="Anything else?" subtitle="Optional notes, gate codes, timing preferences.">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-navy">Preferred contact method</Label>
              <RadioGroup value={preferred} onValueChange={setPreferred} className="mt-3 flex flex-wrap gap-2">
                {[
                  { v: "email", l: "Email" },
                  { v: "phone", l: "Phone call" },
                  { v: "text", l: "Text message" },
                ].map(({ v, l }) => (
                  <label
                    key={v}
                    className={cn(
                      "cursor-pointer rounded-full border-2 px-5 py-2 text-sm font-medium",
                      preferred === v ? "border-navy bg-navy text-primary-foreground" : "border-border hover:border-navy/40",
                    )}
                  >
                    <RadioGroupItem value={v} className="sr-only" />
                    {l}
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label className="text-sm font-semibold text-navy">Notes (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 800))}
                placeholder="Anything we should know before we quote?"
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
        </StepShell>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={back}
          disabled={step === 0}
          className="rounded-full text-navy disabled:opacity-0"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={next} className="rounded-full bg-cta text-cta-foreground hover:bg-cta/90 h-11 px-6 font-semibold">
            Continue <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={submit} className="rounded-full bg-gold text-navy hover:bg-gold/90 h-11 px-6 font-semibold">
            Send my estimate request
          </Button>
        )}
      </div>
    </div>
  );
}

function StepShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-2xl sm:text-3xl text-navy">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="text-sm font-semibold text-navy">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
