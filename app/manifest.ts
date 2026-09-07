import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Valdopalapines.lt — Palapinių ir renginių nuoma",
    short_name: "Valdopalapines",
    description:
      "Palapinių, baldų, tekstilės ir apšvietimo nuoma šventėms bei renginiams visoje Lietuvoje.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F4",
    theme_color: "#2F4A3C",
    lang: "lt",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
