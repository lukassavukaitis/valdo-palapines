# Valdopalapines.lt — diegimo ir paleidimo gidas (nuo nulio)

Šis gidas skirtas žmogui, kuris **niekada nedirbo su web programavimu** ir pirmą kartą atidaro šį projektą.
Nieko nepaisoma „iš anksto žinoma": kiekvienas terminas paaiškintas, kiekvienas žingsnis surašytas.

Kiti failai:
- `KAIMYNO-VALDYMO-GIDAS.md` — turinio valdymas kaimynui (netechninis);
- `MARKETING.md` — Google/Meta reklama, GA4, SEO (nebūtina diegimui).

---

## 0. Prieš pradedant

### 0.1. Ką darome ir kiek tai užtrunka
Turime svetainę `valdopalapines.lt`. Jos dalys:

```
Kaimynas ──(redaguoja turinį)──▶ Sanity Studio ──▶ Sanity (duomenų saugykla)
                                                         │ skaito
Lankytojas ──▶ valdopalapines.lt ──▶ Hetzner serveris (Caddy + svetainės kodas Docker'yje)
                    │ užklausos forma
                    └──▶ Resend ──▶ el. laiškas kaimynui
```

Pirmą kartą visa eiga užtrunka **~3–4 val.** (dalį laiko tiesiog laukiama, kol pasklis DNS ir patvirtins domeną).
Eik **iš eilės**, etapų nešokinėk. Kiekvieno etapo gale yra **„✅ Patikra"** — nesek toliau, kol ji neveikia.

### 0.2. Ką reikės turėti
| Kas | Kodėl | Kaina |
|---|---|---|
| Domenas `valdopalapines.lt` ir prieiga prie jo **DNS valdymo** | kad svetainė turėtų adresą ir veiktų el. paštas | jau turima |
| Banko kortelė | Hetzner serveriui apmokėti (kitos paskyros nemokamos) | serveris ~4–8 €/mėn. |
| Windows kompiuteris su teisėmis diegti programas | darbui | — |
| Slaptažodžių tvarkyklė (Bitwarden, 1Password ar bent užrašų failas) | čia atsiras daug slaptų reikšmių | nemokama |

### 0.3. Minimalus kelias
**Būtina paleidimui:** GitHub, Sanity, Resend, Hetzner serveris, domenas.
**Neprivaloma (praleisk, jei neaišku):** Cloudflare Turnstile, Google Analytics, Meta Pixel — jie aprašyti **7 etape**
ir svetainė puikiai veikia be jų.

### 0.4. Žodynėlis (perskaityk vieną kartą)
| Terminas | Paprastai tariant |
|---|---|
| **Terminalas / PowerShell** | juodas langas, kuriame rašomos komandos. Windows: *Start* → rašyk `PowerShell` → Enter. |
| **Komanda** | eilutė, kurią įrašai terminale ir paspaudi Enter. Šiame gide jos rodomos `tokiuose` blokuose. |
| **Git** | programa, kuri saugo kodo istoriją ir leidžia jį siųsti į internetą. |
| **GitHub** | svetainė, kurioje saugomas projekto kodas (kaip „Dropbox" kodui). |
| **Repozitorija („repo")** | vienas projekto kodo aplankas GitHub'e. |
| **Node.js / npm** | programos, kuriomis paleidžiamas svetainės kodas. `npm` atsisiunčia reikalingas bibliotekas. |
| **Sanity** | CMS = „turinio valdymo sistema". Čia saugomi palapinių aprašymai, nuotraukos, kainos. |
| **Sanity Studio** | Sanity svetainė-skydelis, kuriame kaimynas redaguoja turinį. |
| **Dataset** | Sanity „duomenų bazės" pavadinimas. Mes naudojame `production`. |
| **Project ID** | trumpas Sanity projekto identifikatorius (pvz. `a1b2c3d4`). Nėra slaptas. |
| **Token (tokenas)** | ilgas „slaptažodis programai". Duoda programai teisę rašyti/skaityti. **Slaptas!** |
| **Seed** | vienkartinis „pradinio turinio įkėlimas" (4 palapinės, baldai ir t. t.). |
| **Resend** | paslauga, kuri išsiunčia el. laišką, kai lankytojas užpildo užklausos formą. |
| **Aplinkos kintamasis** | nustatymas „vardas=reikšmė" (pvz. `RESEND_API_KEY=re_abc`). Saugomi faile `.env`. |
| **`.env` failas** | tekstinis failas su visais nustatymais ir slaptomis reikšmėmis. **Niekada nekeliamas į GitHub.** |
| **Hetzner VPS** | nuomojamas kompiuteris internete („serveris"), kuriame veiks svetainė. |
| **SSH** | saugus būdas prisijungti prie serverio per terminalą. Naudoja **rakto porą**: *viešą* (galima rodyti) ir *privatų* (niekam nerodyti). |
| **Docker** | programa, kuri svetainę paleidžia uždarame „konteineryje" — nereikia rankiniu būdu diegti Node serveryje. |
| **Caddy** | programa serveryje, kuri priima lankytojus ir pati gauna nemokamą HTTPS (spynelę). |
| **DNS** | domeno „telefonų knyga": pasako, kad `valdopalapines.lt` = tam tikras serverio IP. |
| **Webhook** | Sanity „paskambina" svetainei, kai kaimynas paskelbia pakeitimą, kad jis matytųsi iškart. |
| **CI/CD (GitHub Actions)** | automatika: kai nusiunti kodą į GitHub, jis pats patikrinamas ir įdiegiamas į serverį. |

### 0.5. Kaip skaityti komandų blokus
Prie kiekvieno bloko nurodyta, **kur** jį vykdyti:
- 💻 **PC** — Tavo Windows kompiuteryje, PowerShell lange;
- 🖥️ **Serveris** — prisijungus prie Hetzner serverio per SSH (žr. 4 etapą);
- 🌐 **Naršyklė** — spaudinėji svetainėse.

Tekstą `<TAVO-REIKŠMĖ>` reikia pakeisti savo reikšme (kampinių skliaustų nepalik).
Komandas galima kopijuoti; PowerShell lange įklijuoti galima dešiniu pelės klavišu.

### 0.6. „Užrašų lapas"
Gide rinksi reikšmes, kurios reikės vėliau. Susikurk slaptą failą/įrašą su tokiu sąrašu ir pildyk einant:

| Reikšmė | Iš kur gauni | Ar slapta |
|---|---|---|
| Sanity Project ID | 2.2 | ne |
| Sanity Editor tokenas (seed) | 2.2 | **taip** |
| Resend API raktas | 2.3 | **taip** |
| Kaimyno el. paštas (`QUOTE_TO_EMAIL`) | paklausi kaimyno | ne |
| Revalidate secret | 4.5 | **taip** |
| Serverio IP | 4.1 | ne |

---

## 1. Kompiuterio paruošimas

### 1.1. Įdiek programas (🌐 + 💻)
1. **Git for Windows** — https://git-scm.com/download/win → paleisk diegimo programą, visur spausk *Next* (numatytieji nustatymai tinka).
2. **Node.js 22** — https://nodejs.org → *Download* → pasirink **v22.x (LTS)**. Jei pagrindinis mygtukas rodo kitą versiją, spausk *Previous releases* ir rask 22.x. Diegimo metu viską palik numatyta.
3. (Rekomenduojama) **Visual Studio Code** — https://code.visualstudio.com — patogus failų redagavimui.
4. **Užsidaryk ir iš naujo atidaryk PowerShell**, tada patikrink:
```powershell
git --version
node -v
npm -v
```
✅ **Patikra:** `git` rodo versiją, `node -v` rodo `v22.…`, `npm -v` rodo skaičių.

> ⚠️ **Jei `npm`/`npx` rašo „running scripts is disabled on this system"** — vieną kartą paleisk:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` ir patvirtink `Y`.

### 1.2. Pasiimk projekto kodą (💻 PC)
Repozitorija GitHub'e jau sukurta: `https://github.com/lukassavukaitis/valdo-palapines`.

> 💡 **Nesaugok projekto OneDrive aplanke** — OneDrive sinchronizuoja tūkstančius `node_modules` failų ir viską lėtina.
> Naudok pvz. `C:\dev`.

```powershell
mkdir C:\dev
cd C:\dev
git clone https://github.com/lukassavukaitis/valdo-palapines.git
cd valdo-palapines
```
(Pirmą kartą atsidarys naršyklės langas prisijungti prie GitHub — prisijunk.)

> Jei repozitorija **privati** ir `git clone` rašo „not found" — tau trūksta prieigos; prisijunk tuo GitHub paskyra, kuri yra repo savininkė.

✅ **Patikra:** `dir` (arba `ls`) parodo `package.json`, `Dockerfile`, `app` ir kt.

### 1.3. Įdiek bibliotekas (💻 PC)
```powershell
npm ci
```
Užtrunka 1–3 min. Gali parašyti „warnings" ar „vulnerabilities" — tai normalu, ignoruok.
✅ **Patikra:** komanda baigiasi be raudono `npm error`, atsirado aplankas `node_modules`.

### 1.4. Susikurk `.env` failą (💻 PC)
```powershell
Copy-Item .env.example .env
```
Failas `.env` dabar yra, bet su pavyzdinėmis reikšmėmis. Atidaryk jį (`code .env` arba Notepad).
**Taisyklės redaguojant `.env`:**
- Formatas: `VARDAS=reikšmė` — **be tarpų aplink `=`**, be kabučių.
- Eilutė, prasidedanti `#`, yra **išjungta**. Norint įjungti — ištrink `#` ir įrašyk tikrą reikšmę.
- Tekstas po ` #` eilutės gale yra komentaras — ignoruojamas.
- **Niekada** nepalik pavyzdinių reikšmių nebūtinuose laukuose (`0x4AAA…`, `G-XXXX…`, `sk...`) — svetainė bandys jas naudoti ir sulūš. Todėl jie ir yra užkomentuoti.

Reikšmes čia surašysi per kitą etapą.

---

## 2. Paskyros išorinėse paslaugose

### 2.1. GitHub
Jau naudoji (repo sukurta). Tik įsitikink, kad GitHub **repo → Settings → General → apačioje „Danger Zone"** rodo, jog repo **Private** (privati). Jei Public — pakeisk į Private (*Change visibility*). Kodas nėra slaptas, bet privati saugiau.

### 2.2. Sanity (turinio sistema)
**A. Paskyra ir projektas (🌐)**
1. Eik į https://www.sanity.io → **Get started / Log in** → prisijunk per Google ar GitHub.
2. Atsidarys https://www.sanity.io/manage ( „Manage" skydelis). Spausk **Create new project**.
3. Pavadinimas: `Valdopalapines`. Jei klausia šablono (template) ar „Start from..." — rinkis **tuščią / „Skip"**; nieko nediegk. Jei klausia plano — **Free**.
4. Kai projektas sukurtas, jo puslapyje viršuje matysi **Project ID** (trumpas tekstas, pvz. `a1b2c3d4`). **Nukopijuok į užrašų lapą.**
5. Kairėje/viršuje atsidaryk skiltį **Datasets** (arba *API → Datasets*). Turi būti dataset **`production`** su matomumu **Public**. Jei jo nėra — **Add dataset** → pavadinimas `production` → *Public*.

> Meniu pavadinimai Sanity svetainėje kartais keičiasi; ieškok panašių žodžių.

**B. Įrašyk ID į `.env` (💻 PC)**
Atidaryk `.env` ir pakeisk **abi** eilutes tuo pačiu Project ID:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=a1b2c3d4
SANITY_STUDIO_PROJECT_ID=a1b2c3d4
```
(Pirmą naudoja svetainė, antrą — Studio. Reikšmė ta pati.)

**C. Tokenas pradiniam turiniui (🌐)**
1. https://www.sanity.io/manage → tavo projektas → **API** → **Tokens** → **Add API token**.
2. Name: `seed-lokalus`; Permissions: **Editor** → *Save*.
3. **Tokenas parodomas tik vieną kartą** — nukopijuok iškart į užrašų lapą.
4. `.env` faile **ištrink `#`** prieš eilutę `SANITY_API_WRITE_TOKEN=` ir įklijuok tokeną.

**D. Prisijunk prie Sanity iš terminalo (💻 PC)**
```powershell
npx sanity login
```
Pasirink prisijungimo būdą (Google/GitHub), naršyklėje patvirtink.

**E. Paskelbk Studio kaimynui (💻 PC)**
```powershell
npx sanity deploy
```
Paklaus **Studio hostname** → įrašyk `valdopalapines` (gausi `https://valdopalapines.sanity.studio`, šis adresas minimas `KAIMYNO-VALDYMO-GIDAS.md`). Jei vardas užimtas — pasirink kitą ir atnaujink kaimyno gidą.
✅ **Patikra:** atidaryk `https://valdopalapines.sanity.studio`, prisijunk — turi atsidaryti tuščias skydelis su meniu (Paslaugos, Straipsniai, Galerija…).

### 2.3. Resend (el. laiškai iš užklausų formos)
Kai lankytojas pateikia formą, svetainė per Resend išsiunčia laišką kaimynui. Resend leidžia siųsti tik iš **tavo patvirtinto domeno**, todėl reikia keleto DNS įrašų.

**A. Paskyra (🌐)**
1. https://resend.com → **Sign up** (nemokamas planas: 3 000 laiškų/mėn.).

**B. Pridėk ir patvirtink domeną (🌐)**
1. Resend: **Domains → Add Domain** → įrašyk `valdopalapines.lt` → *Add*.
2. Resend parodys **lentelę su DNS įrašais** (paprastai 3–4): *Type* (MX / TXT / CNAME), *Name* (pvz. `send`, `resend._domainkey`), *Content/Value*, kartais *Priority*.
3. Atidaryk **savo domeno DNS valdymą**. Tai ten, kur pirkai domeną (registratorius: pvz. Hostinger, Zone.eu, Interneto vizija, GoDaddy…) – ieškok skilties „**DNS**", „**DNS zone**" ar „**DNS įrašai**". Jei domeno DNS valdomas Cloudflare – ten.
4. Kiekvienam Resend eilutės įrašui spausk *Add record* ir nukopijuok **tiksliai**: tipą, vardą, reikšmę.
   - Lauke **Name/Host**: jei registratorius pats prideda `.valdopalapines.lt` gale — rašyk tik pirmąją dalį (pvz. `send`). Jei reikalauja pilno vardo – rašyk visą (`send.valdopalapines.lt`). Nežinai — pabandyk su trumpuoju; po išsaugojimo įrašas sąraše turi atrodyti kaip Resend lentelėje.
   - **Nieko nešalink iš esamų įrašų** (ypač seno `MX`, jei domene jau veikia el. paštas). Resend įrašai naudoja `send` pošaknį, jie nekonfliktuoja.
   - TXT reikšmes kopijuok **be papildomų kabučių ir tarpų**.
5. Grįžk į Resend → *Verify DNS Records*. Statusas pasikeičia į **Verified** per 5 min – kelias valandas. Gali eiti prie kitų etapų ir grįžti.

**C. API raktas (🌐)**
1. Resend: **API Keys → Create API Key**. Name: `valdopalapines-svetaine`; Permission: **Sending access**; Domain: `valdopalapines.lt`.
2. Nukopijuok raktą (prasideda `re_`) — **rodomas tik vieną kartą**. Į užrašų lapą.

**D. Užpildyk `.env` (💻 PC)**
```
RESEND_API_KEY=re_...
QUOTE_TO_EMAIL=kaimynas@pastas.lt
QUOTE_FROM_EMAIL=uzklausos@valdopalapines.lt
```

**Ką reiškia šie du adresai:**
- **`QUOTE_TO_EMAIL`** — kam atsiunčiamas laiškas: **kaimyno** tikra pašto dėžutė.
- **`QUOTE_FROM_EMAIL`** — nuo **kieno vardo** laiškas „atrodo" išsiųstas. Tokios pašto dėžutės **nereikia kurti** – tai tik siuntėjo etiketė. Svarbu viena taisyklė: dalis po `@` **privalo būti domenas, kurį patvirtinai Resend** (`valdopalapines.lt`). Jei įrašysi `…@gmail.com` ar kitą nepatvirtintą domeną – Resend laišką atmes ir užklausos nepasieks kaimyno. Priešdėlį prieš `@` gali rinktis laisvai (`uzklausos`, `info`, `noreply`).
- Kai kaimynas paspaudžia **Reply** – atsakymas eina tiesiai **klientui** (ne į `QUOTE_FROM_EMAIL`).

> 🧪 Kol domenas dar nepatvirtintas ir nori išbandyti: laikinai `QUOTE_FROM_EMAIL=onboarding@resend.dev` ir `QUOTE_TO_EMAIL=` **tas el. paštas, kuriuo registravaisi Resend**. Kitokiu adresu Resend nesiųs. Prieš paleidimą grąžink tikrąsias reikšmes.

✅ **Patikra:** po kelių valandų Resend → Domains rodo `valdopalapines.lt` su statusu **Verified**.

---

## 3. Svetainė savo kompiuteryje + pradinis turinys

### 3.1. Įkelk pradinį turinį (seed) (💻 PC)
Įsitikink, kad `.env` jau turi `NEXT_PUBLIC_SANITY_PROJECT_ID` ir `SANITY_API_WRITE_TOKEN` (be `#`).
```powershell
npm run seed
```
Įkelia: Dvišlaitė, Pagoda, Flex, Karūna palapines + banketo stalus/kėdes + apšvietimą + tekstilę + svetainės kontaktus.
Saugu paleisti kelis kartus (dublikatų nesukuria). **Nuotraukas** vėliau prideda kaimynas per Studio.
✅ **Patikra:** terminale nėra `❌`; `https://valdopalapines.sanity.studio` (perkrauk F5) rodo įrašus skiltyje „Paslaugos".

### 3.2. Paleisk svetainę lokaliai (💻 PC)
```powershell
npm run dev
```
Palik langą atvirą. Naršyklėje atidaryk http://localhost:3000.
✅ **Patikra:** svetainė atsidaro, katalogas rodo palapines. (Sustabdyti: terminale `Ctrl+C`.)

Jei matai klaidą apie `NEXT_PUBLIC_SANITY_PROJECT_ID` – patikrink `.env` (nėra tarpų, ID teisingas) ir paleisk `npm run dev` iš naujo.

### 3.3. Išbandyk užklausos formą (💻 PC)
Naršyklėje http://localhost:3000/#uzklausa → užpildyk ir išsiųsk.
✅ **Patikra:** laiškas atėjo į `QUOTE_TO_EMAIL` dėžutę (patikrink ir Šlamštą/Spam). Neatėjo? Žr. **B priedą**.

### 3.4. (Pasirinktinai) kodo patikros kaip GitHub'e
```powershell
npm run lint
npm run typecheck
npm run build
```
Visos trys turi baigtis be klaidų – tas pats vyks GitHub Actions prieš kiekvieną diegimą.

---

## 4. Hetzner serveris

### 4.1. Sukurk serverį
**A. SSH raktas savo kompiuteryje (💻 PC)** — jei dar neturi:
```powershell
ssh-keygen -t ed25519
```
Spausk Enter (3 kartus: numatytas failas, be slaptafrazės arba su ja – kaip nori).
Parodyk **viešą** raktą (jį galima kopijuoti; failas su `.pub`):
```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```
Nukopijuok visą eilutę (`ssh-ed25519 AAAA… vartotojas@kompiuteris`). **Privataus** rakto (`id_ed25519` be `.pub`) niekur nesiųsk.

**B. Serveris (🌐)**
1. https://console.hetzner.cloud → susikurk paskyrą (reikia kortelės) → **New project** → `valdopalapines`.
2. **Add Server**:
   - Location: bet kuri ES (Falkenstein / Nuremberg / Helsinki);
   - Image: **Ubuntu 24.04**;
   - Type: *Shared vCPU* x86 (pigiausias pasiūlymas), bet **mažiausiai 2 GB RAM** (mažiau – svetainės kūrimas „Docker build" nesibaigs);
   - Networking: palik IPv4 (+IPv6);
   - **SSH keys → Add SSH key** → įklijuok viešą raktą iš žingsnio A, pavadink `mano-pc`;
   - (Rekomenduojama) įjunk **Backups** (+20 % kainos – savaitinės serverio kopijos);
   - Name: `valdopalapines` → **Create & Buy now**.
3. Serverio sąraše matysi **IPv4 adresą** (pvz. `203.0.113.10`). Į užrašų lapą.

### 4.2. Pirmas prisijungimas ir bazinis paruošimas
**Prisijunk (💻 PC):**
```powershell
ssh root@<SERVERIO-IP>
```
Į klausimą „Are you sure you want to continue connecting" atsakyk `yes`. Terminalo eilutė turi pasikeisti į `root@…:~#` — dabar komandos vykdomos serveryje.

**Vykdyk (🖥️ Serveris, kaip root)** – po vieną bloką:

*Sistemos atnaujinimas:*
```bash
apt update && apt upgrade -y
```
*Darbinis naudotojas `deploy` (su juo dirbsime ir jį naudos GitHub automatika):*
```bash
adduser --disabled-password --gecos "" deploy
usermod -aG sudo deploy
echo "deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```
(Paskutinė komanda nukopijuoja tavo SSH raktą naudotojui `deploy`.)

*Ugniasienė (atveria tik SSH, HTTP, HTTPS):*
```bash
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable
```
*Docker:*
```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy
```
Caddy atskirai diegti **nereikia** – jis pakyla Docker konteineriu.

*Atsijunk:*
```bash
exit
```

### 4.3. Prisijunk kaip `deploy`
```powershell
ssh deploy@<SERVERIO-IP>
```
✅ **Patikra (🖥️ Serveris):**
```bash
docker --version
docker ps
```
Abi turi veikti **be** žodžio `sudo` ir be „permission denied".

### 4.4. Parsisiųsk kodą į serverį (🖥️ Serveris, kaip `deploy`)
Repozitorija privati, todėl serveris turi turėti savo „raktą" tik skaitymui (**Deploy key**).

1. Sugeneruok raktą ir parodyk viešąją dalį:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/valdopalapines_deploy -N ""
cat ~/.ssh/valdopalapines_deploy.pub
```
2. Nukopijuok išvestį (🌐): GitHub → repo → **Settings → Deploy keys → Add deploy key** → Title `hetzner`, Key – įklijuok, **„Allow write access" NEPAŽYMĖK** → *Add key*.
3. Serveryje:
```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
printf 'Host github.com\n  IdentityFile ~/.ssh/valdopalapines_deploy\n  IdentitiesOnly yes\n' >> ~/.ssh/config
chmod 600 ~/.ssh/config
sudo mkdir -p /opt/valdopalapines && sudo chown deploy:deploy /opt/valdopalapines
git clone git@github.com:lukassavukaitis/valdo-palapines.git /opt/valdopalapines
cd /opt/valdopalapines
```
Aplankas turi būti **tiksliai** `/opt/valdopalapines` – GitHub automatika naudoja būtent jį.
✅ **Patikra:** `ls` rodo `Dockerfile`, `docker-compose.yml`, `Caddyfile`.

### 4.5. Serverio `.env` (🖥️ Serveris)
```bash
cd /opt/valdopalapines
cp .env.example .env
nano .env
```
`nano` – paprastas redaktorius: rodyklėmis judi, rašai kaip įprasta. **Išsaugoti:** `Ctrl+O`, `Enter`. **Išeiti:** `Ctrl+X`.

Sugeneruok `SANITY_REVALIDATE_SECRET` reikšmę (atskirame lange arba prieš `nano`):
```bash
openssl rand -hex 32
```
Gautą ilgą tekstą nukopijuok į užrašų lapą (jį dar įvesi Sanity webhook'e, 6.1 žingsnyje).

**Užpildyk šias eilutes** (kitų nebūtinų – neliesk, jos išjungtos):

| Kintamasis | Ką įrašyti | Būtinas |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://valdopalapines.lt` | ✅ |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity Project ID (2.2) | ✅ |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | ✅ |
| `SANITY_REVALIDATE_SECRET` | ką tik sugeneruotas tekstas | ✅ |
| `RESEND_API_KEY` | `re_…` iš 2.3 | ✅ |
| `QUOTE_TO_EMAIL` | kaimyno el. paštas | ✅ |
| `QUOTE_FROM_EMAIL` | `uzklausos@valdopalapines.lt` | ✅ |

**Serveryje NEREIKIA:** `SANITY_API_WRITE_TOKEN`, `SANITY_STUDIO_*` (jie tik tavo kompiuteriui). Jei jų neištrynei iš `.env.example` kopijos – ištrink šias 3 eilutes iš serverio `.env`.

Apsaugok failą:
```bash
chmod 600 .env
```
✅ **Patikra:** `grep -v '^#' .env | grep -v '^$'` išveda tik tavo užpildytas eilutes, be `xxxxxxxx` ir `kaimynas@pastas.lt` pavyzdžių.

---

## 5. Paleidimas ir DNS

### 5.1. Nukreipk domeną į serverį (🌐 DNS valdymas)
Savo domeno DNS valdyme pridėk du **A** įrašus (jei jau yra seni `A` ar `AAAA` įrašai `@` / `www` — ištrink arba pakeisk):

| Tipas | Vardas (Name/Host) | Reikšmė | TTL |
|---|---|---|---|
| A | `@` (kai kur palieka tuščią arba `valdopalapines.lt`) | `<SERVERIO-IP>` | automatinis / 300 |
| A | `www` | `<SERVERIO-IP>` | automatinis / 300 |

Patikra (💻 PC), pasklidimas gali užtrukti nuo kelių minučių iki kelių valandų:
```powershell
nslookup valdopalapines.lt
```
Turi parodyti tavo serverio IP.

### 5.2. Paleisk svetainę (🖥️ Serveris)
```bash
cd /opt/valdopalapines
docker compose up -d --build
```
Pirmas kartas užtrunka **3–10 min** (siunčia ir kuria vaizdą). Eigą žiūrėk:
```bash
docker compose logs -f web      # išeiti: Ctrl+C
docker compose ps
```
✅ **Patikra:** `docker compose ps` rodo du konteinerius (`web`, `caddy`), `web` būsena `Up … (healthy)` (gali užtrukti iki ~1 min).

### 5.3. HTTPS ir galutinė patikra
Kai tik `nslookup` rodo teisingą IP, Caddy per ~minutę **pats** gauna nemokamą Let's Encrypt sertifikatą (nieko daryti nereikia).
```bash
docker compose logs caddy | tail -20     # ieškok žodžių "certificate obtained successfully"
```
✅ **Patikra (💻 PC):** naršyklėje atidaryk https://valdopalapines.lt — svetainė su spynele ir tuo pačiu turiniu, kaip lokaliai. `https://www.valdopalapines.lt` turi nukreipti į be-www versiją.
Taip pat išbandyk **užklausos formą** gyvoje svetainėje – laiškas turi ateiti kaimynui.

---

## 6. Automatinis diegimas (GitHub Actions) ir Sanity webhook

### 6.1. Sanity webhook (kad pakeitimai matytųsi iškart)
Kai kaimynas paskelbia pakeitimą, Sanity „paskambina" svetainei. **Be šio žingsnio** svetainė vis tiek atsinaujina per ~1 min – tad jis neprivalomas, bet patogus.

🌐 https://www.sanity.io/manage → tavo projektas → **API** → **Webhooks** → **Create webhook**. Laukus užpildyk **tiksliai**:

| Laukas | Reikšmė |
|---|---|
| Name | `Svetainės atnaujinimas` |
| Description | (palik tuščią) |
| URL | `https://valdopalapines.lt/api/revalidate` |
| Dataset | `production` |
| Trigger on | pažymėk **Create**, **Update**, **Delete** |
| Filter | `_type in ["service","post","galleryImage","testimonial","siteSettings"]` |
| Projection | `{ "_type": _type }` ← **būtina**, kitaip svetainė atsako 400 |
| Status | Enabled |
| HTTP method | POST |
| HTTP headers | (nieko nepridėk) |
| API version | numatytoji |
| Drafts / „Include drafts" / „Include all versions" | **nepažymėta** |
| Secret | **ta pati** reikšmė kaip `SANITY_REVALIDATE_SECRET` serverio `.env` |

Spausk **Save**.
✅ **Patikra:** Studio'e pakeisk bet kurio įrašo tekstą → *Publish* → svetainėje po keliolikos sekundžių pakeitimas matomas. Sanity webhook'o puslapyje skiltyje *Attempts/Log* turi būti atsakymas **200**. (401 = skiriasi secret; 400 = neteisingas Projection.)

### 6.2. GitHub Actions: SSH raktas automatikai
GitHub automatika prisijungs prie serverio per SSH kaip `deploy`. Jai reikia **atskiros rakto poros**.

**🖥️ Serveris (kaip `deploy`):**
```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_actions -N ""
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_actions
```
Paskutinė komanda išveda **privatų** raktą (prasideda `-----BEGIN OPENSSH PRIVATE KEY-----` ir baigiasi `-----END …-----`). Nukopijuok **viską, įskaitant šias eilutes**.

### 6.3. Įrašyk GitHub „Secrets" (🌐)
GitHub → repo → **Settings → Secrets and variables → Actions → New repository secret**. Sukurk 5 po vieną:

| Name | Secret (reikšmė) |
|---|---|
| `SSH_HOST` | serverio IP |
| `SSH_USER` | `deploy` |
| `SSH_PRIVATE_KEY` | visas privatus raktas iš 6.2 |
| `SSH_PORT` | `22` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity Project ID |

Kai įrašei, **ištrink privatų raktą iš serverio** (jis jau GitHub'e): 🖥️ `rm ~/.ssh/github_actions ~/.ssh/github_actions.pub`.

### 6.4. Išbandyk (💻 PC)
> ⚠️ Nuo šiol **kiekvienas `git push` į `main` šakos automatiškai atnaujina gyvą svetainę.**
```powershell
git commit --allow-empty -m "Testinis deploy"
git push origin main
```
GitHub → repo → **Actions** → atsidaro naujas bėgimas „Deploy to Hetzner": žalios varnelės turi būti ir `quality`, ir `deploy` (~3–6 min). Žingsnis „Saugumo patikra" gali rodyti įspėjimus – kol kas tai leistina.
✅ **Patikra:** abi dalys žalios; `docker compose ps` serveryje rodo `Up` su šviežiu „created" laiku.

---

## 7. Neprivalomi priedai (galima daryti vėliau)

Visos šios reikšmės įrašomos į **serverio `.env`** (nuimant `#`), po to reikia **perbuildinti**:
```bash
cd /opt/valdopalapines && docker compose up -d --build
```
Priežastis: `NEXT_PUBLIC_*` reikšmės „įkepamos" į svetainę kuriant, ne paleidžiant. Jei kintamasis **nepradedamas** `NEXT_PUBLIC_` (pvz. `TURNSTILE_SECRET_KEY`) – užtenka `docker compose up -d --force-recreate web`.

### 7.1. Cloudflare Turnstile (apsauga nuo šlamšto formoje)
Be jo formą jau saugo paslėptas laukas ir užklausų dažnio limitas, tad tai papildoma apsauga.
1. https://dash.cloudflare.com → susikurk nemokamą paskyrą → kairėje **Turnstile** → **Add widget**.
2. Widget name: `valdopalapines`; Hostname: `valdopalapines.lt`; Widget mode: **Managed** → *Create*.
3. Gausi **Site Key** ir **Secret Key**. Į serverio `.env` (nuimant `#`):
```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<Site Key>
TURNSTILE_SECRET_KEY=<Secret Key>
```
4. Perbuildink (aukščiau). Patikra: gyvoje formoje atsiranda mažas „Success/Patvirtinkite" laukelis ir forma siunčiasi.
Reikia **abiejų** raktų; tik vieno – forma neveiks.

### 7.2. Google Analytics 4
1. https://analytics.google.com → **Admin** (krumpliaratis) → **Create → Property** → pavadinimas, laiko juosta Vilnius, valiuta EUR → *Next* … *Create*.
2. **Data streams → Add stream → Web** → URL `https://valdopalapines.lt` → Create stream.
3. Atsidariusio srauto viršuje – **Measurement ID** (`G-XXXXXXXXXX`). Įrašyk `NEXT_PUBLIC_GA_ID=G-…` ir perbuildink.

### 7.3. Meta (Facebook) Pixel ir Conversions API
1. https://business.facebook.com → **Events Manager** → **Connect data sources → Web → Meta Pixel** → pavadinimas, URL → sukurti. Gausi **Pixel ID** (skaičiai) → `NEXT_PUBLIC_META_PIXEL_ID=…`.
2. (Papildomai) Events Manager → tavo Pixel → **Settings → Conversions API → Generate access token** → `META_CAPI_TOKEN=EAA…` (šis NĖRA `NEXT_PUBLIC`, tad perbuildinti nebūtina).
3. Perbuildink. Daugiau (kampanijos, konversijos, SEO) – `MARKETING.md`.

---

## 8. Perdavimas kaimynui (5 žingsniai)
1. **Pakviesk į Sanity:** https://www.sanity.io/manage → projektas → **Members → Invite** → kaimyno el. paštas, rolė **Editor**. Kaimynas gaus el. laišką.
2. **Perduok `KAIMYNO-VALDYMO-GIDAS.md`** ir kartu pridėkite 1 palapinę su nuotrauka → *Publish* → patikrinkite, kad pasirodo svetainėje.
3. **Patikrink `QUOTE_TO_EMAIL`** (serverio `.env`) – tai kaimyno dėžutė. Jei keitei: `docker compose up -d --force-recreate web`. Atlikite **testinę užklausą** iš gyvos svetainės.
4. **Suteik Google Business Profile (GBP) prieigą** + perduok atsiliepimų nuorodą/QR.
5. **Trumpas skambutis:** kaip atsakyti į užklausą (*Reply* → klientui) ir kaip keisti kainas.

---

# A priedas — Visų kintamųjų žinynas

Kur rašyti: **PC** = tavo `.env`; **Serveris** = `/opt/valdopalapines/.env`.

| Kintamasis | Kam skirtas | Kur gauti | PC | Serveris | Būtinas |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | svetainės adresas (SEO, nuorodos) | `https://valdopalapines.lt` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | kurį Sanity projektą skaityti | 2.2 | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SANITY_DATASET` | kurią Sanity duomenų bazę skaityti | `production` | ✅ | ✅ | ✅ |
| `SANITY_REVALIDATE_SECRET` | slaptažodis, tikrinantis webhook'ą | 4.5 (`openssl rand -hex 32`) | – | ✅ | ✅ |
| `RESEND_API_KEY` | teisė siųsti laiškus | 2.3 | testui | ✅ | ✅ |
| `QUOTE_TO_EMAIL` | kam siunčiamos užklausos | kaimyno el. paštas | testui | ✅ | ✅ |
| `QUOTE_FROM_EMAIL` | siuntėjo adresas (domenas patvirtintas Resend) | `uzklausos@valdopalapines.lt` | testui | ✅ | ✅ |
| `SANITY_STUDIO_PROJECT_ID` | tas pats ID, bet Studio įrankiui | 2.2 | ✅ | – | PC: ✅ |
| `SANITY_STUDIO_DATASET` | tas pats dataset Studio įrankiui | `production` | ✅ | – | PC: ✅ |
| `SANITY_API_WRITE_TOKEN` | rašymo teisė seed'ui | 2.2 C | tik seed | **NIEKADA** | tik seed |
| `SANITY_API_READ_TOKEN` | skaitymo teisė, jei dataset ne viešas | Sanity → API → Tokens (Viewer) | – | – | ❌ (viešam nereikia) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | šlamšto apsauga | 7.1 | – | pasirinktinai | ❌ |
| `NEXT_PUBLIC_GA_ID` | Google Analytics | 7.2 | – | pasirinktinai | ❌ |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel | 7.3 | – | pasirinktinai | ❌ |
| `NEXT_PUBLIC_LEAD_VALUE` | užklausos vertė € reklamos statistikai | pvz. `40` | – | pasirinktinai | ❌ |
| `META_CAPI_TOKEN` | Meta serverinis sekimas | 7.3 | – | pasirinktinai | ❌ |

**Kaip pakeisti kintamąjį vėliau (🖥️ Serveris):** `nano .env` → išsaugok → jei kintamasis prasideda `NEXT_PUBLIC_` – `docker compose up -d --build`, kitaip – `docker compose up -d --force-recreate web`.

---

# B priedas — Kai kažkas neveikia

| Simptomas | Tikėtina priežastis | Ką daryti |
|---|---|---|
| `npm`/`npx` „running scripts is disabled" | Windows blokuoja skriptus | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Svetainė lokaliai krenta su klaida apie `PROJECT_ID` | `.env` neužpildytas/su klaida | Patikrink `NEXT_PUBLIC_SANITY_PROJECT_ID` (be tarpų), paleisk `npm run dev` iš naujo |
| Katalogas, galerija tušti | Neįkeltas turinys arba neteisingas dataset | `npm run seed`; patikrink, kad Sanity dataset `production` ir **Public** |
| `npm run seed` – „Trūksta … SANITY_API_WRITE_TOKEN" | Eilutė užkomentuota (`#`) arba tuščia | Nuimk `#`, įklijuok tokeną |
| Laiškai neateina | Domenas Resend dar ne **Verified**; `QUOTE_FROM_EMAIL` ne to domeno; blogas raktas | Resend → **Logs** (matysi priežastį); patikrink Spam; serveryje `docker compose logs --tail=50 web` |
| `ssh` „Permission denied (publickey)" | Kitas raktas / neperkopijuotas `deploy` naudotojui | Prisijunk `ssh root@IP` ir pakartok 4.2 `rsync` komandą |
| `docker` „permission denied" | Nepersiloginta po `usermod -aG docker` | `exit`, prisijunk iš naujo |
| `docker compose up --build` baigiasi „Killed"/out of memory | Serveris < 2 GB RAM | Padidink serverį Hetzner konsolėje |
| `https://valdopalapines.lt` nesiekia / „insecure" | DNS dar nepasklido arba blogas IP | `nslookup valdopalapines.lt`; `docker compose logs caddy | tail -30`; palauk ir bandyk vėl |
| Caddy log: „… connection refused / challenge failed" | 80/443 uždaryti arba DNS nenukreiptas | `sudo ufw status` turi rodyti 80 ir 443; patikrink A įrašus |
| GitHub Actions: `quality` nepraeina | Lint/typecheck/build klaida | Spausk bėgimą → raudoną žingsnį → skaityk klaidą; pataisyk ir `git push` |
| GitHub Actions: `deploy` – „ssh: handshake failed" / „unable to authenticate" | Blogas `SSH_PRIVATE_KEY` arba `SSH_HOST/USER/PORT` | Perkelk raktą iš naujo (su `BEGIN`/`END` eilutėmis), patikrink secrets |
| `git pull` serveryje – „Permission denied (publickey)" | Deploy key nepridėtas / `~/.ssh/config` neteisingas | Pakartok 4.4 |
| Webhook log rodo 401 | `Secret` skiriasi nuo `SANITY_REVALIDATE_SECRET` | Sulyginti, `docker compose up -d --force-recreate web` |
| Webhook log rodo 400 | Projection ne `{ "_type": _type }` | Pataisyk Sanity webhook'e |
| Studio rodo tuščią puslapį ar „projectId" klaidą po `sanity deploy` | `.env` nėra `SANITY_STUDIO_PROJECT_ID` | Užpildyk ir pakartok `npx sanity deploy` |
| Po `NEXT_PUBLIC_*` pakeitimo nieko nepasikeitė | Nebuvo perbuildinta | `docker compose up -d --build` |

---

# C priedas — Mėnesio profilaktika (Lukui)

- **Serveris (🖥️):** `sudo apt update && sudo apt upgrade -y`; `docker image prune -f`; `df -h` (laisva vieta); `docker compose ps`; `docker compose logs --tail=100 web`.
- **Backupai:**
  - Hetzner **Backups** (savaitinės serverio kopijos, įjungtos 4.1) – patikrink, kad jos kuriasi.
  - Sanity turinio kopija **iš savo PC** (serveryje Node nėra, todėl cron jame neveiks):
    ```powershell
    cd C:\dev\valdo-palapines
    npx sanity login
    npx sanity dataset export production sanity-backup.tar.gz
    ```
    Failą (su nuotraukomis) išsaugok saugioje vietoje. Daryk kartą per mėnesį.
- **Uptime:** nemokama paslauga UptimeRobot (https://uptimerobot.com) – prideda HTTPS monitorių `https://valdopalapines.lt`, siunčia el. laišką, jei svetainė neveikia.
- **Priklausomybės:** Dependabot (`.github/dependabot.yml`) kas savaitę atidaro *Pull Request*'us GitHub'e. Peržiūrėk; jei CI žalias – *Merge*. Saugumo PR (ypač `next`) – nedelsiant. Sujungus automatiškai įsidiegia į gyvą svetainę.
- **Rollback (kai po diegimo kažkas sulūžo)** – saugiausia iš PC:
  ```powershell
  git revert HEAD --no-edit
  git push origin main
  ```
  (Atšaukia paskutinį pakeitimą; automatika įdiegia ankstesnę būseną.)
- **Analitika / Ads:** žr. `MARKETING.md`.

---

*Techninius klausimus tvarko Lukas. Turinį — kaimynas per Sanity Studio (žr. `KAIMYNO-VALDYMO-GIDAS.md`).*
