"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { getConsent, saveConsent } from "@/lib/consent";

/**
 * BDAR slapukų sutikimo juosta. Nieko nesiunčia į išorę — sprendimą saugo
 * localStorage. Analitika (žr. Analytics komponentą) įsijungia tik po sutikimo.
 */
export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    // Rodom tik jei sprendimas dar nepriimtas
    if (!getConsent()) setShow(true);
  }, []);

  function acceptAll() {
    saveConsent({ analytics: true, marketing: true });
    setShow(false);
  }
  function rejectAll() {
    saveConsent({ analytics: false, marketing: false });
    setShow(false);
  }
  function saveChoices() {
    saveConsent({ analytics, marketing });
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4">
      <div className="mx-auto max-w-3xl rounded-xl2 border border-ink/10 bg-ivory p-5 shadow-xl sm:p-6">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 shrink-0 text-gold" size={22} />
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold">Slapukai šioje svetainėje</h2>
            <p className="mt-1 text-sm text-stone">
              Naudojame būtinuosius slapukus svetainės veikimui, o su jūsų sutikimu —
              ir analitinius bei rinkodaros slapukus, kad tobulintume paslaugas.
              Daugiau —{" "}
              <a href="/privatumo-politika" className="text-forest underline">
                privatumo politikoje
              </a>
              .
            </p>

            {/* Detalus pasirinkimas */}
            {customize && (
              <div className="mt-4 space-y-3 border-t border-ink/10 pt-4">
                <Row
                  title="Būtinieji"
                  desc="Reikalingi svetainės veikimui. Visada įjungti."
                  checked
                  disabled
                />
                <Row
                  title="Analitiniai"
                  desc="Google Analytics — padeda suprasti, kaip naudojama svetainė."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <Row
                  title="Rinkodaros"
                  desc="Meta Pixel — reklamos efektyvumui matuoti."
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
            )}

            {/* Mygtukai */}
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={acceptAll} className="btn-primary">
                Priimti visus
              </button>
              {customize ? (
                <button onClick={saveChoices} className="btn-ghost">
                  Išsaugoti pasirinkimą
                </button>
              ) : (
                <button onClick={() => setCustomize(true)} className="btn-ghost">
                  Tvarkyti
                </button>
              )}
              <button onClick={rejectAll} className="btn-ghost">
                Tik būtinieji
              </button>
            </div>
          </div>

          <button
            onClick={rejectAll}
            aria-label="Uždaryti (tik būtinieji)"
            className="shrink-0 text-stone hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  title,
  desc,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium text-ink">{title}</span>
        <span className="block text-xs text-stone">{desc}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-forest disabled:opacity-50"
      />
    </label>
  );
}
