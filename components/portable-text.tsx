import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity.image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlFor(value).width(1200).url()}
          alt={value.alt || ""}
          loading="lazy"
          className="my-8 w-full rounded-xl2"
        />
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 font-display text-2xl font-semibold sm:text-3xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-xl font-semibold">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 leading-relaxed text-ink/90">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-gold pl-5 italic text-stone">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 list-disc space-y-1 pl-6 text-ink/90">{children}</ul>,
    number: ({ children }) => <ol className="mt-4 list-decimal space-y-1 pl-6 text-ink/90">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="text-forest underline underline-offset-2" rel="noopener noreferrer">
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  },
};

export function PortableTextBody({ value }: { value: any[] }) {
  return (
    <div className="max-w-2xl">
      <PortableText value={value} components={components} />
    </div>
  );
}
