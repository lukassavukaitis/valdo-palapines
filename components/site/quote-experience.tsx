"use client";

import { useState, useCallback } from "react";
import { Catalog } from "@/components/site/catalog";
import { QuoteForm } from "@/components/forms/quote-form";
import type { Service } from "@/lib/types";

/**
 * Sujungia katalogą ir formą: „Įtraukti į užklausą" atsiranda kaip eilutė
 * formos 2 žingsnyje. `services` ateina iš server komponento (Sanity).
 */
export function QuoteExperience({ services }: { services: Service[] }) {
  const [items, setItems] = useState<Service[]>([]);

  const add = useCallback((s: Service) => {
    setItems((prev) => (prev.some((x) => x._id === s._id) ? prev : [...prev, s]));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x._id !== id));
  }, []);

  return (
    <>
      <Catalog services={services} onAdd={add} selected={items.map((i) => i._id)} />

      <section id="uzklausa" className="border-t border-ink/5 bg-sand/40 py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <header className="mb-10 text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">Gaukite pasiūlymą</h2>
            <p className="mx-auto mt-3 max-w-xl text-stone">
              Užpildykite formą — parengsime aiškų pasiūlymą per 24 valandas.
            </p>
          </header>
          <QuoteForm items={items} onRemoveItem={remove} />
        </div>
      </section>
    </>
  );
}
