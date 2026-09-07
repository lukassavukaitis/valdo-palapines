"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Users, MapPin } from "lucide-react";

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section className="relative isolate overflow-hidden">
      {/* Foninis video/nuotrauka — realiam projekte <video> arba next/image */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[url('/hero/tent.jpg')] bg-cover bg-center" />
        {/* Tamsus gradientas įskaitomumui */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/70" />
      </div>

      <div className="mx-auto flex max-w-content flex-col items-center px-4 pb-14 pt-28 text-center sm:px-6 sm:pt-36">
        <motion.p
          {...rise(0)}
          className="mb-4 text-sm font-medium uppercase tracking-widest text-gold"
        >
          Nuoma visoje Lietuvoje
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          className="max-w-3xl text-4xl font-semibold leading-tight text-ivory sm:text-6xl"
        >
          Palapinės, kurios paverčia vietą į šventę
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-5 max-w-xl text-base text-ivory/80 sm:text-lg"
        >
          Paviljonai, baldai, tekstilė ir apšvietimas vestuvėms, jubiliejams ir
          įmonių renginiams. Švaru, laiku, be rūpesčių.
        </motion.p>

        {/* Greitos užklausos juosta */}
        <motion.form
          {...rise(0.24)}
          action="/#uzklausa"
          className="mt-10 w-full max-w-3xl rounded-xl2 border border-ivory/15 bg-ivory/95 p-2 shadow-xl backdrop-blur sm:flex sm:items-stretch sm:gap-2"
        >
          <Field icon={<CalendarDays size={18} />} label="Data">
            <input
              type="date"
              name="date"
              className="w-full bg-transparent text-sm text-ink outline-none"
            />
          </Field>
          <Field icon={<Users size={18} />} label="Žmonių skaičius">
            <input
              type="number"
              name="guests"
              min={1}
              placeholder="pvz. 80"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-stone/60"
            />
          </Field>
          <Field icon={<MapPin size={18} />} label="Miestas">
            <input
              type="text"
              name="city"
              placeholder="pvz. Kaunas"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-stone/60"
            />
          </Field>
          <button type="submit" className="btn-primary mt-2 w-full sm:mt-0 sm:w-auto">
            Skaičiuoti
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-1 items-center gap-3 rounded-lg px-4 py-2.5 text-left hover:bg-sand/50">
      <span className="text-forest">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium text-stone">{label}</span>
        {children}
      </span>
    </label>
  );
}
