import type { MetadataRoute } from "next";
import { SITE } from "@/lib/metadata";
import { getPostSlugs, getServiceSlugs } from "@/lib/sanity.queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([getServiceSlugs(), getPostSlugs()]);

  const entry = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly"
  ) => ({
    url: new URL(path, SITE.url).toString(),
    lastModified: new Date(),
    changeFrequency,
    priority,
  });

  return [
    entry("", 1, "weekly"),
    entry("/straipsniai", 0.7, "weekly"),
    entry("/nuomos-taisykles", 0.4, "monthly"),
    entry("/privatumo-politika", 0.3, "monthly"),
    ...services.map((s) => entry(`/paslaugos/${s.slug}`, 0.7, "weekly")),
    ...posts.map((p) => entry(`/straipsniai/${p.slug}`, 0.6, "monthly")),
  ];
}
