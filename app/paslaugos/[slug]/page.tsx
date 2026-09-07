import { notFound } from "next/navigation";
import { buildMetadata, SITE } from "@/lib/metadata";
import { ProductJsonLd, EventVenueJsonLd } from "@/components/seo/json-ld";
import { getServiceBySlug, getServiceSlugs } from "@/lib/sanity.queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const s = await getServiceBySlug(params.slug);
  if (!s) return {};
  return buildMetadata({
    title: s.name,
    description: s.description || `${s.name} — nuoma renginiams visoje Lietuvoje.`,
    path: `/paslaugos/${params.slug}`,
    image: s.imageUrl || "/og/default.jpg",
  });
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const s = await getServiceBySlug(params.slug);
  if (!s) notFound();

  const description = s.description || `${s.name} — nuoma renginiams visoje Lietuvoje.`;
  const image = s.imageUrl || `${SITE.url}/og/default.jpg`;

  return (
    <article className="mx-auto max-w-content px-4 py-24 sm:px-6">
      <ProductJsonLd name={s.name} description={description} image={image} slug={params.slug} />
      <EventVenueJsonLd name={s.name} description={description} maxCapacity={500} />

      <div className="grid gap-10 lg:grid-cols-2">
        <div
          className="aspect-[4/3] rounded-xl2 bg-sand bg-cover bg-center"
          style={s.imageUrl ? { backgroundImage: `url('${s.imageUrl}?w=1000&auto=format')` } : undefined}
          role="img"
          aria-label={s.imageAlt || s.name}
        />
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">{s.name}</h1>
          {s.capacity && (
            <span className="mt-4 inline-block rounded-full bg-forest/10 px-3 py-1 text-sm font-medium text-forest">
              {s.capacity}
            </span>
          )}
          <p className="mt-4 text-lg text-stone">{description}</p>

          {s.specs && s.specs.length > 0 && (
            <ul className="mt-6 space-y-2 text-ink/90">
              {s.specs.map((spec) => (
                <li key={spec} className="flex gap-2">
                  <span className="text-gold">·</span> {spec}
                </li>
              ))}
            </ul>
          )}

          {typeof s.priceFrom === "number" && (
            <p className="mt-6 text-lg">
              Kaina nuo <span className="font-semibold">{s.priceFrom} €</span>
            </p>
          )}

          <a href="/#uzklausa" className="btn-primary mt-8">
            Gauti pasiūlymą
          </a>
        </div>
      </div>
    </article>
  );
}
