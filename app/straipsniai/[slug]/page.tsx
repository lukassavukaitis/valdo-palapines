import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/sanity.queries";
import { buildMetadata, SITE } from "@/lib/metadata";
import { PortableTextBody } from "@/components/portable-text";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    path: `/straipsniai/${post.slug}`,
    image: post.seo?.ogImageUrl || post.coverUrl || "/og/default.jpg",
    ...(post.seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
  });
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverUrl,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/og/default.jpg` },
    },
    mainEntityOfPage: `${SITE.url}/straipsniai/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-content px-4 py-24 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <div className="mx-auto max-w-2xl">
        {post.category && (
          <span className="inline-block rounded-full bg-forest/10 px-2.5 py-1 text-xs font-medium text-forest">
            {post.category}
          </span>
        )}
        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>
        {post.publishedAt && (
          <time className="mt-3 block text-sm text-stone" dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("lt-LT", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
      </div>

      {post.coverUrl && (
        <div
          className="mx-auto mt-8 aspect-[16/9] max-w-3xl rounded-xl2 bg-sand bg-cover bg-center"
          style={{ backgroundImage: `url('${post.coverUrl}?w=1600&auto=format')` }}
          role="img"
          aria-label={post.coverAlt || post.title}
        />
      )}

      <div className="mx-auto mt-10">
        {post.body && <PortableTextBody value={post.body} />}
      </div>

      <div className="mx-auto mt-12 max-w-2xl border-t border-ink/10 pt-8">
        <a href="/#uzklausa" className="btn-primary">
          Gauti pasiūlymą savo šventei
        </a>
      </div>
    </article>
  );
}
