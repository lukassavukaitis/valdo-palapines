"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/configurator";
import type { Category, Service } from "@/lib/types";

/**
 * Filtruojamas inventoriaus grid. Duomenys (`services`) paduodami iš server
 * komponento (Sanity fetch). `onAdd` prijungia „Įtraukti į užklausą" prie formos.
 */
export function Catalog({
  services,
  onAdd,
  selected = [],
}: {
  services: Service[];
  onAdd?: (s: Service) => void;
  selected?: string[];
}) {
  const [active, setActive] = useState<Category | "visi">("visi");

  const items =
    active === "visi"
      ? services
      : services.filter((s) => s.category === active);

  return (
    <section id="katalogas" className="mx-auto max-w-content px-4 py-20 sm:px-6">
      <header className="mb-8 max-w-2xl">
        <h2 className="text-3xl font-semibold sm:text-4xl">Inventorius</h2>
        <p className="mt-3 text-stone">
          Rinkitės iš patikrintos įrangos — kiekvienas vienetas išvalytas ir
          paruoštas jūsų šventei.
        </p>
      </header>

      {/* Filtrai */}
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={active === "visi"} onClick={() => setActive("visi")}>
          Visi
        </FilterChip>
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c.id}
            active={active === c.id}
            onClick={() => setActive(c.id)}
          >
            {c.label}
          </FilterChip>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl2 border border-dashed border-ink/15 p-10 text-center text-stone">
          Šioje kategorijoje inventoriaus dar nėra.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => {
            const isSelected = selected.includes(s._id);
            return (
              <li
                key={s._id}
                className="group flex flex-col overflow-hidden rounded-xl2 border border-ink/5 bg-ivory"
              >
                <div
                  className="aspect-[4/3] bg-sand bg-cover bg-center"
                  style={s.imageUrl ? { backgroundImage: `url('${s.imageUrl}?w=800&auto=format')` } : undefined}
                  role="img"
                  aria-label={s.imageAlt || s.name}
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold">{s.name}</h3>
                    {s.capacity && (
                      <span className="whitespace-nowrap rounded-full bg-forest/10 px-2.5 py-1 text-xs font-medium text-forest">
                        {s.capacity}
                      </span>
                    )}
                  </div>
                  {s.specs && s.specs.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-stone">
                      {s.specs.map((spec) => (
                        <li key={spec}>· {spec}</li>
                      ))}
                    </ul>
                  )}
                  {typeof s.priceFrom === "number" && (
                    <p className="mt-3 text-sm text-ink">
                      Nuo <span className="font-semibold">{s.priceFrom} €</span>
                    </p>
                  )}
                  <button
                    onClick={() => onAdd?.(s)}
                    disabled={isSelected}
                    className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-forest/10 text-forest"
                        : "border border-ink/15 text-ink hover:border-forest hover:text-forest"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Sparkles size={16} /> Užklausoje
                      </>
                    ) : (
                      <>
                        <Plus size={16} /> Įtraukti į užklausą
                      </>
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-forest text-ivory"
          : "border border-ink/15 text-ink/70 hover:border-forest hover:text-forest"
      }`}
    >
      {children}
    </button>
  );
}
