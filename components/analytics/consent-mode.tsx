import Script from "next/script";

/**
 * Google Consent Mode v2 — nustato numatytąjį sutikimą „denied" DAR PRIEŠ
 * užsikraunant GA4/Ads. ES privaloma: be to remarketingo sąrašai nepildomi ir
 * konversijų modeliavimas neveikia. Kai vartotojas sutinka (lib/consent.ts),
 * iškviečiamas `gtag('consent','update', …)`.
 *
 * beforeInteractive -> Next įkelia šį skriptą į <head>, dar prieš kitą JS.
 */
export function ConsentModeInit() {
  return (
    // App Router'yje beforeInteractive root layout'e yra korektiška (taisyklė pasenusi)
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="consent-mode-default" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'granted',
          security_storage: 'granted',
          wait_for_update: 500
        });
        gtag('js', new Date());
      `}
    </Script>
  );
}
