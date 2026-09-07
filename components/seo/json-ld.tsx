import { SITE } from "@/lib/metadata";

/** Saugiai įterpia JSON-LD į <script>. Server component — nulis JS klientui. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify pakanka; XSS neaktualu, nes duomenys mūsų pačių.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** LocalBusiness — dedamas į root layout, rodomas kiekviename puslapyje. */
export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${SITE.url}/#business`,
        name: SITE.name,
        description: SITE.description,
        url: SITE.url,
        telephone: SITE.phone,
        email: SITE.email,
        priceRange: "€€",
        image: `${SITE.url}/og/default.jpg`,
        address: {
          "@type": "PostalAddress",
          addressCountry: "LT",
          addressRegion: "Kauno apskritis",
          addressLocality: "Kaunas",
        },
        areaServed: {
          "@type": "Country",
          name: "Lietuva",
        },
        sameAs: [
          "https://www.facebook.com/valdopalapines",
          "https://www.instagram.com/valdopalapines",
        ],
      }}
    />
  );
}

/** Product — paslaugos/inventoriaus puslapiui. */
export function ProductJsonLd({
  name,
  description,
  image,
  slug,
}: {
  name: string;
  description: string;
  image: string;
  slug: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        image,
        url: `${SITE.url}/paslaugos/${slug}`,
        brand: { "@type": "Brand", name: SITE.name },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "EUR",
          // Nuomos verslui — nurodom "nuo" kainą arba pašalinam ir naudojam AggregateOffer
          price: "0",
          seller: { "@id": `${SITE.url}/#business` },
        },
      }}
    />
  );
}

/** EventVenue — renginio erdvės tipo paslaugoms. */
export function EventVenueJsonLd({
  name,
  description,
  maxCapacity,
}: {
  name: string;
  description: string;
  maxCapacity: number;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "EventVenue",
        name,
        description,
        maximumAttendeeCapacity: maxCapacity,
        address: {
          "@type": "PostalAddress",
          addressCountry: "LT",
        },
      }}
    />
  );
}

/** FAQPage — DUK sekcijai (labai stiprus SEO rich-result). */
export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }}
    />
  );
}
