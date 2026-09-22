<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project

Safe Heaven Accomodations — a marketing and lead-capture site for a boys-only
student PG at Mitra Enclave, Sector P7, Greater Noida. One property. Enquiry
only: no prices are published and no payment is ever taken on the site.

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4, with Payload 3
mounted in the same app as the CMS. Postgres and file storage are Supabase.
Package manager is **npm**. Node `>= 22`.

Plan and data model: [`docs/PLAN.md`](docs/PLAN.md).
What is left to do: [`todo/TODO.md`](todo/TODO.md) — the only backlog. Finished
work is not tracked; the decisions worth keeping from it are below.

## Commands

```bash
npm install
cp .env.example .env.local    # then fill in DATABASE_URI and PAYLOAD_SECRET

npm run dev                   # Next dev server on :3000, admin at /admin
npm run build                 # production build
npm run lint                  # biome check --write src  then  eslint  (⚠ Biome auto-writes fixes)
npm run format                # biome format --write src
npm run typecheck             # tsc --noEmit — the real type gate
npm run generate:types        # regenerate src/payload-types.ts from collections
npm run generate:importmap    # regenerate the Payload admin import map
```

## After every change (required)

Run `npm run lint` and `npm run typecheck`. Both must be clean before a task is
done. Biome auto-writes some fixes; resolve the rest rather than suppressing
them. Never weaken a rule or add a blanket `biome-ignore` to make output green.

After changing any Payload collection or global, run `npm run generate:types`
and commit the regenerated `src/payload-types.ts`.

## Architecture

**Two route groups.** `src/app/(frontend)` is the public site; `src/app/(payload)`
is the CMS. Each has its own root layout — Payload requires this, so there is no
`src/app/layout.tsx`.

**Layering** — the same flow as the Go services, mapped onto Next:

| Layer | Lives in | Rule |
| --- | --- | --- |
| Route | `src/app/(frontend)/**/page.tsx` | Thin. Metadata, data fetch, render one screen. No business logic, no markup beyond the screen component |
| Screen | `src/screens/<Name>/Screen<Name>.tsx` | Page composition and page-local components |
| Component | `src/components/ui`, `src/components/layout` | Shared primitives and chrome only |
| Service | `src/services` | Business logic — lead handling, email, validation orchestration |
| Repository | `src/repositories` | All data access, via Payload's Local API. Nothing else queries the database |
| Model | `src/payload/collections`, `src/payload/globals` | Schema definitions |

A server action is a controller: it validates input, calls one service, returns a
typed result. It must not contain business logic or touch the database directly.

**Data access.** Server Components call repository functions, which use Payload's
Local API — no HTTP hop, no `fetch` to our own API. Writes go through server
actions. There is deliberately **no Redux, no client-side data fetching library
and no global store**; if you reach for one, the data belongs on the server.

**Errors.** Services return a typed result (`{ ok: true, data }` /
`{ ok: false, error }`) from a shared set of error values in `src/utils`. Do not
throw strings, and do not invent ad-hoc error shapes per feature.

**Path alias:** `@/*` → `src/*`. `@payload-config` → `src/payload.config.ts`.

## Directory structure

```
src/
  app/
    (frontend)/        public routes — Next-mandated filenames only
    (payload)/         CMS admin + API — do not add site markup here
  screens/<Name>/      Screen<Name>.tsx + components/ hooks/ utils/ constants.ts
  components/
    ui/                Button, Card, Modal, form fields — shared primitives
    layout/            Header, Footer, shell
  hooks/               shared hooks only; page-local hooks live with their screen
  services/            business logic
  repositories/        Payload Local API data access
  payload/
    collections/       Properties, RoomTypes, Leads, Faqs, ...
    globals/           SiteSettings, HomePage, ...
  utils/               UtilsX.ts, constants, enums, Logger.ts
  types/               shared types
docs/                  PLAN.md
```

Page-specific components belong under their screen, not in `src/components`.
Promote to `src/components/ui` only on the second use.

## Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Components | PascalCase | `Button.tsx`, `RoomBlock.tsx` |
| Screens | `Screen` prefix, PascalCase | `ScreenProperty.tsx` |
| Contexts / providers | `Provider` prefix | `ProviderEnquiry.tsx` |
| Utils, constants, types | `Utils` prefix or PascalCase | `UtilsDate.ts`, `Logger.ts` |
| Hooks | camelCase, **no `Hook` suffix** | `useEnquiryModal.ts` |
| Repositories / services | camelCase file, verb-first functions | `leadRepository.ts`, `submitEnquiry()` |
| Tests | `*.test.ts(x)` beside the source or in `__tests__/` | `Button.test.tsx` |
| Functions, variables | camelCase, descriptive | `getFeaturedRooms` |

> The hook rule intentionally differs from `CodingGuidelines.md` in
> `fe-backoffice`, which documents `useXHook.ts`. That repo's actual code uses
> `useAccess.ts`, `useDebounce.ts`, `useInfiniteScroll.ts` — no suffix. Code
> wins over the doc.

**No vendor or product names in identifiers.** Name things by role, so the
provider can change without a rename.

✅ `emailClient`, `sendLeadNotification()`, `storageAdapter`
❌ `resendClient`, `sendViaResend()`, `supabaseUploader`

Vendor detail stays in config and env, not spread through the codebase.

## Code style

- **Biome** is the formatter and linter — **tabs, single quotes**. Not Prettier.
- **ESLint** is kept only for `next/core-web-vitals`, which Biome has no
  equivalent for. Do not add general lint rules there; they belong in Biome.
- `noConsole` is an error (allowed: `assert`/`error`/`info`/`warn`). Use
  `debugLog` / `debugWarn` / `debugError` from `src/utils/Logger.ts`.
- `noUnusedVariables` is an error.
- Keep components **under ~200 lines**. Split by section, not by arbitrary cuts.
- Never `import React` — the JSX transform handles it.
- Default to Server Components. Add `'use client'` only for a component that
  genuinely needs state, effects or browser APIs, and keep it as small as
  possible — an island, not a page.
- Compose Tailwind classes with a `cn` helper rather than string concatenation.
- Prefer flex/grid with `gap` over margins for sibling spacing.

## Content rules

These are product constraints, enforced in code review:

- **No prices anywhere on the public site.** Rent lives on `roomTypes` as an
  internal admin-only field. Public copy says "rent shared on enquiry".
- **No payment flow.** Enquiry → callback → WhatsApp. Nothing else.
- Anything a non-technical person should be able to change — copy, photos,
  distances, FAQs, the WhatsApp invite link — comes from the CMS, never a
  hardcoded constant.
- Alt text is required on every upload at the CMS level. Do not bypass it.
- Do not invent facts about the property. Unconfirmed claims are tracked in
  `todo/TODO.md` under E15.1.

## Accessibility

- Modals and accordions build on Radix primitives — do not hand-roll focus
  traps, scroll lock or ARIA wiring.
- Minimum 44px hit targets on mobile.
- Every icon-only control needs an accessible name.
- Keyboard reachable with visible focus, at 390px and 1440px.

## Definition of done (every subtask)

- TypeScript clean, ESLint clean, `npm run build` passes
- Works at 390px and 1440px
- Keyboard reachable, visible focus
- No hardcoded content that belongs in the CMS
- No invented facts that E15.1 hasn't confirmed (see `todo/TODO.md`)

## Stack decisions on record

**The admin panel imports its own stylesheet.**
`src/app/(payload)/layout.tsx` must import `@payloadcms/next/css`. Without it
`/admin` renders as unstyled HTML — serif text, full-bleed inputs — which reads
as a broken app rather than a missing import. `custom.scss` loads after it and
holds the branding; it only re-points Payload's own component custom
properties, so a future Payload upgrade can make it stock-looking but not
broken.


**`(payload)/layout.tsx` is exempt from `complexity/useArrowFunction`.**
Payload hands `serverFunction` down to a Client Component, so React requires it
to carry a `'use server'` directive — which only a block-bodied function can
hold. Biome's autofix rewrites it to a concise arrow and silently drops the
directive, and the result is a 500 on every `/admin` request that only appears
once the database connects far enough to render the panel. The single-line
`biome-ignore` above it is load-bearing; do not remove it or "simplify" the
function.


**Postgres connection is built from discrete fields, not a connection string.**
`pg` does `Object.assign({}, config, parse(config.connectionString))`, so a
connection string overrides any field passed beside it — an explicit `password`
next to a `connectionString` that contains one is silently discarded. That cost
a debugging session: `DATABASE_URI` still held an old password, `DATABASE_PASSWORD`
held the new one, and the old one won with only `28P01` to show for it.
`src/payload/databaseConfig.ts` now parses the URI and picks the password
explicitly, which also removes the URI-escaping trap for passwords containing
`@`, `#`, `/` or `?`.


Reviewed 2026-09-16 against an external stack audit. What was taken, and what wasn't.

| Decision | Verdict | Why |
| --- | --- | --- |
| Icon options in the CMS | **Unified** — `src/payload/fields/iconOptions.ts` | Two hand-maintained icon lists (amenities, page globals) had drifted, and the page list was missing `shopping`, which the community page's own seed content uses. Payload rejected it with "The following field is invalid" and no value, no row, no reason. One list now, `satisfies readonly IconName[]`, so a bad or renamed icon fails the build instead of the seed. UI chrome (`arrowRight`, `chevronDown`, `close`, `menu`) is deliberately excluded |
| pg-pool:45 means nothing | **Trap** | Every `pool.connect()` failure reports `pg-pool/index.js:45`, because that line is `Error.captureStackTrace(err)` inside `promisify` — the code that REPLACES the stack. It does not distinguish a queue timeout from a network failure. Two wrong conclusions in this project came from reading it as though it did |
| Schema push against a shared database | **Disabled by default** — `PAYLOAD_DB_PUSH` | Payload pushes schema whenever NODE_ENV is not `production`. `.env.local` points at the production Supabase project, so `npm run seed` silently rewrote the live schema and left `payload_migrations` out of step with it. Push is now opt-in |
| `payload run` and floating promises | **Trap** — `scripts/seed.ts` | `payload/dist/bin/index.js` does `await import(script)` and then `process.exit(0)` unconditionally. A script whose top level ends in `main().catch(...)` finishes evaluating the moment `main` is called, so the import resolves and the process is killed before the first await returns. Exit status 0, no output, nothing written — indistinguishable from a clean run with nothing to report. A `payload run` script must use TOP-LEVEL AWAIT |
| Supabase connection pooling | **Adopted** — E16.11 | Correct concern. Production is on the transaction pooler, migrations on the session pooler. The prepared-statement caveat usually attached to the transaction pooler does not apply here: the adapter is node-postgres |
| Supabase S3 config specifics | **Adopted** — E4.2a | `forcePathStyle: true` in particular |
| Radix Dialog + Accordion | **Adopted** — E1.16 | Suggested for the wrong reason (a date picker we don't need) but right for the modal and the accordion |
| Internal price field | **Adopted** — E3.3a | Staff can see rent in `/admin`; the site still shows none |
| "Drop Sass" | **Rejected** | `@payloadcms/next@3.89.0` depends on `sass@1.77.4` directly and `@payloadcms/ui/dist` carries 1,123 `.scss` imports. Removing it breaks `/admin`. We write zero Sass ourselves; it compiles admin styles only |
| MapLibre / Leaflet | **Rejected** | Cluster pins and bounding-box search are for browsing many listings. One building, one address — a lazy-loaded Google Maps embed is right. MapLibre would ship ~200 KB to draw a single pin |
| `react-day-picker` | **Rejected** | Check-in/check-out, blackout dates and minimum-night stays are hotel booking. We capture a move-in **month** on a lead form; a native month input covers it, and a booking engine contradicts the enquiry-only decision |
