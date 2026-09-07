import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./sanity.client";

const builder = imageUrlBuilder(client);

/** Sukuria optimizuotą Sanity CDN nuotraukos URL. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}
