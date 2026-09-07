import { defineField, defineType } from "sanity";
import { post } from "./post";
import { service } from "./service";

/** Galerijos nuotrauka su kategorija filtravimui. */
export const galleryImage = defineType({
  name: "galleryImage",
  title: "Galerijos nuotrauka",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Nuotrauka",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt tekstas" })],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorija",
      type: "string",
      options: {
        list: ["Vestuvės", "Įmonių šventės", "Gimtadieniai"],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "caption", title: "Aprašymas", type: "string" }),
    defineField({ name: "featured", title: "Rodyti pagrindinėje", type: "boolean" }),
  ],
  preview: { select: { title: "caption", subtitle: "category", media: "image" } },
});

/** Kliento atsiliepimas (social proof karuselei). */
export const testimonial = defineType({
  name: "testimonial",
  title: "Atsiliepimas",
  type: "document",
  fields: [
    defineField({ name: "author", title: "Autorius", type: "string", validation: (r) => r.required() }),
    defineField({ name: "event", title: "Renginys (pvz. Vestuvės, 2025)", type: "string" }),
    defineField({ name: "quote", title: "Atsiliepimas", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({
      name: "rating",
      title: "Įvertinimas (1–5)",
      type: "number",
      validation: (r) => r.min(1).max(5),
      initialValue: 5,
    }),
  ],
});

/** Pakartotinai naudojamas SEO objektas (įdedamas į post/service). */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "metaTitle", title: "Meta title", type: "string", validation: (r) => r.max(60) }),
    defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 2, validation: (r) => r.max(160) }),
    defineField({
      name: "ogImage",
      title: "OpenGraph nuotrauka (1200×630)",
      type: "image",
    }),
    defineField({ name: "noIndex", title: "Neindeksuoti (noindex)", type: "boolean" }),
  ],
});

/** Globalūs svetainės nustatymai (singleton). */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Svetainės nustatymai",
  type: "document",
  fields: [
    defineField({ name: "phone", title: "Telefonas", type: "string" }),
    defineField({ name: "email", title: "El. paštas", type: "string" }),
    defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "companyDetails", title: "Rekvizitai", type: "text" }),
  ],
});

/** Registracija — importuojama į sanity.config.ts */
export const schemaTypes = [
  post,
  service,
  galleryImage,
  testimonial,
  seo,
  siteSettings,
];
