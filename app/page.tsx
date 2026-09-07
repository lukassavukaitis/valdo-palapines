import { Hero } from "@/components/site/hero";
import { ValueProps, Configurator } from "@/components/site/configurator";
import { QuoteExperience } from "@/components/site/quote-experience";
import { Gallery } from "@/components/site/gallery";
import { Testimonials } from "@/components/site/testimonials";
import { Regions } from "@/components/site/regions";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/metadata";
import {
  getServices,
  getGalleryImages,
  getTestimonials,
} from "@/lib/sanity.queries";

export const metadata = buildMetadata({
  description:
    "Palapinių, paviljonų, baldų ir apšvietimo nuoma vestuvėms ir renginiams visoje Lietuvoje. Švara, montavimas ir skaidri kainodara.",
  path: "/",
});

export const revalidate = 60;

const FAQ = [
  {
    q: "Ar montuojate palapines visoje Lietuvoje?",
    a: "Taip, atvežame ir sumontuojame įrangą visoje Lietuvoje. Atstumas įskaičiuojamas į pasiūlymą.",
  },
  {
    q: "Kiek iš anksto reikia rezervuoti?",
    a: "Sezono metu (gegužė–rugsėjis) rekomenduojame rezervuoti bent 4–6 savaites iš anksto.",
  },
  {
    q: "Ar galima nuomotis tik baldus be palapinės?",
    a: "Taip, inventorių galima nuomotis atskirai — palapines, baldus, tekstilę ar apšvietimą.",
  },
];

export default async function HomePage() {
  // Lygiagretus duomenų surinkimas iš Sanity
  const [services, gallery, testimonials] = await Promise.all([
    getServices(),
    getGalleryImages(),
    getTestimonials(),
  ]);

  return (
    <>
      <FaqJsonLd items={FAQ} />
      <Hero />
      <ValueProps />
      <QuoteExperience services={services} />
      <Configurator />
      <Gallery images={gallery} />
      <Testimonials items={testimonials} />
      <Regions />

      <section id="duk" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h2 className="mb-8 text-3xl font-semibold sm:text-4xl">Dažniausi klausimai</h2>
        <dl className="divide-y divide-ink/10">
          {FAQ.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-display text-xl font-semibold">{f.q}</dt>
              <dd className="mt-2 text-stone">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
