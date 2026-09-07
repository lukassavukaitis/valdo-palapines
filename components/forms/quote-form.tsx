"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { Turnstile } from "@/components/forms/turnstile";
import type { Service } from "@/lib/types";
import { trackLead } from "@/lib/analytics";

type Step = 1 | 2 | 3;
type Status = "idle" | "submitting" | "success" | "error";

const EVENT_TYPES = [
  "Vestuvės",
  "Gimtadienis / jubiliejus",
  "Krikštynos",
  "Įmonių renginys",
  "Kita",
];

export function QuoteForm({
  items,
  onRemoveItem,
}: {
  items: Service[];
  onRemoveItem?: (id: string) => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [form, setForm] = useState({
    eventType: "",
    date: "",
    guests: "",
    city: "",
    venue: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    gdpr: false,
    website: "", // honeypot
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function validate(current: Step): boolean {
    const e: Record<string, string> = {};
    if (current === 1) {
      if (!form.eventType) e.eventType = "Pasirinkite renginio tipą";
      if (!form.date) e.date = "Nurodykite datą";
      if (!form.guests || Number(form.guests) < 1) e.guests = "Įveskite svečių skaičių";
      if (!form.city.trim()) e.city = "Nurodykite miestą";
    }
    if (current === 3) {
      if (!form.name.trim()) e.name = "Įveskite vardą";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Neteisingas el. paštas";
      if (!form.phone.trim()) e.phone = "Įveskite telefoną";
      if (!form.gdpr) e.gdpr = "Reikalingas sutikimas";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validate(step)) setStep((s) => Math.min(3, s + 1) as Step);
  }
  function back() {
    setStep((s) => Math.max(1, s - 1) as Step);
  }

  async function submit() {
    if (!validate(3)) return;
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ name: i.name })),
          turnstileToken,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Nepavyko išsiųsti");
      }
      setStatus("success");
      trackLead({ eventType: form.eventType, city: form.city });
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Nepavyko išsiųsti");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl rounded-xl2 bg-forest p-10 text-center text-ivory">
        <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-ivory/15">
          <Check size={28} />
        </span>
        <h3 className="font-display text-2xl font-semibold">Gavome jūsų užklausą</h3>
        <p className="mt-2 text-ivory/80">
          Su pasiūlymu susisieksime per 24 val. Ačiū, kad renkatės mus.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progresas */}
      <ol className="mb-8 flex items-center justify-center gap-2 text-sm">
        {[
          { n: 1, l: "Renginys" },
          { n: 2, l: "Inventorius" },
          { n: 3, l: "Kontaktai" },
        ].map((s, i) => (
          <li key={s.n} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                step >= s.n ? "bg-forest text-ivory" : "bg-sand text-stone"
              }`}
            >
              {step > s.n ? <Check size={15} /> : s.n}
            </span>
            <span className={step >= s.n ? "text-ink" : "text-stone"}>{s.l}</span>
            {i < 2 && <span className="mx-1 h-px w-6 bg-ink/15" />}
          </li>
        ))}
      </ol>

      <div className="rounded-xl2 border border-ink/5 bg-ivory p-6 sm:p-8">
        {/* 1 — Renginys */}
        {step === 1 && (
          <div className="space-y-5">
            <Field label="Renginio tipas" error={errors.eventType}>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("eventType", t)}
                    className={`rounded-full px-4 py-2 text-sm transition-colors ${
                      form.eventType === t
                        ? "bg-forest text-ivory"
                        : "border border-ink/15 hover:border-forest"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Data" error={errors.date}>
                <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={input} />
              </Field>
              <Field label="Svečių skaičius" error={errors.guests}>
                <input type="number" min={1} value={form.guests} onChange={(e) => set("guests", e.target.value)} placeholder="pvz. 80" className={input} />
              </Field>
              <Field label="Miestas" error={errors.city}>
                <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Kaunas" className={input} />
              </Field>
              <Field label="Vieta / adresas (nebūtina)">
                <input value={form.venue} onChange={(e) => set("venue", e.target.value)} placeholder="Sodyba, salė…" className={input} />
              </Field>
            </div>
          </div>
        )}

        {/* 2 — Inventorius */}
        {step === 2 && (
          <div>
            <p className="mb-4 text-sm text-stone">
              Pridėti vienetai iš katalogo. Galite tęsti ir be jų — pasiūlysime
              patys pagal jūsų renginį.
            </p>
            {items.length === 0 ? (
              <div className="rounded-xl2 border border-dashed border-ink/15 p-8 text-center text-stone">
                Kol kas nieko nepasirinkote. Grįžkite į katalogą arba tęskite —
                rekomenduosime pagal svečių skaičių.
              </div>
            ) : (
              <ul className="space-y-2">
                {items.map((it) => (
                  <li key={it._id} className="flex items-center justify-between rounded-lg bg-sand/50 px-4 py-3">
                    <span className="text-sm font-medium">{it.name}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem?.(it._id)}
                      className="text-stone hover:text-ink"
                      aria-label={`Pašalinti ${it.name}`}
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 3 — Kontaktai */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Vardas" error={errors.name}>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} className={input} />
              </Field>
              <Field label="Telefonas" error={errors.phone}>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+370…" className={input} />
              </Field>
            </div>
            <Field label="El. paštas" error={errors.email}>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={input} />
            </Field>
            <Field label="Papildoma informacija (nebūtina)">
              <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={3} className={input} />
            </Field>

            {/* Honeypot — paslėptas nuo žmonių, matomas botams */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            <label className="flex items-start gap-3 text-sm text-stone">
              <input type="checkbox" checked={form.gdpr} onChange={(e) => set("gdpr", e.target.checked)} className="mt-1 accent-forest" />
              <span>
                Sutinku, kad mano duomenys būtų naudojami užklausai apdoroti pagal{" "}
                <a href="/privatumo-politika" className="underline">privatumo politiką</a>.
              </span>
            </label>
            {errors.gdpr && <p className="text-sm text-red-600">{errors.gdpr}</p>}

            <Turnstile onToken={setTurnstileToken} />

            {status === "error" && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError || "Nepavyko išsiųsti. Pabandykite dar kartą arba skambinkite mums."}
              </p>
            )}
          </div>
        )}

        {/* Navigacija tarp žingsnių */}
        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <button type="button" onClick={back} className="btn-ghost">
              <ChevronLeft size={16} /> Atgal
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button type="button" onClick={next} className="btn-primary">
              Toliau <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={status === "submitting"} className="btn-primary">
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Siunčiama…
                </>
              ) : (
                "Siųsti užklausą"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const input =
  "w-full rounded-lg border border-ink/15 bg-ivory px-3.5 py-2.5 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/20";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
