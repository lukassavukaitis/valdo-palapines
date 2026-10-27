import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export const runtime = "nodejs";

/**
 * Sanity webhook -> akimirksniu atnaujina susijusį turinį svetainėje.
 *
 * Sanity Manage -> API -> Webhooks -> Create:
 *   URL:     https://valdopalapines.lt/api/revalidate
 *   Dataset: production
 *   Trigger: Create / Update / Delete
 *   Filter:  _type in ["service","post","galleryImage","testimonial","siteSettings"]
 *   Projection: { "_type": _type }
 *   Secret:  toks pat kaip SANITY_REVALIDATE_SECRET
 */
export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Trūksta serverio konfigūracijos" }, { status: 500 });
  }

  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const bodyText = await req.text();

  const valid = await isValidSignature(bodyText, signature ?? "", secret);
  if (!valid) {
    return NextResponse.json({ error: "Neteisingas parašas" }, { status: 401 });
  }

  let _type: string | undefined;
  try {
    ({ _type } = JSON.parse(bodyText) as { _type?: string });
  } catch {
    return NextResponse.json({ error: "Blogas JSON" }, { status: 400 });
  }
  if (!_type) {
    return NextResponse.json({ error: "Trūksta _type" }, { status: 400 });
  }

  // Tag'ai sutampa su _type reikšmėmis (žr. lib/sanity.queries.ts)
  revalidateTag(_type);

  return NextResponse.json({ revalidated: true, type: _type, now: Date.now() });
}
