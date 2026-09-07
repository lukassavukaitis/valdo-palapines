import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Straipsnis",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Antraštė (H1)",
      type: "string",
      validation: (r) => r.required().max(70),
    }),
    defineField({
      name: "slug",
      title: "URL adresas",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Santrauka (meta description)",
      type: "text",
      rows: 3,
      validation: (r) => r.max(160).warning("Rekomenduojama iki 160 simbolių."),
    }),
    defineField({
      name: "coverImage",
      title: "Titulinė nuotrauka",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt tekstas (SEO)", type: "string" }),
      ],
    }),
    defineField({
      name: "body",
      title: "Turinys",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "category",
      title: "Kategorija",
      type: "string",
      options: {
        list: ["Vestuvės", "Įmonių šventės", "Patarimai", "Naujienos"],
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Publikavimo data",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "seo",
      title: "SEO nustatymai",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
