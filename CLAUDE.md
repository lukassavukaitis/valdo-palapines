# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project
valdopalapines.lt — small Lithuanian brochure / lead-gen site for a tent (palapinės), pavilion and
event-furniture rental business. Visitors browse inventory, use a simple configurator and send a quote
request that is e-mailed to the owner ("kaimynas", non-technical). Content is edited by the owner in
Sanity Studio. Technical owner/admin: Lukas.

All user-facing text, comments and docs are in **Lithuanian** — keep that style (UI strings, code comments,
guides). Keep new code comment density and naming consistent with the surrounding files.

## Stack
Next.js 14 (App Router, `output: "standalone"`) · React 18 · TypeScript (strict) · Tailwind 3 ·
Framer Motion · Sanity v3 (CMS, Studio hosted on sanity.studio) · Resend (e-mail) · Zod ·
Cloudflare Turnstile (optional) · GA4 + Meta Pixel/CAPI + custom consent banner (optional).
Deploy: Docker (node:22-alpine) + Caddy on a Hetzner VPS, GitHub Actions SSH deploy on push to `main`.

## Commands
Requires Node 22 (pinned in `.node-version`; not installed on every dev machine — check `node -v` first).
With a newer Node/npm (24/11) `npm ci` fails on the lockfile; use fnm (`fnm exec --using 22 npm.cmd ci`).
```bash
npm ci                 # install exactly per lockfile
cp .env.example .env.local   # minimum: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
npm run dev            # http://localhost:3000
npm run lint
npm run typecheck      # tsc --noEmit
npm run build && npm start
npm run seed           # one-off: loads starter content into Sanity (needs SANITY_API_WRITE_TOKEN)
npx sanity dev         # Studio locally
docker compose up web  # prod-like, WITHOUT Caddy
```
Do not run a full `docker compose up` locally: Caddy binds 80/443 for the real domain.
There is no test suite; CI gates are lint + typecheck + build (`.github/workflows/deploy.yml`).

## Layout
- `app/` — routes: `/` (single-page: hero, catalog, quote form, configurator, gallery, testimonials, FAQ),
  `/paslaugos/[slug]`, `/straipsniai` + `/[slug]`, `/nuomos-taisykles`, `/privatumo-politika`,
  `api/quote` (form → Resend + Meta CAPI), `api/revalidate` (Sanity webhook), `api/og`.
- `components/{site,forms,analytics,seo,ui}` — UI. Gallery, FAQ, catalog are **anchors on the home page**
  (`/#galerija`, `/#duk`, `/#katalogas`, `/#uzklausa`), not separate routes.
- `lib/` — `sanity.queries.ts` (all GROQ), `sanity.client.ts`, `email.ts`, `meta-capi.ts`, `ratelimit.ts`,
  `metadata.ts` (`SITE` constants), `consent.ts`, `analytics.ts`.
- `sanity/schemas/`, `sanity.config.ts` — CMS schema (service, post, galleryImage, testimonial, siteSettings, seo).
- `scripts/seed-sanity.ts` — idempotent seed (`createOrReplace`, fixed `_id`s).
- Docs: `README-MASTER-GIDAS.md` (technical, for Lukas), `KAIMYNO-VALDYMO-GIDAS.md` (non-technical, for the
  owner), `MARKETING.md` (Ads/SEO). Keep the two guides accurate when changing CMS fields or env vars —
  Studio field labels in the neighbour guide must match `sanity/schemas/*`.

## Conventions and gotchas
- **Sanity queries** must include the `PUBLISHED` filter (`!(_id in path("drafts.**"))`); with
  `SANITY_API_READ_TOKEN` set, drafts are otherwise returned and become public.
- Data fetching uses `sanityFetch` (ISR `revalidate` 60 s + tag per `_type`); webhook calls
  `revalidateTag(_type)`. Webhook projection must be `{ "_type": _type }`.
- `lib/sanity.client.ts` throws at import if `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing (outside `safe()`).
- **`NEXT_PUBLIC_*` vars are inlined at build time.** Any new one must be added as `ARG`/`ENV` in the
  `Dockerfile` and `args` in `docker-compose.yml`, otherwise it is `undefined` in the Docker deploy.
- **E-mail HTML**: escape every user-supplied value with `esc()` in `lib/email.ts`. Resend's `send()` returns
  `{ error }` instead of throwing — always check it.
- `/api/quote` validation: Zod schema with max lengths, 20 KB body cap, honeypot (`website`), optional Turnstile,
  in-memory IP rate limit (resets on deploy; trusts first `x-forwarded-for` — only valid behind Caddy).
- `SITE.phone` / `SITE.email` in `lib/metadata.ts` feed JSON-LD and are separate from the Sanity
  `siteSettings` values used in the footer. **`SITE.phone` is still a placeholder (`+370 600 00000`).**
- Secrets live only in `.env` (never commit). `SANITY_API_WRITE_TOKEN` is for local seeding only, never on the server.

## Known issues / TODO (from the review)
1. **Upgrade Next.js 14.2.5 → latest 15.5.x** (14 is EOL; 40+ advisories incl. critical image-optimizer RCE
   fixed only in ≥15.5.24). Update `eslint-config-next` with it; check `next/image`, route handler and
   `cookies`/`headers` async API changes.
2. Move `sanity`, `@sanity/vision`, `styled-components` to `devDependencies` (Studio is hosted separately);
   this removes most transitive audit findings (vite, decompress, adm-zip, glob, minimatch, …).
3. `zod` 3.25 has a high advisory fixed in zod 4 — plan an upgrade.
4. After 1–2: remove `continue-on-error: true` from the `npm audit` step in `deploy.yml`.
5. Replace placeholder `SITE.phone`; consider sourcing JSON-LD contact data from Sanity.
6. Possible simplification: drop webhook revalidation (ISR 60 s suffices), pick Turnstile **or** honeypot+limiter,
   remove Meta CAPI/consent code if ads are not used.
7. Hosting alternative worth considering: Cloudflare Pages/Vercel instead of VPS+Docker+Caddy (no OS patching).
8. Caddy has no CSP / Permissions-Policy; `appleboy/ssh-action` is pinned by tag, not SHA.

## Security checklist before merging changes
- No new unescaped user input in HTML/e-mail; no secrets in `NEXT_PUBLIC_*`.
- New API routes: validate with Zod, cap body size, rate-limit.
- Run `npm audit --omit=dev` after dependency changes (Dependabot opens weekly PRs; treat `next` PRs as urgent).

## Git
Single `main` branch, push triggers production deploy — keep `main` green (lint, typecheck, build).
Commit messages in English or Lithuanian, short imperative.
