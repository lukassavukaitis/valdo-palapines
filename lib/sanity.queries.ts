import { sanityFetch } from "./sanity.client";
import type {
  Service,
  PostListItem,
  Post,
  GalleryImage,
  Testimonial,
  SiteSettings,
} from "./types";

/* Bendras filtras — atmeta juodraščius */
const PUBLISHED = `!(_id in path("drafts.**"))`;

/** Apsauga: jei Sanity nepasiekiamas (build ar runtime), gražinam fallback,
 *  kad puslapis nesugriūtų. */
async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return fallback;
  }
}


/* ---------------- Paslaugos / inventorius ---------------- */
const serviceProjection = `{
  _id, name, "slug": slug.current, category, capacity, specs, description, priceFrom,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt
}`;

export function getServices() {
  return safe(
    sanityFetch<Service[]>(
      `*[_type == "service" && ${PUBLISHED}] | order(order asc, name asc) ${serviceProjection}`,
      {},
      { tags: ["service"] }
    ),
    []
  );
}

export function getServiceBySlug(slug: string) {
  return safe(
    sanityFetch<Service | null>(
      `*[_type == "service" && slug.current == $slug][0] ${serviceProjection}`,
      { slug },
      { tags: ["service"] }
    ),
    null
  );
}

export function getServiceSlugs() {
  return safe(
    sanityFetch<{ slug: string }[]>(
      `*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`,
      {},
      { tags: ["service"], revalidate: 3600 }
    ),
    []
  );
}

/* ---------------- Straipsniai (blog) ---------------- */
export function getPosts() {
  return safe(
    sanityFetch<PostListItem[]>(
    `*[_type == "post" && ${PUBLISHED}] | order(publishedAt desc){
      _id, title, "slug": slug.current, excerpt, category, publishedAt,
      "coverUrl": coverImage.asset->url, "coverAlt": coverImage.alt
    }`,
      {},
      { tags: ["post"] }
    ),
    []
  );
}

export function getPostBySlug(slug: string) {
  return safe(
    sanityFetch<Post | null>(
    `*[_type == "post" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, excerpt, category, publishedAt,
      "coverUrl": coverImage.asset->url, "coverAlt": coverImage.alt,
      body,
      seo{
        metaTitle, metaDescription, noIndex,
        "ogImageUrl": ogImage.asset->url
      }
    }`,
    { slug },
      { tags: ["post"] }
    ),
    null
  );
}

export function getPostSlugs() {
  return safe(
    sanityFetch<{ slug: string }[]>(
      `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`,
      {},
      { tags: ["post"], revalidate: 3600 }
    ),
    []
  );
}

/* ---------------- Galerija ---------------- */
export function getGalleryImages() {
  return safe(
    sanityFetch<GalleryImage[]>(
    `*[_type == "galleryImage"] | order(featured desc, _createdAt desc){
      _id, category, caption, featured,
      "url": image.asset->url,
      "alt": image.alt,
      "lqip": image.asset->metadata.lqip,
      "dimensions": image.asset->metadata.dimensions
    }`,
      {},
      { tags: ["galleryImage"] }
    ),
    []
  );
}

/* ---------------- Atsiliepimai ---------------- */
export function getTestimonials() {
  return safe(
    sanityFetch<Testimonial[]>(
      `*[_type == "testimonial"] | order(_createdAt desc){
      _id, author, event, quote, rating
    }`,
      {},
      { tags: ["testimonial"] }
    ),
    []
  );
}

/* ---------------- Svetainės nustatymai (singleton) ---------------- */
export function getSiteSettings() {
  return safe(
    sanityFetch<SiteSettings | null>(
      `*[_type == "siteSettings"][0]{ phone, email, facebook, instagram, companyDetails }`,
      {},
      { tags: ["siteSettings"], revalidate: 300 }
    ),
    null
  );
}
