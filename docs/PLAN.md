# Safe Heaven Accomodations — Build Plan (v1)

**Status:** planning · not started
**Repo:** `safe_heaven_accomodations` (Next.js 16.2.6, React 19.2.4, Tailwind v4, TS, App Router, `src/`)
**Source of truth:** `Safe_Haven_Website_Requirements.docx` v1.0
**Last updated:** 2026-09-15

---

## 0. Answers to the open questions (locked)

| # | Question | Decision |
|---|---|---|
| 1 | Properties at launch | **< 50** → fetch on server, filter client-side. No search infra needed. |
| 2 | Content | **Placeholder seed data**, swapped later via CMS. |
| 3 | Brand / naming | **Keep existing** logo + "Safe Heaven Accomodations" spelling as in repo. |
| 4 | Infra | **Supabase** (Postgres) + **Cloudinary** (images) — free tiers. |
| 5 | Email | Notifications to **abhi108akj@gmail.com**. |
| 6 | Region | **India only.** INR, IST, Indian phone format. |
| 7 | Legal pages | **Skipped for v1.** |
| 8 | Gender-preference filter | **Not applicable.** |
| 9 | Ownership | **Personal project** — no client review cycle, no fixed deadline. |
| 10 | CMS users | **Single admin role.** |

Carried over from earlier: Payload CMS + Postgres · leads in DB + Resend email · all must-haves + FAQ + property detail · keep current palette, rebuild as a design system · enquiry-only booking, no payments.

---

## 1. "Is a backend needed?"

**Yes — but not a separate backend project.** Everything runs inside the one Next.js app you already have.

Three requirements in the doc cannot be met by a static frontend:

1. **§3.5 CMS** — staff must add properties, change pricing, and toggle Sold Out / Available without a developer. That needs a database and an admin UI.
2. **§4.4 Booking form** — leads must be *stored*, not just emailed, plus a team notification and a user confirmation.
3. **§4.3 Catalogue** — filters, sort, pagination and property detail pages all read from that same data.

The current `formsubmit.co` → Gmail setup satisfies none of these: nothing is stored, nothing is queryable, and you can't report on conversions.

### How it's arranged

```
┌──────────────────── ONE Next.js app (Vercel) ────────────────────┐
│                                                                  │
│  Public site              Payload CMS              Server logic  │
│  /  /about  /properties   /admin  (admin UI)       server actions│
│  /properties/[slug]       /api/*  (auto REST)      /api/leads    │
│  /community /contact /faq                          email sending │
│                                                                  │
└───────┬──────────────────────┬───────────────────────┬───────────┘
        │                      │                       │
   Supabase Postgres      Cloudinary               Resend
   (properties, leads)    (images/gallery)         (notifications)
```

- **Payload 3** is a set of routes mounted *inside* your Next app — not a second server, not a second deploy.
- **Supabase** is used as a plain managed Postgres (connection string only). Not using Supabase Auth/Row-Level-Security; Payload handles auth and access control.
- Nothing extra to host. `npm run dev` still starts everything.

**Verified:** `@payloadcms/next@3.89.0` peer range is `next: >=16.2.6 <17.0.0`. Your repo pins `next@16.2.6` — exact fit, no downgrade needed.

---

## 2. Final stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.2.6 (App Router) | already installed |
| UI | React 19.2.4 + Tailwind v4 | already installed |
| CMS | Payload 3.89.0 | admin at `/admin`, runs in-app |
| DB | Supabase Postgres via `@payloadcms/db-postgres` | use the **pooler** connection string on Vercel |
| Media | Cloudinary via `payload-cloudinary` (community, v2.3.0) | fallback below |
| Email | Resend + React Email templates | see caveat §7.4 |
| Forms | react-hook-form + zod | shared schema client + server |
| Maps | Google Maps embed iframe | no API key needed for basic embed |
| Analytics | GA4 + GTM | Phase 6 |
| Hosting | Vercel | free tier fine at this scale |

**No** Redux/Zustand, no tRPC, no separate API layer — server components + server actions cover it.

---

## 3. Data model (Payload collections)

**`properties`** — the spine of the site
`name, slug, city (rel), locality, addressLine, lat, lng, shortDescription, description (rich text), heroImage, gallery[], amenities[] (rel), roomTypes[] { type: single|double|triple|dorm, occupancy, monthlyRent, securityDeposit, inclusions[], availability }, nearbyLandmarks[] { name, distance }, houseRules (rich text), status: available|sold_out|coming_soon, featured (bool), startingPrice (auto-computed from roomTypes), seo { title, description, ogImage }`

**`cities`** — `name, slug, state, featured` (keeps the filter dropdown consistent; enables `/properties?city=…` and future city landing pages)

**`amenities`** — `name, slug, iconKey, category` (global list so icons + filters never drift)

**`leads`** — every booking popup + contact form submission
`fullName, phone, email, property (rel, nullable), city, moveInDate, roomTypePreference, message, source (url/page the popup was opened from), type: booking|contact, status: new|contacted|converted|lost, internalNotes, createdAt`

**`testimonials`** — `name, role/college, quote, photo, rating, featured`

**`faqs`** — `question, answer (rich text), category, order`

**`communityPosts`** — `title, date, coverImage, gallery[], excerpt, body` (events, resident spotlights)

**`media`** — Cloudinary-backed upload collection (alt text **required** — forces a11y + SEO)

**`users`** — admin only, single role

**Globals:**
- `siteSettings` — phone, email, WhatsApp number, socials, business hours, address
- `homePage` — hero headline/subhead/image, "Why Safe Haven" highlights, how-it-works steps, CTA copy
- `aboutPage`, `communityPage` — editable copy blocks

**Access control:** public read on published content; write = authenticated admin only; `leads` = create-public, read/update admin-only.

---

## 4. Route map

```
/                        Home
/about                   About
/properties              Catalogue (filters, sort, pagination)
/properties/[slug]       Property detail
/community               Community
/contact                 Contact
/faq                     FAQ
/admin/**                Payload admin
/api/**                  Payload REST (auto) + lead handler
sitemap.xml, robots.txt
not-found.tsx            404
```

Booking popup is a **global modal**, not a route — opened from any CTA, pre-filled with property context.

---

## 5. Phases, in build order

> **Superseded by [`todo/TODO.md`](../todo/TODO.md).** That file is the live
> backlog and holds only what is still open; finished work is in the git
> history, and the decisions worth keeping from it are in `AGENTS.md`. What
> follows here is the original plan — useful for the data model and the
> reasoning behind the ordering, not for tracking work.


### Phase 0 — Foundation & risk spike ⚠️ *do first*
| | Task |
|---|---|
| 0.1 | **Spike:** install Payload 3.89 + `@payloadcms/db-postgres`, boot `/admin` against Supabase, confirm Next 16.2.6 compatibility end-to-end. Gate for everything else. |
| 0.2 | Create Supabase project, Cloudinary account, Resend account. Wire `.env.local` + commit `.env.example`. |
| 0.3 | Repo hygiene: fix `layout.tsx` metadata (still says "Create Next App"), rewrite README, add `src/components/`, `src/lib/`, `src/payload/`, route group `src/app/(site)/`. |
| 0.4 | Read `node_modules/next/dist/docs/` for API drift before writing any Next-specific code (per `AGENTS.md`). |

**Done when:** `/admin` loads, a test collection saves to Supabase, `npm run build` passes.

---

### Phase 1 — Design system & app shell
| | Task |
|---|---|
| 1.1 | Lift current palette into Tailwind v4 `@theme` tokens (sky/orange/slate, radii, shadows, DM Sans + Playfair). One source of truth. |
| 1.2 | Primitives: `Button`, `Badge`, `Card`, `Input`, `Select`, `DatePicker`, `Modal`/`BottomSheet`, `Container`, `SectionHeading`, `AmenityIcon`. |
| 1.3 | `Header` (sticky, real routes, Book Now, mobile drawer) + `Footer` (sitemap, contact, socials) in a shared layout. |
| 1.4 | Split today's 333-line `"use client"` `page.tsx` into server components with small client islands. Critical for SEO. |

**Done when:** every route renders the same shell; no visual regression vs today's page.

---

### Phase 2 — Content model in Payload
| | Task |
|---|---|
| 2.1 | Implement all collections + globals from §3, with access control. |
| 2.2 | Cloudinary media adapter + image sizes/transformations. |
| 2.3 | Seed script: ~10 placeholder properties across 2–3 cities, 8 testimonials, 12 FAQs, amenity list. Re-runnable. |
| 2.4 | Typed data layer `src/lib/queries.ts` using Payload **Local API** (direct DB, no HTTP hop) + `revalidateTag` on publish. |

**Done when:** you can add a property in `/admin`, mark it Sold Out, and see it reflected on the site.

---

### Phase 3 — Catalogue + Property detail 🎯 *highest business value*
| | Task |
|---|---|
| 3.1 | `/properties`: filter panel (city, room type, budget slider, amenities, move-in date), sort (price ↑↓, newest, featured), grid/list toggle, friendly empty state. |
| 3.2 | Filters synced to URL query params → shareable links, back-button works, and Home's quick-search can deep-link with filters pre-applied. Server-fetch all (<50), filter in browser. |
| 3.3 | `/properties/[slug]`: gallery + lightbox, room-type & pricing table, amenities grid, map + nearby landmarks, house rules, Sold Out state, related properties. |
| 3.4 | "Book Now" on card + detail page opens popup pre-filled with property name. |
| 3.5 | `generateStaticParams` + ISR so detail pages are static but refresh on CMS publish. |

**Done when:** a visitor can browse → filter → open a property → hit Book Now.

---

### Phase 4 — Booking popup + lead pipeline
| | Task |
|---|---|
| 4.1 | Global modal state (context) — opens from header, hero, cards, detail pages. Bottom-sheet on mobile, centred dialog on desktop. Focus trap + ESC + scroll lock. |
| 4.2 | Fields per §4.4: name, phone, email, city/property (pre-filled), move-in date, room type, message. zod schema shared client + server. |
| 4.3 | Server action → insert `leads` row → Resend notification to abhi108akj@gmail.com → in-modal success state (no redirect). |
| 4.4 | Spam control: honeypot field + IP rate limit. No captcha (friction). |
| 4.5 | WhatsApp click-to-chat — floating button + inline option in the modal, pre-filled message incl. property name. |
| 4.6 | Applicant confirmation email — **built but env-gated**, see §7.4. |
| 4.7 | Retire `formsubmit.co`. |

**Done when:** a submission appears in `/admin` → Leads *and* in the inbox within seconds.

---

### Phase 5 — Remaining pages
| | Task |
|---|---|
| 5.1 | **Home** rebuilt to §4.1: hero + CTA, quick search bar → catalogue, Why Safe Haven (4 icons), featured properties from CMS, community teaser, testimonials from CMS, how-it-works (3–4 steps), secondary CTA. |
| 5.2 | **About** (§4.2): story, differentiators, values, optional team, CTA to catalogue. |
| 5.3 | **Community** (§4.5): overview, gallery, event highlights from `communityPosts`, resident spotlights, guidelines, CTA. |
| 5.4 | **Contact** (§4.6): form → `leads` (type=contact) with subject dropdown, direct details, WhatsApp, Google Map embed, hours, socials. |
| 5.5 | **FAQ** (§5.1): accordion, CMS-driven, grouped by category. |

---

### Phase 6 — SEO, analytics, performance, accessibility
| | Task |
|---|---|
| 6.1 | Per-route `generateMetadata`, OG images, canonical URLs. |
| 6.2 | JSON-LD: Organization, LocalBusiness/Accommodation per property, FAQPage, BreadcrumbList. |
| 6.3 | `sitemap.ts` (dynamic, incl. property slugs) + `robots.ts`. |
| 6.4 | GA4 + GTM + Search Console verification. Track `booking_modal_open` and `lead_submit`. |
| 6.5 | Perf: `next/image` with Cloudinary loader, lazy galleries, font `display: swap`, Lighthouse ≥ 90 mobile. |
| 6.6 | A11y: keyboard nav, focus states, contrast audit, labelled inputs, alt text enforced at CMS level. |
| 6.7 | `not-found.tsx`, `loading.tsx`, `error.tsx`. |

---

### Phase 7 — Launch
| | Task |
|---|---|
| 7.1 | Vercel project, env vars, Supabase prod DB, Payload migrations. |
| 7.2 | Swap placeholder content for real properties + photos. |
| 7.3 | Domain + DNS; verify sending domain in Resend; flip on confirmation emails. |
| 7.4 | Short admin guide: how to add a property, upload photos, mark Sold Out, read leads. |
| 7.5 | Smoke checklist + Supabase backup schedule. |

---

## 6. Deferred (post-v1 backlog)

Online payments / token booking (Razorpay) · resident portal · referral programme · blog / SEO hub · partner-with-us page · chatbot or WhatsApp Business API · legal pages (privacy, terms, refund) · cookie consent · testimonials as a standalone page · multi-role CMS users · multi-city landing pages · virtual tours.

---

## 7. Risks & things that will bite

**7.1 Payload ↔ Next 16 — LOW but gating.**
Peer range checks out (`>=16.2.6 <17`), but this is a new Next major. Phase 0.1 exists to prove it in ~30 minutes.
*Fallback:* Supabase JS client + a hand-built `/admin` (more work, less polish), or pin Next to 15.4.x.

**7.2 Cloudinary adapter is community-maintained — MEDIUM.**
`payload-cloudinary` is third-party; official Payload adapters are S3/Azure/GCS/Vercel Blob/Uploadthing.
*Fallback:* use the **official `@payloadcms/storage-s3`** pointed at **Supabase Storage**, which is S3-compatible. That drops Cloudinary entirely — one less vendor, one less account, still free (1 GB). Worth deciding in Phase 0.

**7.3 Supabase free tier pauses after ~7 days of inactivity — MEDIUM.**
A paused project makes `/admin` and the site 500. Needs a scheduled ping, or accept manual un-pausing during quiet periods.

**7.4 Resend can only send from a verified domain — HIGH for §4.4.**
Without a domain, Resend's test sender delivers **only to your own account email**. So: team notifications to abhi108akj@gmail.com will work immediately; **automatic confirmation emails to enquirers will not** until a domain is bought and verified. Plan: build the confirmation email, keep it behind `RESEND_FROM`, enable at Phase 7.3. Until then the modal's success message carries the promise instead.

**7.5 Next 16 API drift — MEDIUM.**
`AGENTS.md` warns this Next differs from training data. Rule: consult `node_modules/next/dist/docs/` before using any Next API, every phase.

**7.6 Serverless + Postgres connections — LOW.**
Use Supabase's **pooler** connection string on Vercel, direct connection only for migrations.

---

## 8. Environment variables

```
DATABASE_URI=                  # Supabase pooler connection string
PAYLOAD_SECRET=                # random 32+ chars
NEXT_PUBLIC_SERVER_URL=
CLOUDINARY_CLOUD_NAME=         # (or S3_* if we take fallback 7.2)
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
RESEND_FROM=                   # blank until domain verified
LEAD_NOTIFY_EMAIL=abhi108akj@gmail.com
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
```

---

## 9. What's needed from you before Phase 0 starts

1. **Supabase** project created → connection string (pooler + direct).
2. **Cloudinary** account → cloud name, API key, secret — *or* approve the Supabase Storage fallback (§7.2) and skip Cloudinary.
3. **Resend** account → API key.
4. **WhatsApp number** for click-to-chat (the existing `8273458926`?).

I can scaffold Phase 0.3–0.4 (repo hygiene, structure) without any of these.

---

## 10. Sequencing note

Phases 3 and 4 are the conversion path — browse, decide, enquire. If time compresses, ship **0 → 1 → 2 → 3 → 4 → 5.1 (Home)** and let About / Community / FAQ follow after launch. The one order that must not change: **2 before 3** — building catalogue UI before the content model is settled means rewriting it.
