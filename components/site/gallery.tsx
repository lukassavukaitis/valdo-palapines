"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/lib/types";

const CATS = ["Visos", "Vestuvės", "Įmonių šventės", "Gimtadieniai"] as const;

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<(typeof CATS)[number]>("Visos");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    active === "Visos" ? images : images.filter((i) => i.category === active);

  // Klaviatūra lightbox'e
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, filtered.length]);

  if (images.length === 0) return null;

  return (
    <section id="galerija" className="mx-auto max-w-content px-4 py-20 sm:px-6">
      <header className="mb-8 max-w-2xl">
        <h2 className="text-3xl font-semibold sm:text-4xl">Mūsų darbai</h2>
        <p className="mt-3 text-stone">
          Akimirkos iš realių švenčių — kad matytumėte, kaip atrodys jūsų diena.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            aria-pressed={active === c}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === c
                ? "bg-forest text-ivory"
                : "border border-ink/15 text-ink/70 hover:border-forest hover:text-forest"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Mozaikinis tinklas */}
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {filtered.map((img, idx) => (
          <button
            key={img._id}
            onClick={() => setLightbox(idx)}
            className="block w-full overflow-hidden rounded-xl2"
            aria-label={`Peržiūrėti: ${img.alt || img.caption || "nuotrauka"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${img.url}?w=600&auto=format`}
              alt={img.alt || img.caption || ""}
              loading="lazy"
              className="w-full transition-transform duration-300 hover:scale-[1.03]"
              style={{
                aspectRatio: img.dimensions?.aspectRatio || 1,
                background: img.lqip ? `center / cover url(${img.lqip})` : undefined,
              }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute right-4 top-4 rounded-full p-2 text-ivory/80 hover:text-ivory"
            onClick={() => setLightbox(null)}
            aria-label="Uždaryti"
          >
            <X size={26} />
          </button>
          <button
            className="absolute left-2 rounded-full p-3 text-ivory/70 hover:text-ivory sm:left-6"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
            }}
            aria-label="Ankstesnė"
          >
            <ChevronLeft size={30} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${filtered[lightbox].url}?w=1600&auto=format`}
            alt={filtered[lightbox].alt || ""}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-2 rounded-full p-3 text-ivory/70 hover:text-ivory sm:right-6"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? i : (i + 1) % filtered.length));
            }}
            aria-label="Kita"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    </section>
  );
}
