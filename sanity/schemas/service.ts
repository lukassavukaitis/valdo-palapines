import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Paslauga / Inventorius",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Pavadinimas",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL adresas",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorija",
      type: "string",
      options: {
        list: [
          { title: "Palapinės ir paviljonai", value: "palapines" },
          { title: "Baldai", value: "baldai" },
          { title: "Tekstilė ir dekoras", value: "tekstile" },
          { title: "Apšvietimas ir šildytuvai", value: "apsvietimas" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Nuotrauka",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt tekstas" })],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "capacity",
      title: "Talpa (pvz. „iki 50 žm.“)",
      type: "string",
    }),
    defineField({
      name: "specs",
      title: "Specifikacijos",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "description",
      title: "Aprašymas",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "priceFrom",
      title: "Kaina nuo (€, nebūtina)",
      type: "number",
    }),
    defineField({
      name: "order",
      title: "Rikiavimo eiliškumas",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "image" },
  },
});
