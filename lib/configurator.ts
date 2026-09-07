import type { Category } from "./types";

/** Kategorijos filtrams — fiksuotos, ne turinys. */
export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "palapines", label: "Palapinės ir paviljonai" },
  { id: "baldai", label: "Baldai" },
  { id: "tekstile", label: "Tekstilė ir dekoras" },
  { id: "apsvietimas", label: "Apšvietimas ir šildytuvai" },
];

/**
 * Renginio skaičiuoklės logika: pagal svečių skaičių ir formatą grąžina
 * rekomenduojamą palapinės dydį bei baldų kiekį. Grynas, testuojamas.
 */
export function recommend(guests: number, seated: boolean) {
  // ~1.2 m²/žm. sėdint prie stalų, ~0.9 m²/žm. furšetui + 20% zonoms
  const perGuest = seated ? 1.2 : 0.9;
  const area = Math.ceil(guests * perGuest * 1.2);

  const sizes = [
    { label: "Pagoda 5×5", area: 25 },
    { label: "Palapinė 6×12", area: 72 },
    { label: "Dvišlaitė 10×15", area: 150 },
    { label: "Dvišlaitė 10×20", area: 200 },
    { label: "Dvišlaitė 15×30", area: 450 },
  ];
  const tent = sizes.find((s) => s.area >= area) ?? sizes[sizes.length - 1];

  return {
    area,
    tent: tent.label,
    tables: Math.ceil(guests / 10),
    chairs: guests,
  };
}
