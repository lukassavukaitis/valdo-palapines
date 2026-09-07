/** Bendri tipai — be runtime kodo, saugu importuoti ir client, ir server komponentuose. */

export type Category = "palapines" | "baldai" | "tekstile" | "apsvietimas";

export type Service = {
  _id: string;
  name: string;
  slug: string;
  category: Category;
  capacity?: string;
  specs?: string[];
  description?: string;
  priceFrom?: number;
  imageUrl?: string;
  imageAlt?: string;
};

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  coverUrl?: string;
  coverAlt?: string;
};

export type Post = PostListItem & {
  body?: any[]; // Portable Text
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImageUrl?: string;
    noIndex?: boolean;
  };
};

export type GalleryImage = {
  _id: string;
  category: "Vestuvės" | "Įmonių šventės" | "Gimtadieniai";
  caption?: string;
  featured?: boolean;
  url: string;
  alt?: string;
  lqip?: string;
  dimensions?: { width: number; height: number; aspectRatio: number };
};

export type Testimonial = {
  _id: string;
  author: string;
  event?: string;
  quote: string;
  rating?: number;
};

export type SiteSettings = {
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  companyDetails?: string;
};
