# Valdopalapines.lt — Next.js 14 karkasas

Production-ready pagrindas šventinio inventoriaus nuomos svetainei. Pakeičia
`paviljonunuomajums.lt`. Stack: **Next.js 14 (App Router) · Tailwind CSS ·
Sanity.io (headless CMS) · Framer Motion**.

---

## Dizaino sistema (design tokens)

Sąmoningai vengiama „AI‑generated" klišės (kreminis fonas + terakota). Prabanga
statoma ant gilios žalios + prislopinto aukso, kas tinka vestuvių/renginių temai.

| Token | Reikšmė | Naudojimas |
|---|---|---|
| `ivory`   | `#FBF9F4` | pagrindinis fonas |
| `sand`    | `#EFE9DD` | sekcijų atskyrimas, kortelės |
| `ink`     | `#1A1B18` | pagrindinis tekstas, tamsios sekcijos |
| `forest`  | `#2F4A3C` | pirminis akcentas, CTA |
| `gold`    | `#B08D4C` | prabangos akcentas (taupiai — linijos, ikonos) |
| `stone`   | `#6B6E66` | antrinis tekstas |

**Tipografija:** `Cormorant Garamond` (display/H1–H2, elegancija) + `Inter`
(UI/body, švarumas ir įskaitomumas). Dvi aiškiai skirtingos šeimos.

**Judesys:** vienas orkestruotas hero atskleidimas (Framer Motion). Jokių
fade‑up ant kiekvienos sekcijos ir hover‑transition ant kiekvienos kortelės —
tai generinės klišės. `prefers-reduced-motion` gerbiamas.

---

## Wireframe (ASCII)

```
┌────────────────────────────────────────────────┐
│  [Logo]   Paslaugos▾ Galerija DUK Straipsniai   │  ← sticky glass nav
│                              Kontaktai [Pasiūlymą]│
├────────────────────────────────────────────────┤
│                                                  │
│      H1: Palapinės, kurios kuria šventę          │  ← Hero + video/slider
│      paantraštė                                  │
│   ┌──────────────────────────────────────────┐  │
│   │ Data | Žmonių sk. | Miestas | [Skaičiuoti]│  │  ← greitos užklausos juosta
│   └──────────────────────────────────────────┘  │
├────────────────────────────────────────────────┤
│  [✓]Švara  [⚡]Montavimas  [◇]Individualu  [€]Kaina│  ← 4 value kortelės
├────────────────────────────────────────────────┤
│  Filtrai: [Visi][Palapinės][Baldai][Tekstilė]... │
│  ┌────┐ ┌────┐ ┌────┐   inventoriaus grid        │  ← Katalogas
│  │foto│ │foto│ │foto│   + „Įtraukti į užklausą"  │
│  └────┘ └────┘ └────┘                            │
├────────────────────────────────────────────────┤
│  KONFIGURATORIUS: tipas + žmonės → rekomendacija │  ← skaičiuoklė
├────────────────────────────────────────────────┤
│  Galerija (filtrai: Vestuvės / Įmonių / Gimtad.) │
├────────────────────────────────────────────────┤
│  Atsiliepimai (karuselė)   ·   Regionai (accord.)│
├────────────────────────────────────────────────┤
│  UŽKLAUSA (multi‑step): 1 Renginys → 2 Inventorius│  ← konversijos šerdis
│                         → 3 Kontaktai            │
├────────────────────────────────────────────────┤
│  Footer: rekvizitai · nuorodos · soc · privatumas│
└────────────────────────────────────────────────┘
```

---

## Struktūra

```
app/
  layout.tsx          Šriftai, globalūs metaduomenys, LocalBusiness JSON-LD
  page.tsx            Titulinis — surenka visas sekcijas
  globals.css         Tailwind + spalvų tokenai
  sitemap.ts          Automatinė sitemap.xml (statiniai + Sanity turinys)
  robots.ts           robots.txt
  paslaugos/[slug]/page.tsx   Paslaugos puslapis + Product/EventVenue JSON-LD
  straipsniai/[slug]/page.tsx Blog straipsnis
components/
  site/navbar.tsx     Sticky glass nav + mobilus meniu
  site/hero.tsx       Hero + greitos užklausos juosta
  site/value-props.tsx
  site/catalog.tsx    Filtruojamas inventoriaus grid
  site/configurator.tsx  Renginio skaičiuoklė
  forms/quote-form.tsx   Multi-step užklausos forma su būsenų valdymu
  seo/json-ld.tsx     Schema.org helperiai
lib/
  metadata.ts         generateMetadata šablonas
  catalog-data.ts     Inventoriaus/rekomendacijų duomenys
sanity/
  schemas/            post, service, galleryImage, testimonial, siteSettings
```

## Paleidimas

```bash
npm install
npm run dev        # http://localhost:3000
```

`.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://valdopalapines.lt
```
