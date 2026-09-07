import Link from "next/link";
import { Facebook, Instagram, Phone, Mail } from "lucide-react";
import { getSiteSettings } from "@/lib/sanity.queries";
import { SITE } from "@/lib/metadata";

export async function Footer() {
  const s = await getSiteSettings();
  const phone = s?.phone || SITE.phone;
  const email = s?.email || SITE.email;

  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-display text-2xl font-semibold">
            Valdo<span className="text-gold">palapines</span>.lt
          </span>
          <p className="mt-3 max-w-sm text-sm text-ivory/70">
            Palapinių, baldų, tekstilės ir apšvietimo nuoma šventėms bei
            renginiams visoje Lietuvoje.
          </p>
          {s?.companyDetails && (
            <p className="mt-4 whitespace-pre-line text-xs text-ivory/50">
              {s.companyDetails}
            </p>
          )}
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold">Nuorodos</h3>
          <ul className="mt-3 space-y-2 text-sm text-ivory/70">
            <li><Link href="/#katalogas" className="hover:text-ivory">Inventorius</Link></li>
            <li><Link href="/galerija" className="hover:text-ivory">Galerija</Link></li>
            <li><Link href="/straipsniai" className="hover:text-ivory">Straipsniai</Link></li>
            <li><Link href="/nuomos-taisykles" className="hover:text-ivory">Nuomos taisyklės</Link></li>
            <li><Link href="/#duk" className="hover:text-ivory">D.U.K.</Link></li>
            <li><Link href="/privatumo-politika" className="hover:text-ivory">Privatumo politika</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold">Kontaktai</h3>
          <ul className="mt-3 space-y-2 text-sm text-ivory/70">
            <li>
              <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-ivory">
                <Phone size={15} /> {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-ivory">
                <Mail size={15} /> {email}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-3">
            {s?.facebook && (
              <a href={s.facebook} aria-label="Facebook" className="text-ivory/70 hover:text-ivory">
                <Facebook size={20} />
              </a>
            )}
            {s?.instagram && (
              <a href={s.instagram} aria-label="Instagram" className="text-ivory/70 hover:text-ivory">
                <Instagram size={20} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10 py-6 text-center text-xs text-ivory/50">
        © {new Date().getFullYear()} Valdopalapines.lt. Visos teisės saugomos.
      </div>
    </footer>
  );
}
