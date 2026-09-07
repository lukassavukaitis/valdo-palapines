import type { Metadata } from "next";

export const SITE = {
  name: "Valdopalapines.lt",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://valdopalapines.lt",
  description:
    "Aukščiausios kokybės palapinių, paviljonų, baldų, tekstilės ir apšvietimo nuoma šventėms bei renginiams visoje Lietuvoje.",
  phone: "+370 600 00000",
  email: "info@valdopalapines.lt",
  locale: "lt_LT",
} as const;

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
};

/**
 * Vienas šablonas visiems puslapiams. Title šablonas nustatytas layout.tsx —
 * čia paduodam tik puslapio dalį.
 */
export function buildMetadata({
  title,
  description = SITE.description,
  path = "/",
  image,
}: SeoInput = {}): Metadata {
  const url = new URL(path, SITE.url).toString();
  // Jei puslapis neturi savo nuotraukos — sugeneruojam dinaminį OG paveikslėlį
  const ogImage =
    image ??
    `/api/og?title=${encodeURIComponent(title ?? SITE.name)}&subtitle=${encodeURIComponent(
      (description ?? SITE.description).slice(0, 120)
    )}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: title ?? SITE.name,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? SITE.name,
      description,
      images: [ogImage],
    },
  };
}
