"use client";

import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";

/** Lietuvos apskritys ir pagrindiniai miestai — vietiniam (local) SEO. */
const REGIONS: { county: string; cities: string[] }[] = [
  { county: "Vilniaus apskritis", cities: ["Vilnius", "Elektrėnai", "Šalčininkai", "Ukmergė", "Trakai", "Švenčionys"] },
  { county: "Kauno apskritis", cities: ["Kaunas", "Jonava", "Kėdainiai", "Prienai", "Raseiniai", "Kaišiadorys"] },
  { county: "Klaipėdos apskritis", cities: ["Klaipėda", "Palanga", "Kretinga", "Gargždai", "Šilutė"] },
  { county: "Šiaulių apskritis", cities: ["Šiauliai", "Radviliškis", "Kelmė", "Joniškis", "Pakruojis"] },
  { county: "Panevėžio apskritis", cities: ["Panevėžys", "Rokiškis", "Biržai", "Kupiškis", "Pasvalys"] },
  { county: "Alytaus apskritis", cities: ["Alytus", "Druskininkai", "Varėna", "Lazdijai"] },
  { county: "Marijampolės apskritis", cities: ["Marijampolė", "Vilkaviškis", "Šakiai", "Kazlų Rūda"] },
  { county: "Telšių apskritis", cities: ["Telšiai", "Mažeikiai", "Plungė", "Rietavas"] },
  { county: "Tauragės apskritis", cities: ["Tauragė", "Jurbarkas", "Šilalė", "Pagėgiai"] },
  { county: "Utenos apskritis", cities: ["Utena", "Visaginas", "Anykščiai", "Zarasai", "Molėtai", "Ignalina"] },
];

export function Regions() {
  const [open, setOpen] = useState<string | null>("Kauno apskritis");

  return (
    <section id="regionai" className="mx-auto max-w-content px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <header>
          <h2 className="text-3xl font-semibold sm:text-4xl">Aptarnaujami regionai</h2>
          <p className="mt-3 text-stone">
            Atvežame ir sumontuojame įrangą visoje Lietuvoje — nuo Vilniaus iki
            Klaipėdos. Nematote savo miesto? Parašykite, beveik visada atvyksime.
          </p>
          <a href="/#uzklausa" className="btn-primary mt-6">
            Klauskite dėl savo vietovės
          </a>
        </header>

        <div className="divide-y divide-ink/10 rounded-xl2 border border-ink/5 bg-ivory">
          {REGIONS.map((r) => {
            const isOpen = open === r.county;
            return (
              <div key={r.county}>
                <button
                  onClick={() => setOpen(isOpen ? null : r.county)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-3 font-medium text-ink">
                    <MapPin size={17} className="text-forest" />
                    {r.county}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-stone transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pl-12">
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone">
                      {r.cities.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
