/** Konversijų sekimo pagalbininkas. Saugus iškviesti bet kur — jei įrankiai
 *  neįkelti (nėra sutikimo ar ID), tyliai nieko nedaro. */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Proxy „lead" vertė Smart Bidding'ui. Nuo 2026-04 GA4 `generate_lead` skaitomas
 * kaip key event tik su `value` + `currency`. Reikšmė = apytikslė vidutinė
 * užklausos vertė (vidutinė marža × tikimybė, kad taps klientu). Koreguok pagal
 * realius duomenis. Galima perrašyti per NEXT_PUBLIC_LEAD_VALUE.
 */
const LEAD_VALUE = Number(process.env.NEXT_PUBLIC_LEAD_VALUE ?? 40);
const CURRENCY = "EUR";

/** Iškviečiama sėkmingai išsiuntus užklausos formą. */
export function trackLead(meta?: {
  eventType?: string;
  city?: string;
  eventId?: string; // dedup su Meta CAPI (server-side)
}) {
  if (typeof window === "undefined") return;

  // GA4: generate_lead (su verte — būtina 2026 m.)
  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", {
      currency: CURRENCY,
      value: LEAD_VALUE,
      event_category: "quote_form",
      event_label: meta?.eventType,
      city: meta?.city,
    });
  }

  // Meta Pixel: Lead (su eventID dedublikacijai su serverio CAPI įvykiu)
  if (typeof window.fbq === "function") {
    window.fbq(
      "track",
      "Lead",
      { value: LEAD_VALUE, currency: CURRENCY, content_category: meta?.eventType },
      meta?.eventId ? { eventID: meta.eventId } : undefined
    );
  }
}
