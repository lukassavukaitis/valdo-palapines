import crypto from "crypto";

/**
 * Meta Conversions API (server-side) — dubliuoja naršyklės Pixel „Lead" įvykį iš
 * serverio, kad matomumas nenukentėtų nuo iOS/naršyklės ribojimų. Dedublikacija
 * su Pixel vyksta per bendrą `eventId` (event_id == eventID).
 *
 * ENV:
 *   NEXT_PUBLIC_META_PIXEL_ID  — Pixel ID (tas pats kaip naršyklėje)
 *   META_CAPI_TOKEN            — Conversions API prieigos raktas (Events Manager)
 *
 * Jei kintamųjų nėra — funkcija tyliai praleidžia (nieko nesiunčia).
 */
const sha256 = (v: string) =>
  crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

const digitsOnly = (v: string) => v.replace(/[^\d]/g, "");

export async function sendMetaCapiLead(opts: {
  eventId: string;
  email?: string;
  phone?: string;
  eventType?: string;
  sourceUrl?: string;
  clientIp?: string;
  userAgent?: string;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return; // CAPI neįjungtas

  const userData: Record<string, unknown> = {};
  if (opts.email) userData.em = [sha256(opts.email)];
  if (opts.phone) userData.ph = [sha256(digitsOnly(opts.phone))];
  if (opts.clientIp) userData.client_ip_address = opts.clientIp;
  if (opts.userAgent) userData.client_user_agent = opts.userAgent;

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: opts.eventId, // dedup su naršyklės Pixel
        action_source: "website",
        event_source_url: opts.sourceUrl,
        user_data: userData,
        custom_data: {
          currency: "EUR",
          value: Number(process.env.NEXT_PUBLIC_LEAD_VALUE ?? 40),
          content_category: opts.eventType,
        },
      },
    ],
  };

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Meta CAPI ${res.status}: ${text}`);
  }
}
