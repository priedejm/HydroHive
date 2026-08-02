import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendContactEmail } from "@/lib/api";

const heroContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(200),
  phone: z.string().trim().min(7, "Please enter a valid phone").max(30),
});

export function HeroEstimateForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = heroContactSchema.safeParse({ name, email, phone });
    if (!result.success) {
      const next: Record<string, string> = {};
      result.error.issues.forEach((issue) => (next[String(issue.path[0])] = issue.message));
      setErrors(next);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await sendContactEmail({
        name,
        email,
        number: phone,
        subject: "Hydro Hive - New Estimate Request (Homepage)",
        content: `New estimate request from the homepage.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`,
      });
      toast.success("Thanks! We'll get back to you within 24 hours.");
      setDone(true);
    } catch (err) {
      console.error("Failed to send estimate request:", err);
      toast.error("Something went wrong sending your request — please call or text us instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="mx-auto h-14 w-14 rounded-full bg-gold grid place-items-center">
          <Check className="h-7 w-7 text-navy" strokeWidth={3} />
        </div>
        <h3 className="mt-4 font-display text-xl text-navy">You're all set.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Someone from the Hive will reach out within 24 hours.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setDone(false);
            setName("");
            setEmail("");
            setPhone("");
          }}
          className="mt-5 rounded-full text-navy"
        >
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3 className="font-display text-xl sm:text-2xl text-navy">Get a Free Estimate</h3>
      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
        Quick quote - we'll follow up within 24 hours.
      </p>

      <div className="mt-3 sm:mt-5 space-y-2.5 sm:space-y-3">
        <div>
          <Label htmlFor="hero-name" className="text-sm font-semibold text-navy">Name</Label>
          <Input
            id="hero-name"
            name="name"
            autoComplete="name"
            className="mt-1.5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="hero-phone" className="text-sm font-semibold text-navy">Phone</Label>
          <Input
            id="hero-phone"
            name="phone"
            autoComplete="tel"
            className="mt-1.5"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(843) 555-0123"
          />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        </div>
        <div>
          <Label htmlFor="hero-email" className="text-sm font-semibold text-navy">Email</Label>
          <Input
            id="hero-email"
            name="email"
            autoComplete="email"
            type="email"
            className="mt-1.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 sm:mt-5 w-full rounded-full bg-gold text-navy hover:bg-gold/90 h-10 sm:h-11 font-semibold disabled:opacity-70"
      >
        {isSubmitting ? "Sending..." : (
          <>
            Get My Free Estimate <ArrowRight className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
