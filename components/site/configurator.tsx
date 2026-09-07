"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, Truck, Gem, ReceiptText } from "lucide-react";
import { recommend } from "@/lib/configurator";

const VALUES = [
  { icon: ShieldCheck, title: "Švara ir kokybė 100%", body: "Kiekvienas vienetas plaunamas ir tikrinamas prieš kiekvieną renginį." },
  { icon: Truck, title: "Operatyvus montavimas", body: "Atvežame ir sumontuojame visoje Lietuvoje — jūs tik švęskite." },
  { icon: Gem, title: "Individualūs sprendimai", body: "Nuo intymios šventės iki 500 svečių pokylio — pritaikom pagal jus." },
  { icon: ReceiptText, title: "Skaidri kainodara", body: "Aiškus pasiūlymas be paslėptų mokesčių per 24 val." },
];

export function ValueProps() {
  return (
    <section className="border-y border-ink/5 bg-sand/40">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {VALUES.map(({ icon: Icon, title, body }) => (
          <div key={title}>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest">
              <Icon size={20} />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Configurator() {
  const [guests, setGuests] = useState(80);
  const [seated, setSeated] = useState(true);

  const result = useMemo(() => recommend(guests, seated), [guests, seated]);

  return (
    <section
      id="konfiguratorius"
      className="mx-auto max-w-content px-4 py-20 sm:px-6"
    >
      <div className="grid items-center gap-10 rounded-xl2 bg-ink p-8 text-ivory sm:p-12 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Kiek erdvės reikės?
          </h2>
          <p className="mt-3 text-ivory/70">
            Įveskite svečių skaičių — pasiūlysime tinkamą palapinės dydį ir
            baldų kiekį per sekundę.
          </p>

          <div className="mt-8">
            <label className="mb-2 block text-sm text-ivory/80">
              Svečių skaičius: <span className="font-semibold text-gold">{guests}</span>
            </label>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full accent-gold"
              aria-label="Svečių skaičius"
            />
          </div>

          <div className="mt-6 inline-flex rounded-full border border-ivory/20 p-1">
            {[
              { v: true, l: "Sėdima (stalai)" },
              { v: false, l: "Furšetas" },
            ].map((opt) => (
              <button
                key={opt.l}
                onClick={() => setSeated(opt.v)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  seated === opt.v ? "bg-gold text-ink" : "text-ivory/70"
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        {/* Rezultatas */}
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Rekomenduojama palapinė" value={result.tent} wide />
          <Stat label="Plotas" value={`~${result.area} m²`} />
          <Stat label="Stalai" value={`${result.tables} vnt.`} />
          <Stat label="Kėdės" value={`${result.chairs} vnt.`} />
          <a href="/#uzklausa" className="btn-primary col-span-2 mt-1">
            Gauti tikslų pasiūlymą
          </a>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-xl2 bg-ivory/5 p-5 ring-1 ring-ivory/10 ${
        wide ? "col-span-2" : ""
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-ivory/50">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ivory">
        {value}
      </p>
    </div>
  );
}
