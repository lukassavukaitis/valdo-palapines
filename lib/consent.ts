"use client";

/** Vartotojo slapukų sutikimas — laikomas localStorage, be jokių išorinių įrankių. */
export type Consent = {
  necessary: true; // visada true — būtini svetainės veikimui
  analytics: boolean;
  marketing: boolean;
  ts: number; // kada duotas (auditui)
};

const KEY = "vp-consent-v1";
export const CONSENT_EVENT = "vp-consent-change";

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

/** Perduoda sutikimą Google Consent Mode v2 (jei gtag jau apibrėžtas). */
function pushToGoogleConsentMode(c: { analytics: boolean; marketing: boolean }) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
  });
}

export function saveConsent(partial: { analytics: boolean; marketing: boolean }) {
  const consent: Consent = {
    necessary: true,
    analytics: partial.analytics,
    marketing: partial.marketing,
    ts: Date.now(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(consent));
  } catch {
    /* localStorage neprieinamas — tyliai praleidžiam */
  }
  // 1) Google Consent Mode v2 atnaujinimas
  pushToGoogleConsentMode(partial);
  // 2) Praneša Analytics komponentui (Meta Pixel įkėlimui) be perkrovimo
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: consent }));
  return consent;
}
