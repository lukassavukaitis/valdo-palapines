/** Konversijų sekimo pagalbininkas. Saugus iškviesti bet kur — jei įrankiai
 *  neįkelti (nėra sutikimo ar ID), tyliai nieko nedaro. */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Iškviečiama sėkmingai išsiuntus užklausos formą. */
export function trackLead(meta?: { eventType?: string; city?: string }) {
  if (typeof window === "undefined") return;

  // GA4: generate_lead
  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", {
      currency: "EUR",
      value: 0,
      event_category: "quote_form",
      event_label: meta?.eventType,
      city: meta?.city,
    });
  }

  // Meta Pixel: Lead
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", {
      content_category: meta?.eventType,
    });
  }
}
