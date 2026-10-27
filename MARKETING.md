# Valdopalapines.lt — Marketingas, Ads ir SEO

Papildomas gidas po techninio diegimo (žr. `README-MASTER-GIDAS.md`). Čia nėra
serverio ar kodo veiksmų — tik paskyrų nustatymai ir kampanijos.

## 1. Konversijų sekimas (jau kode — belieka įjungti)
Kodas paruoštas 2026 m. reikalavimams:
- **Google Consent Mode v2** — numatytas „denied", atnaujinamas vartotojui
  sutikus (`components/analytics/consent-mode.tsx`, `lib/consent.ts`). ES privaloma.
- **`generate_lead` su verte** — `lib/analytics.ts` siunčia `value` + `currency`
  (be jų GA4 nuo 2026-04 įvykio neskaito). Vertė keičiama per `NEXT_PUBLIC_LEAD_VALUE`.
- **Meta CAPI (server-side `Lead`)** — `/api/quote` dubliuoja Pixel įvykį iš
  serverio su bendru `event_id` (dedup). Įsijungia, kai nustatytas `META_CAPI_TOKEN`.

**Įjungimas:** užpildyk `.env` (GA/Pixel/CAPI ID), redeploy. Patikrink Meta Events
Manager → **Test Events** (turi matytis „Lead" iš serverio ir naršyklės, sujungti).

## 2. GA4 ↔ Google Ads
1. GA4 → Admin → **Product Links → Google Ads Links → Link** (įjunk
   „personalized advertising" — kad remarketingo auditorijos plauktų).
2. Google Ads → Tools → **Conversions → New → Import → GA4 → pažymėk
   `generate_lead`**. Palauk 24–48 val.
3. (Rekomenduojama) įjunk **Enhanced Conversions for Leads** (+10–15 % tikslumo).

## 3. Google Ads — 3 kampanijos
| Kampanija | Skelbimų grupės |
|---|---|
| **Palapinių nuoma** | palapinių nuoma · vestuvių palapinės · dvišlaitės |
| **Paviljonų nuoma** | paviljonų nuoma · pagoda · šventės palapinė |
| **Baldų nuoma šventėms** | stalų nuoma · kėdžių nuoma · banketo baldai |

- **Exact:** `[palapinių nuoma]`, `[paviljonų nuoma]`, `[baldų nuoma šventėms]`,
  `[vestuvių palapinės nuoma]`.
- **Phrase:** `"palapinių nuoma kaune"`, `"paviljono nuoma"`, `"kėdžių nuoma renginiui"`.
- **Neigiami raktažodžiai (paskyros lygiu):**
```
naudotos, naudota, skelbiu, skelbimai, parduoda, parduodu, pardavimas,
pirkti, pirkimas, gamyba, gaminame, gamintojas, siuvimas, nemokamai, nemokama,
darbo, karjera, atlyginimas, instrukcija, kaip pasidaryti, DIY, aliexpress, olx
```
- **Bidding:** startuok **Maximize Conversions**; surinkus ~15–30 konversijų/mėn.
  → **tCPA**.
- **Plėtiniai:** Sitelinks (Palapinės/Baldai/Galerija/Kontaktai), Callouts
  (Montavimas įskaičiuotas · Visa LT), Structured snippets (Paslaugos), **Call
  extension** (telefonas), **Price** (nuo X €), **Location** (susiek su GBP).

## 4. Local SEO + Google Search Console
- **GSC:** https://search.google.com/search-console → pridėk **Domain property**
  → patvirtink DNS TXT → **Sitemaps** → pateik `https://valdopalapines.lt/sitemap.xml`
  → **URL Inspection** → „Request indexing" svarbiausiems puslapiams.
- **Google Business Profile:** kategorija „Palapinių nuomos paslauga", aptarnaujama
  teritorija Kaunas + Kauno apskritis (aprašyme — visa Lietuva), daug nuotraukų,
  vieningas telefonas (NAP). **Atsiliepimų nuoroda:** business.google.com →
  *Read reviews* → *Get more reviews* → dalinimosi ikona → nukopijuok `g.page/r/…`
  nuorodą + QR (QR gaunamas tik kompiuteryje). Siųsk po kiekvieno renginio.
- **Regioninis on-page SEO:** sukurk miestų puslapius (`palapinių nuoma Kaune`,
  `paviljonų nuoma Vilniuje`) su unikaliu tekstu, H1/Title/Meta su miesto raktažodžiu.

## 5. Meta Ads
- **Remarketingas:** auditorija = lankytojai per 30–60 d., kurie NEužpildė formos
  (įtrauk PageView, išbrauk Lead).
- **Kūrybiniai:** realios šventės (4:5 feed, 9:16 Stories/Reels), video „prieš/po",
  atsiliepimai, UGC.
