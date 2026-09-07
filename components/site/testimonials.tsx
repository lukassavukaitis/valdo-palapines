"use client";

import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  if (items.length === 0) return null;

  const t = items[i];
  const go = (dir: number) => setI((p) => (p + dir + items.length) % items.length);

  return (
    <section className="border-y border-ink/5 bg-sand/40">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <Quote className="mx-auto text-gold" size={36} />

        <blockquote className="mt-6 font-display text-2xl leading-snug text-ink sm:text-3xl">
          &#8222;{t.quote}&#8220;
        </blockquote>

        {typeof t.rating === "number" && (
          <div className="mt-6 flex justify-center gap-1" aria-label={`Įvertinimas ${t.rating} iš 5`}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                size={18}
                className={idx < t.rating! ? "fill-gold text-gold" : "text-ink/15"}
              />
            ))}
          </div>
        )}

        <p className="mt-4 text-sm font-medium text-ink">{t.author}</p>
        {t.event && <p className="text-sm text-stone">{t.event}</p>}

        {items.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              className="rounded-full border border-ink/15 p-2 text-ink hover:border-forest hover:text-forest"
              aria-label="Ankstesnis atsiliepimas"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Atsiliepimas ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === i ? "w-6 bg-forest" : "w-2 bg-ink/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              className="rounded-full border border-ink/15 p-2 text-ink hover:border-forest hover:text-forest"
              aria-label="Kitas atsiliepimas"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
