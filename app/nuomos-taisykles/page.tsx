import { buildMetadata, SITE } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Nuomos taisyklės",
  description:
    "Palapinių, baldų ir renginių inventoriaus nuomos sąlygos: rezervacija, pristatymas, atsakomybė, atšaukimas.",
  path: "/nuomos-taisykles",
});

const UPDATED = "2026 m.";

export default function RentalTermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <h1 className="text-4xl font-semibold sm:text-5xl">Nuomos taisyklės</h1>
      <p className="mt-3 text-sm text-stone">Paskutinį kartą atnaujinta: {UPDATED}</p>

      <div className="mt-10 space-y-8 text-ink/90 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_a]:text-forest [&_a]:underline">
        <p>
          Šios taisyklės nustato {SITE.name} teikiamos įrangos (palapinių, paviljonų,
          baldų, tekstilės, apšvietimo ir kito inventoriaus) nuomos sąlygas. Pateikdamas
          užsakymą, nuomininkas patvirtina, kad su taisyklėmis susipažino ir jas priima.
        </p>

        <h2>1. Rezervacija ir užsakymas</h2>
        <ul>
          <li>Užsakymas laikomas patvirtintu, kai suderinamas inventorius, data, vieta ir kaina bei gaunamas nuomininko patvirtinimas.</li>
          <li>Sezono metu (gegužė–rugsėjis) rekomenduojama rezervuoti bent 4–6 savaites iš anksto.</li>
          <li>Data ir įranga rezervuojama nuomininkui, todėl gali būti taikomas išankstinis mokestis (avansas).</li>
        </ul>

        <h2>2. Kainos ir atsiskaitymas</h2>
        <ul>
          <li>Galutinė kaina priklauso nuo įrangos kiekio, nuomos trukmės, pristatymo atstumo bei montavimo apimties.</li>
          <li>Į kainą, jei nesutarta kitaip, įskaičiuojamas pristatymas, montavimas ir išmontavimas sutartu adresu.</li>
          <li>Atsiskaitymo tvarka (avansas ir likutis) nurodoma pasiūlyme.</li>
        </ul>

        <h2>3. Pristatymas, montavimas ir grąžinimas</h2>
        <ul>
          <li>Įrangą pristatome ir sumontuojame sutartu laiku ir adresu visoje Lietuvoje.</li>
          <li>Nuomininkas užtikrina privažiavimą ir tinkamą, saugų montavimo plotą (lygus pagrindas, be požeminių komunikacijų kliūčių).</li>
          <li>Po renginio įranga išmontuojama sutartu laiku; iki tol nuomininkas atsako už jos saugumą.</li>
        </ul>

        <h2>4. Nuomininko atsakomybė</h2>
        <ol>
          <li>Naudoti įrangą pagal paskirtį ir saugoti ją nuo sugadinimo, vagystės ar praradimo visą nuomos laikotarpį.</li>
          <li>Nekeisti įrangos konstrukcijos, neperkelti sumontuotų palapinių be nuomotojo sutikimo.</li>
          <li>Nedelsiant informuoti nuomotoją apie gedimus ar nelaimingus atsitikimus.</li>
          <li>Grąžinti įrangą tokios pat būklės, kokios gauta, atsižvelgiant į natūralų nusidėvėjimą.</li>
        </ol>

        <h2>5. Sugadinimas ir praradimas</h2>
        <p>
          Už įrangos sugadinimą ar praradimą nuomos laikotarpiu atsako nuomininkas.
          Padarytos žalos dydis nustatomas pagal remonto arba pakeitimo nauju vienetu
          vertę. Įprastas nusidėvėjimas žala nelaikomas. Rekomenduojama nepalikti
          įrangos be priežiūros viešose vietose.
        </p>

        <h2>6. Oro sąlygos ir sauga</h2>
        <ul>
          <li>Palapinės yra atsparios įprastam vėjui ir lietui, tačiau esant ekstremalioms oro sąlygoms (stiprus vėjas, audra) dėl saugumo gali tekti laikinai riboti naudojimą.</li>
          <li>Nuomotojas turi teisę duoti privalomus saugumo nurodymus (pvz., šoninių sienelių nuėmimas per stiprų vėją).</li>
          <li>Atviros liepsnos šaltinius (žvakes, kepsnines) prie tekstilės ir palapinių naudoti tik suderinus ir laikantis saugos reikalavimų.</li>
        </ul>

        <h2>7. Atšaukimas ir datos keitimas</h2>
        <ul>
          <li>Užsakymą galima atšaukti pranešus iš anksto; sumokėtas avansas gali būti negrąžinamas, jei data jau buvo rezervuota nuomininkui.</li>
          <li>Datą pakeisti galima esant laisvam laikui ir suderinus su nuomotoju.</li>
          <li>Konkrečios atšaukimo sąlygos nurodomos pasiūlyme arba sutartyje.</li>
        </ul>

        <h2>8. Force majeure</h2>
        <p>
          Šalys neatsako už įsipareigojimų nevykdymą dėl nenugalimos jėgos aplinkybių
          (stichinių nelaimių, valdžios ribojimų ir pan.), kurių negalėjo numatyti ar
          kontroliuoti.
        </p>

        <h2>9. Kontaktai</h2>
        <p>
          Klausimai dėl nuomos: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>,{" "}
          <a href={`tel:${SITE.phone}`}>{SITE.phone}</a>.
        </p>

        <p className="text-sm text-stone">
          Šios taisyklės yra bendro pobūdžio ir gali būti tikslinamos konkrečiame
          pasiūlyme ar nuomos sutartyje.
        </p>
      </div>
    </article>
  );
}
