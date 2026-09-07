import Link from "next/link";
import { getPosts } from "@/lib/sanity.queries";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Straipsniai",
  description:
    "Patarimai ir idėjos vestuvėms bei renginiams: palapinių dydžiai, dekoras, planavimas.",
  path: "/straipsniai",
});

export const revalidate = 60;

export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-content px-4 py-24 sm:px-6">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-4xl font-semibold sm:text-5xl">Straipsniai</h1>
        <p className="mt-3 text-lg text-stone">
          Idėjos ir patarimai jūsų šventei planuoti.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-stone">Straipsnių dar nėra. Užsukite netrukus.</p>
      ) : (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p._id}>
              <Link href={`/straipsniai/${p.slug}`} className="group block">
                <div
                  className="aspect-[16/10] overflow-hidden rounded-xl2 bg-sand bg-cover bg-center"
                  style={p.coverUrl ? { backgroundImage: `url('${p.coverUrl}?w=800&auto=format')` } : undefined}
                  role="img"
                  aria-label={p.coverAlt || p.title}
                />
                {p.category && (
                  <span className="mt-4 inline-block rounded-full bg-forest/10 px-2.5 py-1 text-xs font-medium text-forest">
                    {p.category}
                  </span>
                )}
                <h2 className="mt-2 font-display text-xl font-semibold group-hover:text-forest">
                  {p.title}
                </h2>
                {p.excerpt && <p className="mt-2 text-sm text-stone">{p.excerpt}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
