import { buildMetadata, SITE } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Privatumo politika",
  description:
    "Kaip Valdopalapines.lt tvarko asmens duomenis pagal BDAR: užklausos forma, slapukai, Google Analytics, el. paštas.",
  path: "/privatumo-politika",
});

const UPDATED = "2026 m.";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <h1 className="text-4xl font-semibold sm:text-5xl">Privatumo politika</h1>
      <p className="mt-3 text-sm text-stone">Paskutinį kartą atnaujinta: {UPDATED}</p>

      <div className="mt-10 space-y-8 text-ink/90 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-forest [&_a]:underline">
        <p>
          Ši privatumo politika paaiškina, kaip renkami, naudojami ir saugomi
          jūsų asmens duomenys, kai naudojatės svetaine {SITE.url} ir kreipiatės
          dėl paslaugų. Duomenis tvarkome vadovaudamiesi Bendruoju duomenų apsaugos
          reglamentu (BDAR) ir Lietuvos Respublikos teisės aktais.
        </p>

        <h2>1. Duomenų valdytojas</h2>
        <p>
          Duomenų valdytojas — įrangos nuomos paslaugas teikiantis subjektas,
          administruojantis svetainę {SITE.name}.
        </p>
        <ul>
          <li>Įmonė / veiklą vykdantis asmuo: <em>[įrašyti pavadinimą / vardą]</em></li>
          <li>Kodas: <em>[įmonės / individualios veiklos kodas]</em></li>
          <li>Adresas: <em>[adresas]</em></li>
          <li>El. paštas: <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          <li>Telefonas: <a href={`tel:${SITE.phone}`}>{SITE.phone}</a></li>
        </ul>

        <h2>2. Kokius duomenis renkame</h2>
        <h3>2.1. Užklausos forma</h3>
        <p>Kai pateikiate užklausą dėl nuomos, prašome šių duomenų:</p>
        <ul>
          <li>vardas;</li>
          <li>telefono numeris;</li>
          <li>el. pašto adresas;</li>
          <li>renginio informacija (tipas, data, svečių skaičius, miestas, vieta);</li>
          <li>pageidaujamas inventorius ir laisvos formos žinutė.</li>
        </ul>

        <h3>2.2. Techniniai duomenys ir slapukai</h3>
        <p>
          Su jūsų sutikimu galime rinkti apibendrintus statistinius duomenis apie
          naršymą (peržiūrėti puslapiai, apytikslė vietovė, įrenginio tipas) per
          analitikos slapukus. Būtinieji slapukai renkami visada — jie reikalingi
          svetainės veikimui ir jūsų slapukų pasirinkimui įsiminti.
        </p>

        <h2>3. Tikslai ir teisinis pagrindas</h2>
        <ul>
          <li>
            <strong>Užklausų tvarkymas ir pasiūlymo parengimas</strong> — pagrindas:
            veiksmai jūsų prašymu iki sutarties sudarymo (BDAR 6 str. 1 d. b p.).
          </li>
          <li>
            <strong>Analitika ir rinkodara</strong> — pagrindas: jūsų sutikimas
            (BDAR 6 str. 1 d. a p.), kurį galite bet kada atšaukti.
          </li>
          <li>
            <strong>Svetainės saugumas ir veikimas</strong> — pagrindas: teisėtas
            interesas (BDAR 6 str. 1 d. f p.).
          </li>
        </ul>

        <h2>4. Duomenų tvarkytojai (paslaugų teikėjai)</h2>
        <p>Duomenis padeda tvarkyti patikimi paslaugų teikėjai:</p>
        <ul>
          <li>
            <strong>El. laiškų siuntimas (Resend)</strong> — jūsų užklausos duomenys
            perduodami el. laišku mums per el. pašto siuntimo paslaugą. Duomenys gali
            būti tvarkomi serveriuose už ES/EEE ribų, taikant tinkamas apsaugos
            priemones (standartines sutarčių sąlygas).
          </li>
          <li>
            <strong>Google Analytics</strong> — analitikos paslauga, veikianti tik
            su jūsų sutikimu. IP adresas anonimizuojamas.
          </li>
          <li>
            <strong>Prieglobos / infrastruktūros teikėjas</strong> — svetainės
            serveris ir turinio valdymo sistema (CMS).
          </li>
        </ul>

        <h2>5. Saugojimo terminai</h2>
        <p>
          Užklausų duomenis saugome tiek, kiek reikia pasiūlymui parengti ir
          susirašinėjimui, bet ne ilgiau nei 24 mėnesius nuo paskutinio kontakto,
          nebent susitarimo vykdymas ar teisės aktai reikalauja ilgesnio termino.
          Analitikos duomenys saugomi pagal atitinkamo įrankio nustatymus.
        </p>

        <h2>6. Jūsų teisės</h2>
        <p>Pagal BDAR turite teisę:</p>
        <ul>
          <li>susipažinti su savo duomenimis;</li>
          <li>reikalauti juos ištaisyti;</li>
          <li>reikalauti juos ištrinti (&#8222;teisė būti pamirštam&#8220;);</li>
          <li>apriboti duomenų tvarkymą arba nesutikti su juo;</li>
          <li>perkelti duomenis;</li>
          <li>atšaukti sutikimą (tai neturi įtakos iki atšaukimo vykdytam tvarkymui).</li>
        </ul>
        <p>
          Dėl šių teisių kreipkitės el. paštu{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Taip pat turite teisę
          pateikti skundą Valstybinei duomenų apsaugos inspekcijai (VDAI),{" "}
          <a href="https://vdai.lrv.lt" rel="noopener noreferrer">vdai.lrv.lt</a>.
        </p>

        <h2>7. Slapukų valdymas</h2>
        <p>
          Slapukų pasirinkimą galite bet kada pakeisti išvalę naršyklės saugyklą
          arba iš naujo atidarę slapukų nustatymus svetainėje. Naršyklėje taip pat
          galite blokuoti ar trinti slapukus.
        </p>

        <h2>8. Pakeitimai</h2>
        <p>
          Ši politika gali būti atnaujinama. Aktuali versija visada skelbiama šiame
          puslapyje su nurodyta atnaujinimo data.
        </p>
      </div>
    </article>
  );
}
