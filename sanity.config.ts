import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

// Studio (`sanity dev` / `sanity deploy`) mato tik SANITY_STUDIO_* kintamuosius;
// NEXT_PUBLIC_* paliktas atsarginiu variantu.
export default defineConfig({
  name: "valdopalapines",
  title: "Valdopalapines.lt",
  projectId: (process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)!,
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
