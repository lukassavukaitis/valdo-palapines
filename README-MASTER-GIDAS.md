# Valdopalapines.lt — MASTER diegimo ir paleidimo gidas

Techninis vadovas nuo A iki Ž: paskyros → seed → deploy ant Hetzner. Kiti failai:
- `KAIMYNO-VALDYMO-GIDAS.md` — turinio valdymas kaimynui (netechninis);
- `MARKETING.md` — Google/Meta Ads, GA4, SEO (nebūtina diegimui).

> **Reikės:** kompiuterio su `git` ir `Node.js 22`, domeno `valdopalapines.lt`,
> Hetzner VPS (Ubuntu 24.04), banko kortelės kai kurioms nemokamoms paskyroms
> patvirtinti.

---

# ETAPAS 0 — Paleidimas lokaliai (testavimui)

Atskira nuo diegimo: tinka norint pamatyti svetainę savo kompiuteryje.

```bash
# reikia Node.js 22 LTS (https://nodejs.org) ir git
git clone https://github.com/TAVO-VARDAS/valdopalapines.git
cd valdopalapines
npm ci                          # tiksliai pagal package-lock.json
cp .env.example .env.local      # PowerShell: Copy-Item .env.example .env.local
```
`.env.local` privalomi tik du kintamieji (be jų svetainė net nepasileidžia):
```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
NEXT_PUBLIC_SANITY_DATASET=production
```
Toliau:
```bash
npm run dev                     # http://localhost:3000 (auto-perkrovimas)
npm run lint && npm run typecheck   # tos pačios patikros, kaip GitHub Actions
npm run build && npm start      # produkcinio režimo patikra
npx sanity dev                  # Sanity Studio lokaliai: http://localhost:3333
```
- Formos laiškų testui papildomai reikia `RESEND_API_KEY`, `QUOTE_TO_EMAIL`,
  `QUOTE_FROM_EMAIL`. Turnstile / GA / Meta — nebūtini.
- Docker lokaliai: `docker compose up web` (tik svetainė, be Caddy). **Nepaleisk**
  pilno `docker compose up` — Caddy užima 80/443 portus tikram domenui.
- Be Sanity turinio puslapis atsidaro, bet katalogas, galerija ir atsiliepimai tušti
  (žr. ETAPAS 2 — seed).

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
   Projekte jau yra `sanity.config.ts` ir schemos — jei `init` klausia, ar
   perrašyti konfigūraciją / sukurti naują studio, **atsakyk „ne"** (reikia tik
   projekto ir `.env`). `--env` įrašys `NEXT_PUBLIC_SANITY_PROJECT_ID` ir
   `_DATASET` į `.env`.
3. Studio kaimynui paskelbk:
```bash
npx sanity deploy          # pasirink adresą -> https://valdopalapines.sanity.studio
```
4. **Tokenai** (Manage → https://www.sanity.io/manage → API → Tokens):
   - **Viewer** → `SANITY_API_READ_TOKEN` (nebūtina viešam datasetui)
   - **Editor** → `SANITY_API_WRITE_TOKEN` (reikia TIK seed'ui, ETAPAS 2)
5. `SANITY_REVALIDATE_SECRET` — sugalvok ilgą atsitiktinį tekstą (jį naudosi ir
   Sanity webhook'e). Webhook'ą (Manage → API → Webhooks → Create) nustatyk **tiksliai**:

   | Laukas | Reikšmė |
   |---|---|
   | URL | `https://valdopalapines.lt/api/revalidate` |
   | Dataset | `production` |
   | Trigger | Create, Update, Delete |
   | Filter | `_type in ["service","post","galleryImage","testimonial","siteSettings"]` |
   | Projection | `{ "_type": _type }` ← **būtina**, kitaip svetainė atsako 400 |
   | Secret | tas pats kaip `SANITY_REVALIDATE_SECRET` |

   Be webhook'o pakeitimai vis tiek atsinaujina per ~1 min (automatinis ISR).

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
Repozitorija privati, todėl serveris turi turėti savo „deploy key" (tik skaitymui):
```bash
ssh-keygen -t ed25519 -f ~/.ssh/valdopalapines_deploy -N ""
cat ~/.ssh/valdopalapines_deploy.pub        # nukopijuok išvestį
```
GitHub → repo → **Settings → Deploy keys → Add deploy key** → įklijuok viešą
raktą (palik *Allow write access* **išjungtą**). Tada serveryje:
```bash
printf 'Host github.com\n  IdentityFile ~/.ssh/valdopalapines_deploy\n  IdentitiesOnly yes\n' >> ~/.ssh/config
sudo mkdir -p /opt/valdopalapines && sudo chown $USER:$USER /opt/valdopalapines
git clone git@github.com:TAVO-VARDAS/valdopalapines.git /opt/valdopalapines
cd /opt/valdopalapines
```
> Be šio žingsnio GitHub Actions deploy nepavyks ties `git pull`.

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

> Marketingas, Google/Meta Ads ir SEO perkelta į atskirą failą: `MARKETING.md`.
> Kodas jau paruoštas konversijų sekimui — tereikia užpildyti GA/Pixel/CAPI
> kintamuosius (3.3 lentelė) ir **perbuildinti** (`docker compose up -d --build`),
> nes `NEXT_PUBLIC_*` reikšmės įkepamos build metu.

---

# ETAPAS 4 — Kaimyno perdavimas (5 žingsniai)
1. **Pakviesk į Sanity** (Manage → Members → Invite → Editor).
2. **Perduok `KAIMYNO-VALDYMO-GIDAS.md`** ir kartu pridėkite 1 palapinę → Publish.
3. **Nustatyk `QUOTE_TO_EMAIL`** į kaimyno dėžutę → atlik **testinę užklausą**.
4. **Suteik GBP prieigą** + perduok atsiliepimų nuorodą/QR.
5. **Trumpas skambutis:** kaip atsakyti į užklausą (Reply → klientui) ir keisti kainas.

---

# Mėnesio profilaktika (Lukui)
- **Serveris:** `sudo apt update && sudo apt upgrade -y`; `docker image prune -f`;
  `df -h`; `docker compose ps` + `logs --tail=100`.
- **Backupai:** savaitinis Sanity eksportas + Hetzner snapshot'ai. Pvz. cron
  (`crontab -e`, sekmadieniais 03:00; reikia `npx sanity login` arba
  `SANITY_AUTH_TOKEN` su Viewer teisėmis):
  ```
  0 3 * * 0  cd /opt/valdopalapines && npx sanity dataset export production /opt/backups/sanity-$(date +\%F).tar.gz
  ```
  Kartą per mėn. patikrink, kad failai atsiranda (`ls -la /opt/backups`).
- **Uptime:** UptimeRobot pinga `/`.
- **Priklausomybės:** Dependabot (`.github/dependabot.yml`) kas savaitę atidaro PR.
  Peržiūrėk ir sujunk; saugumo PR (ypač `next`) — nedelsiant. CI žingsnis
  `npm audit` rodo žinomas spragas.
- **Rollback:** jei po deploy kažkas sulūžo — serveryje
  `git log --oneline -5`, `git checkout <geras-commit>`, `docker compose up -d --build`
  (vėliau `git checkout main` ir sutaisyk).
- **Analitika / Ads:** žr. `MARKETING.md`.

---

*Techninius klausimus tvarko Lukas. Turinį — kaimynas per Sanity Studio
(žr. `KAIMYNO-VALDYMO-GIDAS.md`).*
