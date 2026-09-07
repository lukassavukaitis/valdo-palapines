/**
 * Pradinių duomenų įkėlimas į Sanity.
 * Paleidimas:  npx tsx scripts/seed-sanity.ts
 *
 * Reikalingi kintamieji (.env):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET   (pvz. production)
 *   SANITY_API_WRITE_TOKEN       (Manage -> API -> Tokens -> Editor teisės)
 *
 * Naudoja createOrReplace su fiksuotais _id — saugu paleisti kelis kartus
 * (nesukurs dublikatų). Nuotraukas kaimynas įkelia per Studio.
 */
import "dotenv/config";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "❌ Trūksta NEXT_PUBLIC_SANITY_PROJECT_ID arba SANITY_API_WRITE_TOKEN (.env)."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

type SeedService = {
  _id: string;
  name: string;
  slug: string;
  category: "palapines" | "baldai" | "tekstile" | "apsvietimas";
  capacity?: string;
  specs?: string[];
  description?: string;
  priceFrom?: number;
  order?: number;
};

const services: SeedService[] = [
  // ---------- Palapinės ----------
  {
    _id: "seed-dvislaite",
    name: "Dvišlaitė palapinė",
    slug: "dvislaite-palapine",
    category: "palapines",
    capacity: "iki 300 žm.",
    specs: ["Plotis 10–15 m", "Skaidrios arba baltos sienelės", "Kietas grindų pagrindas galimas"],
    description:
      "Klasikinė dvišlaitė palapinė didesnėms šventėms. Erdvi, elegantiška, tinka pokyliams ir vestuvėms. Sienelės nuimamos, galima jungti su terasomis.",
    priceFrom: 350,
    order: 1,
  },
  {
    _id: "seed-pagoda",
    name: "Pagoda paviljonas",
    slug: "pagoda-paviljonas",
    category: "palapines",
    capacity: "iki 50 žm.",
    specs: ["Dydis 5×5 m", "Elegantiškas smailėjantis stogas", "Puiku įėjimui ar barų zonai"],
    description:
      "Elegantiškas pagodos formos paviljonas — dažnai naudojamas prie įėjimo, svečių sutikimui ar atskiroms zonoms. Galima statyti kelis greta.",
    priceFrom: 150,
    order: 2,
  },
  {
    _id: "seed-flex",
    name: "Flex palapinė",
    slug: "flex-palapine",
    category: "palapines",
    capacity: "iki 100 žm.",
    specs: ["Lankstus modulinis dydis", "Greitas montavimas", "Skaidrus arba baltas stogas"],
    description:
      "Universali modulinė „flex“ palapinė, kurios plotą galima pritaikyti pagal svečių skaičių. Praktiškas sprendimas vidutinio dydžio renginiams.",
    priceFrom: 220,
    order: 3,
  },
  {
    _id: "seed-karuna",
    name: "Karūna palapinė",
    slug: "karuna-palapine",
    category: "palapines",
    capacity: "iki 80 žm.",
    specs: ["Dekoratyvi „karūnos“ forma", "Atviri šonai", "Efektinga vakaro apšvietimui"],
    description:
      "Dekoratyvi „karūnos“ formos palapinė su atvirais šonais — ypač efektinga vakaro apšvietime. Puikiai tinka šventėms lauke sodybose.",
    priceFrom: 200,
    order: 4,
  },

  // ---------- Baldai ----------
  {
    _id: "seed-stalai",
    name: "Banketo stalai",
    slug: "banketo-stalai",
    category: "baldai",
    capacity: "8–10 žm. / stalas",
    specs: ["Ilgi ir apvalūs variantai", "Su staltiesėmis arba be jų"],
    description:
      "Tvirti banketo stalai pokyliams — ilgi arba apvalūs. Deriname kiekį pagal svečių skaičių ir salės išplanavimą.",
    priceFrom: 8,
    order: 5,
  },
  {
    _id: "seed-kedes",
    name: "Kėdės svečiams",
    slug: "kedes-sveciams",
    category: "baldai",
    capacity: "pagal poreikį",
    specs: ["Baltos arba medinės", "Galimos užvalkalų spalvos"],
    description:
      "Patogios kėdės svečiams — baltos plastikinės arba medinės, su dekoratyviniais užvalkalais pagal renginio stilių.",
    priceFrom: 2,
    order: 6,
  },

  // ---------- Apšvietimas ----------
  {
    _id: "seed-apsvietimas",
    name: "Girliandos ir apšvietimas",
    slug: "girliandos-ir-apsvietimas",
    category: "apsvietimas",
    specs: ["Šiltos girliandos", "Prožektoriai zonoms", "Lauko šildytuvai vėsiam vakarui"],
    description:
      "Jaukus vakaro apšvietimas: šiltos girliandos virš svečių, akcentiniai prožektoriai ir lauko dujiniai šildytuvai vėsesnėms naktims.",
    priceFrom: 60,
    order: 7,
  },

  // ---------- Tekstilė ----------
  {
    _id: "seed-tekstile",
    name: "Staltiesės ir dekoras",
    slug: "staltieses-ir-dekoras",
    category: "tekstile",
    specs: ["Staltiesės, takeliai", "Kėdžių užvalkalai", "Spalvos pagal temą"],
    description:
      "Kokybiška tekstilė šventės stiliui užbaigti: staltiesės, takeliai, kėdžių užvalkalai ir dekoro detalės pasirinktoje spalvų gamoje.",
    priceFrom: 4,
    order: 8,
  },
];

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings" as const,
  phone: "+370 600 00000",
  email: "info@valdopalapines.lt",
  facebook: "https://facebook.com/valdopalapines",
  instagram: "https://instagram.com/valdopalapines",
  companyDetails:
    "[Įmonės pavadinimas]\nĮmonės kodas: [kodas]\nAdresas: [adresas]\nEl. paštas: info@valdopalapines.lt",
};

async function run() {
  console.log(`→ Rašoma į projektą ${projectId}, dataset „${dataset}"…`);
  const tx = client.transaction();

  for (const s of services) {
    tx.createOrReplace({
      _id: s._id,
      _type: "service",
      name: s.name,
      slug: { _type: "slug", current: s.slug },
      category: s.category,
      capacity: s.capacity,
      specs: s.specs,
      description: s.description,
      priceFrom: s.priceFrom,
      order: s.order,
    });
  }

  tx.createOrReplace(siteSettings);

  await tx.commit();
  console.log(`✅ Įkelta: ${services.length} inventoriaus įrašų + svetainės nustatymai.`);
  console.log("ℹ️  Nuotraukas pridėkite per Sanity Studio (kiekvienam įrašui).");
}

run().catch((err) => {
  console.error("❌ Klaida įkeliant duomenis:", err.message || err);
  process.exit(1);
});
