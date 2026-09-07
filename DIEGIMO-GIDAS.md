# Valdopalapines.lt — Diegimo ir administravimo gidas

Žingsnis po žingsnio: nuo kodo iki veikiančios svetainės su HTTPS, CMS ir el.
paštu. Skirta tau (Lukui) kaip administratoriui. Kaimyno (turinio redaktoriaus)
instrukcija — atskirame faile `KAIMYNUI-turinio-valdymas.md`.

---

## 1. Hostingo strategija — kur diegti?

### Svarbus pataisymas prieš pradedant
Tavo prompte minimas **Vercel nemokamas (Hobby) planas komerciniam verslui
NEGALIOJA.** Vercel „Hobby" pagal taisykles skirtas tik asmeniniam,
nekomerciniam naudojimui, ir jie tai realiai kontroliuoja. Verslo svetainė,
kuri neša pajamas, privalo būti ant **Pro plano (20 USD/mėn.)**. Tad realūs
variantai tokie:

| | **A: Vercel Pro + Sanity Cloud** | **B: Hetzner VPS (self-host) + Sanity Cloud** |
|---|---|---|
| Kaina | ~20 USD/mėn. (Vercel Pro) + Sanity 0 € | ~0 € papildomai (VPS jau turi) + Sanity 0 € |
| Priežiūra | Beveik nulinė — Vercel tvarko serverį, SSL, mastelį | Tavo: OS atnaujinimai, Docker, backupai, monitoringas |
| Sparta | Puiki (globalus edge tinklas) | Labai gera (1 regionas; su Cloudflare priešais — puiki) |
| Saugumas | Vercel tvarko infrastruktūrą | Tavo atsakomybė (bet tai tavo stiprioji pusė) |
| Deploy | `git push` → automatinis redeploy | GitHub Actions → SSH → `docker compose up` |
| Mastelis daugeliui klientų | Kiekvienas projektas valgo Pro usage | 1 VPS talpina daug svetainių už tą pačią kainą |

**Sanity Cloud** abiem atvejais — nemokamas ir tinkamas: iki ~10 000 dokumentų,
2 duomenų rinkiniai, iki 20 naudotojų, dosnus srautas. Mažam nuomos verslui to
užteks su kaupu. (Šaltinis: Sanity pricing, patikrinta 2026.)

### Ką rekomenduoju TAU
**Variantą B (self-host ant Hetzner).** Priežastys:
1. Vercel nemokamai vis tiek negalima → variantas A kainuoja 20 USD/mėn.
2. Tu jau turi ir apmoki Hetzner VPS („saitis", Ubuntu 24.04), o Docker +
   reverse proxy + DNS — tavo kasdienė sritis. Web dalies sudėtingumas (Next.js
   build, Sanity) abiem atvejais vienodas; skiriasi tik infrastruktūra, kuri
   tau yra pliusas, ne minusas.
3. Tavo tikslas — daugkartinis šablonas ir daug klientų svetainių. Ant vieno
   VPS gali talpinti daug svetainių už tą pačią fiksuotą kainą; Vercel Pro
   usage augtų su kiekvienu projektu.

Kompromisas sąžiningai: su B tu perki laiką už pinigus atvirkščiai — tvarkai
uptime, atnaujinimus ir backupus pats. Jei šitas pirmas projektas turi būti
„paleisk ir pamiršk" su minimaliu triūsu — variantas A (Vercel Pro) irgi
visiškai geras. Žemiau pateikiu **abu kelius**; 2.3 skyriuje pasirink vieną.

---

## 2. Diegimas nuo A iki Ž

### 2.1. Kodas į GitHub (bendra abiem keliams)

Išskleisk `valdopalapines.zip` į aplanką ir terminale:

```bash
cd valdopalapines
git init
git add .
git commit -m "Pradinis Valdopalapines.lt karkasas"
git branch -M main
```

GitHub'e sukurk **privačią** repozitoriją `valdopalapines` (be README). Tada:

```bash
git remote add origin git@github.com:TAVO-VARDAS/valdopalapines.git
git push -u origin main
```

> Jei naudoji HTTPS vietoj SSH rakto:
> `git remote add origin https://github.com/TAVO-VARDAS/valdopalapines.git`

### 2.2. Sanity Cloud (bendra abiem keliams)

1. Registruokis: https://www.sanity.io → „Get started" (gali per GitHub).
2. Terminale projekto aplanke prisijunk ir sukurk projektą:
   ```bash
   npm install
   npx sanity login
   npx sanity init --env
   ```
   - Kai klaus — pasirink „Create new project", pavadink `Valdopalapines`,
     dataset `production` (public).
   - `--env` įrašys `NEXT_PUBLIC_SANITY_PROJECT_ID` ir `_DATASET` į `.env`.
3. Pasižymėk **Project ID** (rasi ir https://www.sanity.io/manage).
4. **Deploy Studio** (kad kaimynas turėtų valdymo skydą internete):
   ```bash
   npx sanity deploy
   ```
   Pasirink adresą, pvz. `valdopalapines` → Studio bus pasiekiamas per
   **https://valdopalapines.sanity.studio**. Nemokama, hostina Sanity.
5. **API tokenas** (reikės, kai front-endas skaitys turinį): Manage → API →
   Tokens → „Add token" → „Viewer" teisės → nusikopijuok. Įrašysi kaip
   `SANITY_API_READ_TOKEN` (nebūtinas viešiems datasetams, bet rekomenduojamas).

> ⚠️ Vienas likęs dev žingsnis: schemos ir Studio veikia iškart, bet front-endas
> šiuo metu rodo demo turinį iš `lib/catalog-data.ts`. Kad kaimyno įkeltas
> turinys atsirastų svetainėje, reikia prijungti GROQ užklausas (`next-sanity`).
> Tai vienas atskiras darbas — pasakyk, ir paruošiu.

### 2.3a. KELIAS A — Deploy per Vercel Pro

1. https://vercel.com → prisijunk per GitHub.
2. „Add New… → Project" → pasirink `valdopalapines` repozitoriją → Import.
3. Framework: Next.js (aptinkama automatiškai). **Environment Variables** suvesk:
   ```
   NEXT_PUBLIC_SITE_URL=https://valdopalapines.lt
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   RESEND_API_KEY=re_xxxx
   QUOTE_TO_EMAIL=kaimynas@pastas.lt
   QUOTE_FROM_EMAIL=uzklausos@valdopalapines.lt
   ```
4. „Deploy". Po ~2 min gausi `xxx.vercel.app` adresą.
5. Komandų (Settings → Billing) pasikelk į **Pro** (komercinis naudojimas).
6. Domenas: Settings → Domains → pridėk `valdopalapines.lt` ir
   `www.valdopalapines.lt`. Vercel parodys, kokius DNS įrašus suvesti (žr. 2.4).
   SSL — automatinis.

### 2.3b. KELIAS B — Deploy ant Hetzner VPS (Docker + Caddy)

Prielaida: VPS su Ubuntu 24.04, prisijungi per SSH, turi `sudo`.

**1) Įsidiek Docker (jei dar nėra):**
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER      # perlogink SSH sesiją po šito
```

**2) Parsisiųsk kodą į serverį:**
```bash
cd /opt
sudo git clone https://github.com/TAVO-VARDAS/valdopalapines.git
sudo chown -R $USER:$USER valdopalapines
cd valdopalapines
```

**3) Sukurk `.env.production`** (iš pavyzdžio) ir suvesk realias reikšmes:
```bash
cp .env.production.example .env.production
nano .env.production
```

**4) Patikrink `Caddyfile`** — kad domenas teisingas (jau įrašyta
`valdopalapines.lt`). Caddy pats gaus Let's Encrypt SSL, kai domenas rodys į
serverį.

**5) Paleisk:**
```bash
docker compose up -d --build
docker compose logs -f web        # stebėti startą; Ctrl+C išeiti
```
Svetainė kils ant serverio; Caddy klausysis 80/443 ir tvarkys HTTPS.

**6) Ugniasienė** (jei naudoji ufw):
```bash
sudo ufw allow 80
sudo ufw allow 443
```

### 2.4. Domenas ir DNS + SSL

Domeno registro valdyme (arba, rekomenduoju, perkėlus DNS į **Cloudflare** —
nemokama, greita, DDoS apsauga) suvesk:

**Kelias A (Vercel):** įrašus parodys pati Vercel, tipiškai:
```
A     @      76.76.21.21              (Vercel IP, ką rodo dashboard)
CNAME www    cname.vercel-dns.com.
```

**Kelias B (Hetzner):** nukreipk į savo serverio IP:
```
A     @      <TAVO_VPS_IP>
A     www    <TAVO_VPS_IP>
```
(Jei per Cloudflare — proxy „oranžinį debesėlį" gali palikti įjungtą; SSL režimą
nustatyk „Full (strict)". Caddy vis tiek gaus savo sertifikatą.)

**SSL:** abiem atvejais nemokamas ir automatinis (Vercel arba Caddy/Let's
Encrypt). Nieko rankiniu būdu daryti nereikia — tik palauk DNS propagacijos
(nuo kelių min. iki kelių val.).

Patikra:
```bash
dig +short valdopalapines.lt
curl -I https://valdopalapines.lt
```

---

## 3. El. pašto sujungimas (formos užklausos → Resend)

Kodas jau paruoštas (`lib/email.ts`, `app/api/quote/route.ts`) — belieka
sukonfigūruoti Resend.

1. Registruokis: https://resend.com (nemokamai — 3 000 laiškų/mėn., 100/d.,
   iki 3 domenų; mažam verslui su kaupu).
2. **Verifikuok domeną:** Domains → „Add domain" → `valdopalapines.lt`. Resend
   duos kelis DNS įrašus (SPF `TXT`, DKIM `CNAME`, dažnai DMARC `TXT`). Suvesk
   juos ten pat, kur ir domeno DNS. Palauk, kol „Verified".
   > Be verifikacijos laiškai keliaus į spam arba nebus siunčiami.
3. **API raktas:** API Keys → „Create" → nusikopijuok (`re_...`).
4. Įdiek biblioteką ir įrašyk ENV:
   ```bash
   npm install resend
   ```
   ENV (Vercel → Settings → Environment Variables; Hetzner → `.env.production`):
   ```
   RESEND_API_KEY=re_xxxx
   QUOTE_TO_EMAIL=kaimynas@pastas.lt
   QUOTE_FROM_EMAIL=uzklausos@valdopalapines.lt   # domenas turi būti verifikuotas
   ```
5. Redeploy (Vercel — automatiškai po push; Hetzner — `docker compose up -d
   --build`). Užpildyk testinę užklausą — laiškas turi ateiti kaimynui gražiu
   HTML formatu. „Reply" laiške eina tiesiai klientui (`replyTo`).

> Nori vietoj Resend siųsti per esamą pašto dėžutę (SMTP)? `lib/email.ts` dugne
> yra paruoštas Nodemailer variantas — atkomentuok ir suvesk `SMTP_*` kintamuosius.

**Anti-spam (rekomenduojama):** forma jau turi vietą honeypot laukui. Papildomai
verta Cloudflare Turnstile arba rate-limit (Upstash) — galiu pridėti.

---

## 4. Turinio valdymas — kaimynui

Kaip veikia: turinys (nuotraukos, straipsniai, kainos) laikomas Sanity, o
svetainė jį atvaizduoja. Kaimynas turi vieną adresą —
**https://valdopalapines.sanity.studio** — kur prisijungęs viską redaguoja
paprastoje sąsajoje, be jokio kodo.

Kaimynui skirta paprasta, netechninė instrukcija — atskirame faile
**`KAIMYNUI-turinio-valdymas.md`**. Tavo darbas vienkartinis: Sanity Manage →
Members → „Invite" → įvesk kaimyno el. paštą (rolė „Editor"/„Viewer" pagal
poreikį).

---

## 5. Administravimas ir atnaujinimai

### Kodo atnaujinimai ateityje
**Kelias A (Vercel):** paprasčiausia — bet koks `git push` į `main`
automatiškai perbudavoja ir paskelbia. Nieko daugiau.
```bash
git add . && git commit -m "Pakeitimas" && git push
```

**Kelias B (Hetzner):** du būdai —
- *Rankinis:*
  ```bash
  cd /opt/valdopalapines
  git pull
  docker compose up -d --build
  ```
- *Automatinis (GitHub Actions → SSH):* pridedi `.github/workflows/deploy.yml`,
  kuris po push'o per SSH įvykdo tuos pačius `git pull` + `docker compose`.
  Reikia GitHub Secrets: `SSH_HOST`, `SSH_USER`, `SSH_KEY`. Galiu paruošti šį
  failą — pasakyk.

### Atsarginės kopijos (backups)
- **Sanity turinys** (svarbiausia — čia visos nuotraukos ir tekstai):
  ```bash
  npx sanity dataset export production backup-$(date +%F).tar.gz
  ```
  Įdėk į cron (pvz. kartą per savaitę) ir kopijuok į išorinę saugyklą
  (Hetzner Storage Box, S3, ar tavo esamą backup schemą).
- **Kodas** — jau saugus GitHub'e.
- **VPS (kelias B)** — įjunk Hetzner Cloud automatinius snapshot'us (Server →
  Backups) — visos svetainės viena kopija.

### Stebėjimas (uptime / klaidos)
- **Uptime:** UptimeRobot arba Better Stack (nemokami) — pinga
  `https://valdopalapines.lt` kas 1–5 min. ir praneša el. paštu/SMS, jei nukrenta.
- **Klaidos (errors):**
  - Kelias A: Vercel → Deployments → Logs (runtime logai) + gali prijungti Sentry.
  - Kelias B: `docker compose logs -f web`; ilgiau — Sentry arba tavo esamas
    Grafana/Loki, jei nori centralizuoti.
- **Health check:** `GET /` grąžina 200; UptimeRobot to pakanka.

---

## Greita santrauka (checklist)

- [ ] Kodas GitHub'e (2.1)
- [ ] Sanity projektas + `npx sanity deploy` (2.2)
- [ ] Deploy: Vercel Pro **arba** Hetzner Docker (2.3)
- [ ] DNS + HTTPS veikia (2.4)
- [ ] Resend domenas verifikuotas, testinė užklausa ateina (3)
- [ ] Kaimynas pakviestas į Sanity (4)
- [ ] Backup cron + UptimeRobot (5)
- [ ] (Dev) Front-endas prijungtas prie Sanity GROQ — likęs žingsnis
