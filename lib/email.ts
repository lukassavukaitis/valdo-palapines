/**
 * El. pašto siuntimas užklausoms. Du variantai — pasirink vieną:
 *   A) Resend  (rekomenduojama: paprasta, nemokama iki 3000 laiškų/mėn.)
 *   B) Nodemailer + SMTP (jei nori siųsti per esamą pašto dėžutę / serverį)
 *
 * ENV kintamieji (.env.local / hostingo Environment Variables):
 *   RESEND_API_KEY=re_xxx
 *   QUOTE_TO_EMAIL=kaimynas@pastas.lt      # kur ateina užklausos
 *   QUOTE_FROM_EMAIL=uzklausos@valdopalapines.lt   # verifikuotas domenas
 *   (SMTP variantui) SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 */

type QuotePayload = {
  eventType: string;
  date: string;
  guests: string;
  city: string;
  venue?: string;
  items?: { name: string }[];
  name: string;
  email: string;
  phone: string;
  message?: string;
};

/* ---------- HTML laiško šablonas (firminis: žalia / auksas / dramblio kaulas) ---------- */
/** Visi vartotojo laukai eina į HTML — būtina išvengti žymių injekcijos. */
const esc = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function renderEmail(d: QuotePayload): string {
  // `value` yra jau saugus HTML (žr. esc); žinutės eilutės lūžiai išlaikomi
  const row = (label: string, value?: string) =>
    value
      ? `<tr>
           <td style="padding:8px 0;color:#6B6E66;font-size:13px;width:150px;vertical-align:top">${label}</td>
           <td style="padding:8px 0;color:#1A1B18;font-size:14px;font-weight:600">${value}</td>
         </tr>`
      : "";

  const phoneTel = esc(d.phone.replace(/[^\d+]/g, ""));
  const phone = esc(d.phone);
  const email = esc(d.email);

  const items =
    d.items && d.items.length
      ? d.items.map((i) => `<li style="margin:2px 0">${esc(i.name)}</li>`).join("")
      : "<li style='color:#6B6E66'>Nepasirinkta — pasiūlyti pagal renginį</li>";

  return `
  <div style="background:#EFE9DD;padding:32px 0;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="600" align="center" style="background:#FBF9F4;border-radius:16px;overflow:hidden;margin:0 auto">
      <tr>
        <td style="background:#2F4A3C;padding:24px 32px">
          <span style="color:#FBF9F4;font-size:20px;font-weight:700">Valdo<span style="color:#B08D4C">palapines</span>.lt</span>
          <p style="color:#EFE9DD;margin:6px 0 0;font-size:13px">Nauja užklausa iš svetainės</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px">
          <h2 style="margin:0 0 4px;color:#1A1B18;font-size:18px">Renginio informacija</h2>
          <table role="presentation" width="100%" style="border-collapse:collapse">
            ${row("Renginio tipas", esc(d.eventType))}
            ${row("Data", esc(d.date))}
            ${row("Svečių skaičius", esc(d.guests))}
            ${row("Miestas", esc(d.city))}
            ${row("Vieta / adresas", d.venue && esc(d.venue))}
          </table>

          <h3 style="margin:20px 0 6px;color:#1A1B18;font-size:15px">Pageidaujamas inventorius</h3>
          <ul style="margin:0;padding-left:18px;color:#1A1B18;font-size:14px">${items}</ul>

          <h3 style="margin:20px 0 6px;color:#1A1B18;font-size:15px">Kontaktai</h3>
          <table role="presentation" width="100%" style="border-collapse:collapse">
            ${row("Vardas", esc(d.name))}
            ${row("Telefonas", `<a href="tel:${phoneTel}" style="color:#2F4A3C">${phone}</a>`)}
            ${row("El. paštas", `<a href="mailto:${email}" style="color:#2F4A3C">${email}</a>`)}
            ${row("Žinutė", d.message && esc(d.message).replace(/\r?\n/g, "<br>"))}
          </table>

          <a href="tel:${phoneTel}"
             style="display:inline-block;margin-top:24px;background:#2F4A3C;color:#FBF9F4;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:600">
            Skambinti klientui
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 32px;background:#EFE9DD;color:#6B6E66;font-size:12px">
          Šis laiškas išsiųstas automatiškai iš Valdopalapines.lt užklausos formos.
        </td>
      </tr>
    </table>
  </div>`;
}

/* ---------- A) RESEND ---------- */
export async function sendQuoteEmail(d: QuotePayload) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Resend SDK nemeta klaidos — grąžina { data, error }; be šios patikros
  // netinkamas raktas / neverifikuotas domenas tyliai pamestų užklausą.
  const { error } = await resend.emails.send({
    from: `Valdopalapines.lt <${process.env.QUOTE_FROM_EMAIL}>`,
    to: [process.env.QUOTE_TO_EMAIL!],
    replyTo: d.email, // atsakius laišką — eina tiesiai klientui
    subject: `Nauja užklausa: ${d.eventType} · ${d.city} · ${d.guests} žm.`.replace(/[\r\n]+/g, " "),
    html: renderEmail(d),
  });
  if (error) throw new Error(`Resend: ${error.name} — ${error.message}`);
}

/* ---------- B) NODEMAILER + SMTP (alternatyva) ----------
import nodemailer from "nodemailer";

export async function sendQuoteEmailSmtp(d: QuotePayload) {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  return transport.sendMail({
    from: `"Valdopalapines.lt" <${process.env.QUOTE_FROM_EMAIL}>`,
    to: process.env.QUOTE_TO_EMAIL,
    replyTo: d.email,
    subject: `Nauja užklausa: ${d.eventType} · ${d.city} · ${d.guests} žm.`,
    html: renderEmail(d),
  });
}
------------------------------------------------------------- */
