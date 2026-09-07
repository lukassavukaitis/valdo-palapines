import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-10-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // useCdn: false — kartu su Next fetch cache + revalidateTag gauname šviežius
  // duomenis iškart po webhook'o, o tarp jų — talpyklą.
  useCdn: false,
  // Skaitymo tokenas nebūtinas viešam datasetui, bet leidžia skaityti juodraščius
  // preview režime, jei prireiktų.
  token: process.env.SANITY_API_READ_TOKEN,
});

/**
 * Bendras fetch su ISR: `revalidate` – kas kiek sekundžių fonas atnaujina;
 * `tags` – leidžia webhook'ui (/api/revalidate) atnaujinti akimirksniu.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  { tags = [], revalidate = 60 }: { tags?: string[]; revalidate?: number } = {}
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate, tags },
  });
}
