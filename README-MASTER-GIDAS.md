# Valdopalapines.lt — MASTER diegimo ir paleidimo gidas

Vienintelis pilnas techninis vadovas nuo A iki Ž: paskyros → seed → deploy ant
Hetzner → marketingas. Instrukcija kaimynui (turinio valdymas) — atskirame faile
`KAIMYNO-VALDYMO-GIDAS.md`.

> **Reikės:** kompiuterio su `git` ir `Node.js 22`, domeno `valdopalapines.lt`,
> Hetzner VPS (Ubuntu 24.04), banko kortelės kai kurioms nemokamoms paskyroms
> patvirtinti.

---

# ETAPAS 1 — Paskyros ir raktai (A–Ž)

## 1.1. GitHub — privati repozitorija
1. Susikurk paskyrą https://github.com (jei neturi).
2. Viršuje dešinėje **+ → New repository** → pavadinimas `valdopalapines` →
   **Private** → **Create** (be README/gitignore).
3. Kompiuteryje, projekto aplanke:
```bash
cd valdopalapines
git init
git add .
git commit -m "Pradinis Valdopalapines.lt projektas"
git branch -M main
git remote add origin https://github.com/TAVO-VARDAS/valdopalapines.git
git push -u origin main
```
> Jei prašo prisijungti — naudok **Personal Access Token** (GitHub → Settings →
> Developer settings → Tokens) vietoje slaptažodžio.

## 1.2. Resend — el. paštas (užklausų laiškai)
1. Registruokis https://resend.com (nemokamai: 3 000 laiškų/mėn.).
2. **Domains → Add Domain** → `valdopalapines.lt`.
3. Resend parodys DNS įrašus — suvesk juos domeno DNS valdyme (arba Cloudflare):
   - **MX** (pašto maršrutas, pvz. `send.valdopalapines.lt`)
   - **TXT (SPF)** — `v=spf1 include:...`
   - **CNAME/TXT (DKIM)** — parašui
   - (rekomenduojama) **TXT (DMARC)**
4. Palauk, kol statusas taps **Verified**.
5. **API Keys → Create** → nukopijuok `re_...` → tai `RESEND_API_KEY`.
6. `QUOTE_FROM_EMAIL` turi būti ant verifikuoto domeno (pvz.
   `uzklausos@valdopalapines.lt`); `QUOTE_TO_EMAIL` — kaimyno dėžutė.

## 1.3. Sanity Cloud — turinio CMS
1. Registruokis https://www.sanity.io.
2. Projekto aplanke:
```bash
npm install
npx sanity login
npx sanity init --env      # „Create new project" -> vardas Valdopalapines, dataset production (public)
```
   `--env` įrašys `NEXT_PUBLIC_SANITY_PROJECT_ID` ir `_DATASET` į `.env`.
3. Studio kaimynui paskelbk:
```bash
npx sanity deploy          # pasirink adresą -> https://valdopalapines.sanity.studio
```
4. **Tokenai** (Manage → https://www.sanity.io/manage → API → Tokens):
   - **Viewer** → `SANITY_API_READ_TOKEN` (nebūtina viešam datasetui)
   - **Editor** → `SANITY_API_WRITE_TOKEN` (reikia TIK seed'ui, ETAPAS 2)
5. `SANITY_REVALIDATE_SECRET` — sugalvok ilgą atsitiktinį tekstą (jį naudosi ir
   Sanity webhook'e: Manage → API → Webhooks → URL `https://valdopalapines.lt/api/revalidate`).

## 1.4. Cloudflare Turnstile — formų apsauga (nebūtina, rekomenduojama)
1. https://dash.cloudflare.com → **Turnstile → Add site** → domenas
   `valdopalapines.lt`.
2. Gausi **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` ir **Secret Key** →
   `TURNSTILE_SECRET_KEY`.
> Jei šių nepridėsi — apsauga tiesiog išjungta (formą saugo honeypot + rate-limit).

## 1.5. Analytics & Ads ID
- **GA4 Measurement ID** (`G-XXXXXXX`): https://analytics.google.com → Admin →
  Data Streams → (sukurk Web stream `valdopalapines.lt`) → viršuje matomas
  `G-...` → `NEXT_PUBLIC_GA_ID`.
- **Meta Pixel ID**: https://business.facebook.com → Events Manager → Connect Data
  Sources → Web → sukurk Pixel → ID (skaičiai) → `NEXT_PUBLIC_META_PIXEL_ID`.
- **Meta CAPI token** (nebūtina, server-side): Events Manager → tavo Pixel →
  Settings → **Conversions API → Generate access token** → `META_CAPI_TOKEN`.

---

# ETAPAS 2 — Lokalus seed'inimas (pradinis turinys)

Kad kaimynas iškart matytų užpildytą CMS (4 palapinės, baldai, kontaktai).

1. Kompiuteryje sukurk `.env` (iš `.env.example`) ir suvesk bent:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=sk...   # Editor tokenas iš 1.3
```
2. Paleisk:
```bash
npm install
npm run seed
```
Įkels: Dvišlaitė, Pagoda, Flex, Karūna + banketo stalai/kėdės + apšvietimas +
tekstilė + svetainės kontaktus. Idempotentiška (galima kartoti). **Nuotraukas**
kaimynas prideda per Studio.

---

# ETAPAS 3 — Hetzner VPS: paruošimas ir deploy

## 3.1. Serverio paruošimas
Prisijunk prie VPS ir:
```bash
# darbinis naudotojas + SSH raktas
adduser deploy && usermod -aG sudo deploy
# (į /home/deploy/.ssh/authorized_keys įkelk savo viešą SSH raktą)

# ugniasienė
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER      # po šito perlogink SSH sesiją
```
Caddy diegti atskirai nereikia — jis pakyla konteineriu ir tvarko SSL.

## 3.2. Kodo klonavimas
```bash
cd /opt
sudo git clone https://github.com/TAVO-VARDAS/valdopalapines.git
sudo chown -R $USER:$USER valdopalapines && cd valdopalapines
```

## 3.3. Serverio `.env` — pilna kintamųjų lentelė
```bash
cp .env.example .env && nano .env
```

| # | Kintamasis | Pavyzdys / reikšmė | Būtinas |
|---|---|---|---|
| 1 | `NEXT_PUBLIC_SITE_URL` | `https://valdopalapines.lt` | ✅ |
| 2 | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `a1b2c3d4` | ✅ |
| 3 | `NEXT_PUBLIC_SANITY_DATASET` | `production` | ✅ |
| 4 | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAA...` | ⬜ |
| 5 | `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | ⬜ |
| 6 | `NEXT_PUBLIC_META_PIXEL_ID` | `123456789012345` | ⬜ |
| 7 | `NEXT_PUBLIC_LEAD_VALUE` | `40` | ⬜ |
| 8 | `SANITY_API_READ_TOKEN` | `sk...` | ⬜ |
| 9 | `SANITY_REVALIDATE_SECRET` | `ilgas-atsitiktinis-tekstas` | ✅ |
| 10 | `RESEND_API_KEY` | `re_xxxx` | ✅ |
| 11 | `QUOTE_TO_EMAIL` | `kaimynas@pastas.lt` | ✅ |
| 12 | `QUOTE_FROM_EMAIL` | `uzklausos@valdopalapines.lt` | ✅ |
| 13 | `TURNSTILE_SECRET_KEY` | `0x4AAAA...` | ⬜ |
| 14 | `META_CAPI_TOKEN` | `EAAxxxx` | ⬜ |

> `SANITY_API_WRITE_TOKEN` serveryje NEREIKALINGAS — jis tik lokaliam seed'ui.

## 3.4. Paleidimas + DNS
```bash
docker compose up -d --build
docker compose logs -f web        # stebėk startą (Ctrl+C išeiti)
```
DNS (domeno registre arba Cloudflare):
```
A   @     <VPS_IP>
A   www   <VPS_IP>
```
Kai DNS pasklinda, Caddy automatiškai išduoda Let's Encrypt SSL. Patikra:
```bash
curl -I https://valdopalapines.lt      # HTTP/2 200 + HSTS antraštė
```

## 3.5. GitHub Secrets + CI/CD patikra
Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Reikšmė |
|---|---|
| `SSH_HOST` | VPS IP |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | privatus SSH raktas (visas turinys) |
| `SSH_PORT` | `22` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity ID (build patikrai) |

Patikra: pakeisk ką nors → `git push origin main` → GitHub **Actions** → turi
praeiti `quality` (lint/typecheck/build) ir `deploy` (SSH → `git pull` +
`docker compose build` + `up -d --remove-orphans` + prune). Po ~2–3 min pakeitimas
matomas svetainėje.

---

# ETAPAS 4 — Marketingas, Ads ir SEO

## 4.1. Konversijų sekimas (jau kode — belieka įjungti)
Kodas paruoštas 2026 m. reikalavimams:
- **Google Consent Mode v2** — numatytas „denied", atnaujinamas vartotojui
  sutikus (`components/analytics/consent-mode.tsx`, `lib/consent.ts`). ES privaloma.
- **`generate_lead` su verte** — `lib/analytics.ts` siunčia `value` + `currency`
  (be jų GA4 nuo 2026-04 įvykio neskaito). Vertė keičiama per `NEXT_PUBLIC_LEAD_VALUE`.
- **Meta CAPI (server-side `Lead`)** — `/api/quote` dubliuoja Pixel įvykį iš
  serverio su bendru `event_id` (dedup). Įsijungia, kai nustatytas `META_CAPI_TOKEN`.

**Įjungimas:** užpildyk `.env` (GA/Pixel/CAPI ID), redeploy. Patikrink Meta Events
Manager → **Test Events** (turi matytis „Lead" iš serverio ir naršyklės, sujungti).

## 4.2. GA4 ↔ Google Ads
1. GA4 → Admin → **Product Links → Google Ads Links → Link** (įjunk
   „personalized advertising" — kad remarketingo auditorijos plauktų).
2. Google Ads → Tools → **Conversions → New → Import → GA4 → pažymėk
   `generate_lead`**. Palauk 24–48 val.
3. (Rekomenduojama) įjunk **Enhanced Conversions for Leads** (+10–15 % tikslumo).

## 4.3. Google Ads — 3 kampanijos
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

## 4.4. Local SEO + Google Search Console
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

## 4.5. Meta Ads
- **Remarketingas:** auditorija = lankytojai per 30–60 d., kurie NEužpildė formos
  (įtrauk PageView, išbrauk Lead).
- **Kūrybiniai:** realios šventės (4:5 feed, 9:16 Stories/Reels), video „prieš/po",
  atsiliepimai, UGC.

---

# ETAPAS 5 — Kaimyno perdavimas (5 žingsniai)
1. **Pakviesk į Sanity** (Manage → Members → Invite → Editor).
2. **Perduok `KAIMYNO-VALDYMO-GIDAS.md`** ir kartu pridėkite 1 palapinę → Publish.
3. **Nustatyk `QUOTE_TO_EMAIL`** į kaimyno dėžutę → atlik **testinę užklausą**.
4. **Suteik GBP prieigą** + perduok atsiliepimų nuorodą/QR.
5. **Trumpas skambutis:** kaip atsakyti į užklausą (Reply → klientui) ir keisti kainas.

---

# Mėnesio profilaktika (Lukui)
- **Serveris:** `sudo apt update && sudo apt upgrade -y`; `docker image prune -f`;
  `df -h`; `docker compose ps` + `logs --tail=100`.
- **Backupai:** savaitinis `npx sanity dataset export production` (cron) + Hetzner
  snapshot'ai. Kartą per mėn. patikrink, kad kopija daroma.
- **Uptime:** UptimeRobot pinga `/`.
- **Analitika:** GSC klaidos, GA4 `generate_lead` kiekis, Ads/Meta konversijų statusas.
- **Priklausomybės:** kas kelis mėn. `npm outdated` / Dependabot.

---

*Techninius klausimus tvarko Lukas. Turinį — kaimynas per Sanity Studio
(žr. `KAIMYNO-VALDYMO-GIDAS.md`).*
