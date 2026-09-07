import type { MetadataRoute } from "next";
import { SITE } from "@/lib/metadata";
// import { getAllPostSlugs, getAllServiceSlugs } from "@/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/galerija",
    "/duk",
    "/straipsniai",
    "/kontaktai",
    "/paslaugos/palapines",
    "/paslaugos/baldai",
    "/paslaugos/tekstile",
    "/paslaugos/apsvietimas",
  ].map((path) => ({
    url: new URL(path, SITE.url).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  // Dinaminis turinys iš Sanity — atkomentuoti prijungus queries:
  // const posts = await getAllPostSlugs();
  // const postRoutes = posts.map((slug) => ({
  //   url: `${SITE.url}/straipsniai/${slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: "monthly" as const,
  //   priority: 0.6,
  // }));

  return [...staticRoutes /*, ...postRoutes */];
}
