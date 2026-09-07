import { NextResponse } from "next/server";
import { z } from "zod";
import { sendQuoteEmail } from "@/lib/email";
import { sendMetaCapiLead } from "@/lib/meta-capi";
import { rateLimit, getClientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

/* ---------------- Įvesties validacija (Zod) ---------------- */
const quoteSchema = z.object({
  eventType: z.string().min(1, "Pasirinkite renginio tipą"),
  date: z.string().min(1, "Nurodykite datą"),
  guests: z
    .string()
    .min(1)
    .refine((v) => Number(v) >= 1, "Įveskite svečių skaičių"),
  city: z.string().min(1, "Nurodykite miestą"),
  venue: z.string().optional().default(""),
  items: z.array(z.object({ name: z.string() })).optional().default([]),
  name: z.string().min(1, "Įveskite vardą"),
  email: z.string().email("Neteisingas el. paštas"),
  phone: z.string().min(6, "Įveskite telefoną"),
  message: z.string().max(2000).optional().default(""),
  gdpr: z.literal(true, { errorMap: () => ({ message: "Reikalingas sutikimas" }) }),
  website: z.string().max(0).optional(), // honeypot — turi likti tuščias
  turnstileToken: z.string().optional(),
  metaEventId: z.string().optional(), // dedup su naršyklės Meta Pixel
});

/* ---------------- Cloudflare Turnstile patikra ---------------- */
async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile neįjungtas — praleidžiam
  if (!token) return false;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    }
  );
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

/* ---------------- Handler ---------------- */
export async function POST(req: Request) {
  const ip = getClientIp(req);

  // 1) Rate-limit
  const { success: allowed } = rateLimit(ip, 5);
  if (!allowed) {
    return NextResponse.json(
      { error: "Per daug užklausų. Bandykite po minutės." },
      { status: 429 }
    );
  }

  // 2) Parsinam + validuojam
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Blogas užklausos formatas" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Patikrinkite formos laukus",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }
  const data = parsed.data;

  // 3) Honeypot — jei užpildytas, tyliai „pavyko" (botas negauna signalo)
  if (data.website) return NextResponse.json({ ok: true });

  // 4) Turnstile
  const human = await verifyTurnstile(data.turnstileToken, ip);
  if (!human) {
    return NextResponse.json(
      { error: "Nepavyko patvirtinti, kad nesate robotas" },
      { status: 403 }
    );
  }

  // 5) Siunčiam laišką (svarbiausias veiksmas)
  try {
    await sendQuoteEmail(data);
  } catch (err) {
    console.error("Quote email error:", err);
    return NextResponse.json(
      { error: "Nepavyko išsiųsti. Bandykite dar kartą." },
      { status: 500 }
    );
  }

  // 6) Meta CAPI (server-side Lead) — nebūtinas; niekada neblokuoja atsakymo
  if (data.metaEventId) {
    try {
      await sendMetaCapiLead({
        eventId: data.metaEventId,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        sourceUrl: req.headers.get("referer") ?? undefined,
        clientIp: ip,
        userAgent: req.headers.get("user-agent") ?? undefined,
      });
    } catch (err) {
      console.error("Meta CAPI error (nekritinė):", err);
    }
  }

  return NextResponse.json({ ok: true });
}
