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
Backlog: [`docs/TASKS.md`](docs/TASKS.md) — pick one subtask at a time.

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
docs/                  PLAN.md, TASKS.md
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
  `docs/TASKS.md` under E15.1.

## Accessibility

- Modals and accordions build on Radix primitives — do not hand-roll focus
  traps, scroll lock or ARIA wiring.
- Minimum 44px hit targets on mobile.
- Every icon-only control needs an accessible name.
- Keyboard reachable with visible focus, at 390px and 1440px.
