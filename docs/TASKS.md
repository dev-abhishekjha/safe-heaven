# Safe Heaven Accomodations — Task Breakdown

Working backlog for the website build. Parent tickets (**epics**) hold subtasks; pick one
subtask at a time, top to bottom.

- **Supersedes** the T1–T23 phase list in [`PLAN.md`](PLAN.md). PLAN.md still holds the
  architecture, data-model reasoning and risk notes — this file holds the work.
- **Design reference:** the published canvas (9 artboards — Home desktop/mobile, Home enquiry
  popup, Property, Community, About Us, Contact Us, Enquiry form states, Style tile).
- **Last updated:** 2026-09-16

## Where things stand — 2026-09-16

| | Meaning | Count |
| --- | --- | --- |
| `[x]` | Built and verified | 111 |
| `[~]` | Built, cannot be verified until Postgres connects | 22 |
| `[!]` | Blocked on credentials, content or a decision | 29 |
| `[ ]` | Not started | rest |

**One blocker dominates.** The database has never connected, so nothing that
reads or writes data has actually run: the content model, the repositories and
the whole enquiry pipeline are written and type-checked but unexercised. Every
page from E6 to E11 is waiting on the same thing.

**The second blocker is content** (E15) — photos, founder bios, the origin
story, real testimonials, the WhatsApp invite link, and confirmation of the
drafted claims in E15.1. No amount of code substitutes for these.

## Status legend

| Mark | Meaning |
| --- | --- |
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Done |
| `[!]` | Blocked — reason noted inline |
| `[-]` | Dropped / out of scope |

## Project facts these tasks assume

| | |
| --- | --- |
| Property | One building — Mitra Enclave, Sector P7, Near Pari Chowk, Greater Noida |
| Residents | Boys only |
| Rooms | Single, double, triple |
| Pricing | Not shown on site — "rent shared on enquiry" |
| Payments | None, ever, on the website. Enquiry → callback → WhatsApp |
| Nav | Home · Property · Community · About Us · FAQ · Contact Us |
| Stack | Next.js 16.2.6, React 19, Tailwind v4, Payload 3.89, Supabase Postgres + Storage, Resend, Vercel |
| Contact | +91 82734 58926 · safehaven25482@gmail.com (both change later) |

---

# E0 — Foundation

Repo, CMS and database standing up. Everything else depends on this.

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E0.1** Repo hygiene & structure | Metadata, self-hosted fonts, folder layout, `.env.example`, README |
| `[x]` | **E0.2** Install Payload 3.89 + Postgres adapter | `payload.config.ts`, Users collection |
| `[x]` | **E0.3** Mount admin + API routes | `(payload)` route group, import map, `withPayload`. Two defects found on first real boot: the missing `'use server'` directive, and `@payloadcms/next/css` never imported — the panel rendered as unstyled HTML |
| `[x]` | **E0.4** Split app into `(frontend)` / `(payload)` route groups | Payload needs its own root layout |
| `[x]` | **E0.5** Verify `/admin` boots against Supabase | Confirmed 2026-09-16: panel loads and lists every collection against Supabase |
| `[x]` | **E0.6** Create the first admin user | Confirmed 2026-09-16 |
| `[x]` | **E0.7** Confirm `npm run dev` + `npm run build` on macOS | Confirmed 2026-09-16: dev server boots, all six routes return 200, production build passes |
| `[x]` | **E0.8** Add `.nvmrc` / engines field | `.nvmrc` = 22 and `engines.node >= 22`, so Vercel builds on the same major you develop on |

**Done when:** `/admin` loads, you can log in, and a test record saves to Supabase.

---

# E1 — Design system

Tokens and primitives. Build once, reuse on every page. No page work starts before E1.4.

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E1.1** Colour tokens in Tailwind `@theme` | sky (tint/icons/links), orange (the only action colour), slate, WhatsApp green |
| `[x]` | **E1.2** Type scale tokens | Display 52/36 Playfair; body 16/1.75, card 20, eyebrow 11 @ 0.2em DM Sans |
| `[x]` | **E1.3** Radius, shadow and spacing tokens | 999px pills · 20px panels · 16–18px cards · 12px inputs |
| `[x]` | **E1.4** `Container` + `SectionHeading` + `Eyebrow` | 120px desktop gutter, 20px mobile |
| `[x]` | **E1.5** `Button` — primary / secondary / tertiary / disabled | Plus hover + focus-visible rings |
| `[x]` | **E1.6** `Badge` — available / few left / sold out / placeholder | |
| `[x]` | **E1.7** `Card` / `Panel` surfaces | Bordered, tinted and dark variants |
| `[x]` | **E1.8** Icon set as inline SVG components | Stroke 1.5, 24px grid. Shield, metro, pin, wifi, bed, cap, cart, hospital, phone, mail, clock, WhatsApp, check, arrow, chevron, close |
| `[x]` | **E1.9** `Input`, `Textarea`, `Select` | Rest / focus / error states |
| `[x]` | **E1.10** `PhoneInput` with fixed `+91` prefix | 10-digit validation, numeric keypad on mobile |
| `[x]` | **E1.11** `ChipGroup` for room type | Single / Double / Triple / Not sure |
| `[x]` | **E1.12** `MonthPicker` for move-in | Month granularity is enough — don't ask for a date |
| `[x]` | **E1.13** `Modal` + `BottomSheet` primitive | Built on Radix Dialog (E1.16) — focus trap, ESC, scroll lock and focus restore come for free |
| `[x]` | **E1.14** `PlaceholderImage` | Dashed box + label, so missing photos are obvious before launch |
| `[x]` | **E1.15** `DistanceList` | Name + distance rows with dividers; used on Home and Contact |
| `[x]` | **E1.16** Install `@radix-ui/react-dialog` + `@radix-ui/react-accordion` | **Do this first in E1** — E1.13 and E11.1 build on it. Headless, ~15 KB, Tailwind styles it normally. Drop it and hand-roll if you'd rather carry no extra dependency |

**Done when:** the style tile artboard can be rebuilt from components alone.

---

# E2 — App shell & routing

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E2.1** Route skeleton | `/`, `/property`, `/community`, `/about`, `/faq`, `/contact` |
| `[x]` | **E2.2** `Header` — desktop | Logo, 6 nav items, active underline, phone, Book a Visit |
| `[x]` | **E2.3** Sticky header behaviour | Shadow on scroll, no layout shift |
| `[x]` | **E2.4** Mobile drawer | 44px hit targets, one-hand reach, closes on route change |
| `[x]` | **E2.5** `Footer` | Address, pages, contact, nearest metro, "social coming soon" |
| `[x]` | **E2.6** Mobile sticky action bar | Call · WhatsApp · Book a Visit |
| `[x]` | **E2.7** Floating WhatsApp button — desktop | |
| `[x]` | **E2.8** Convert existing `page.tsx` to server components | Currently 333 lines of `"use client"` — hurts SEO |
| `[x]` | **E2.9** Skip link + landmark roles | |
| `[x]` | **E2.10** Active-route highlighting | Shared helper, not per-page copies |

**Done when:** every route renders the same shell and the nav marks where you are.

---

# E3 — Content model (Payload)

The spine. E6–E11 all read from here.

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E3.1** `media` upload collection | Alt text **required** at the CMS level |
| `[x]` | **E3.2** `property` collection | Name, slug, address, geo, description, hero, gallery, house rules, status. One row for now — collection not global, so a second building needs no rewrite |
| `[x]` | **E3.3** `roomTypes` | Type, occupancy, inclusions, furnishing list, availability, order, gallery |
| `[x]` | **E3.3a** Internal-only `monthlyRent` + `securityDeposit` on `roomTypes` | Visible in `/admin` so staff can quote from it; **never rendered on the site**. Keeps the enquiry-only decision while giving the team one place to look |
| `[x]` | **E3.4** `amenities` | Name, icon key, category — keeps icons and wording consistent |
| `[x]` | **E3.5** `nearbyPlaces` | Name, category (university / metro / hospital / shopping), distance, order |
| `[x]` | **E3.6** `leads` | Name, phone, email, roomType, moveIn, message, source, type (booking\|contact), status, notes |
| `[x]` | **E3.7** `testimonials` | Name, college, quote, photo, featured |
| `[x]` | **E3.8** `faqs` | Question, answer, category, order |
| `[x]` | **E3.9** `communityPosts` | Title, date, cover, gallery, excerpt — events and spotlights |
| `[x]` | **E3.10** `founders` | Name, role, photo, bio, LinkedIn, email, order |
| `[x]` | **E3.11** `siteSettings` global | Phone, email, WhatsApp number, **WhatsApp community invite link**, hours, address, socials |
| `[x]` | **E3.12** `homePage` global | Hero copy, why-us items, how-it-works steps |
| `[x]` | **E3.13** `aboutPage` global | Story, stats (nullable — strip hides when empty) |
| `[x]` | **E3.14** `communityPage` global | Intro, "what gets shared" items, ground rules |
| `[x]` | **E3.15** Access control | Public read on published; admin-only write; `leads` create-public, read admin-only |
| `[x]` | **E3.16** Admin panel grouping + labels | Content / Enquiries / Settings — non-technical staff have to navigate this |
| `[~]` | **E3.17** Seed script | Written as `npm run seed` — re-runnable, field-verified against the generated types. Skips the origin story and unconfirmed FAQ answers on purpose. Needs you to run it |
| `[x]` | **E3.18** Repository layer under `src/repositories/` | Payload Local API, no HTTP hop — see AGENTS.md layering |
| `[!]` | **E3.19** Cache tags + `revalidateTag` on publish | Interim: all six content routes now use ISR at 60s, so a CMS edit appears within a minute. Tag-based `revalidateTag` would make it instant |
| `[x]` | **E3.20** Wire every page to the repositories | New `pageContentService` maps CMS rows to the shapes components already take, and falls back to seed content when a table is empty or the database is unreachable. All six pages now read from the CMS |

**Done when:** you can change a room's availability in `/admin` and see it on the site.

---

# E4 — Media storage

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E4.1** Create Supabase Storage bucket + S3 credentials | Bucket `media`, keys generated, S3 protocol enabled |
| `[x]` | **E4.2** Wire `@payloadcms/storage-s3` | Verified 2026-09-16: uploaded through `/admin`, file landed in the Supabase `media` bucket |
| `[x]` | **E4.2a** Supabase-specific S3 client config | Verified by a real upload. Endpoint is `<ref>.**storage**.supabase.co/storage/v1/s3` — the extra segment matters. `forcePathStyle: true` set |
| `[~]` | **E4.3** Image sizes + WebP/AVIF | Four sizes generated; each derivative now re-encoded to WebP, original left in its uploaded format. Needs one upload to confirm |
| `[x]` | **E4.4** `next.config.ts` remote patterns | Both Supabase hosts allowed — the S3 protocol host and the public object host are different |
| `[~]` | **E4.5** Upload validation | Mime allowlist narrowed from `image/*` to jpeg/png/webp/avif (SVG is a script-injection vector), plus a 15 MB cap in a beforeValidate hook. Needs one oversized file to confirm |

---

# E5 — Enquiry & lead pipeline

The conversion path. Highest business value after E3.

| | Task | Notes |
| --- | --- | --- |
| `[~]` | **E5.1** zod schema shared client + server | Name + phone required; everything else optional |
| `[x]` | **E5.2** `EnquiryForm` component | Name, phone, email, room type chips, move-in month, message. Submitted end to end on the live site |
| `[x]` | **E5.3** Desktop dialog variant | Two-column: reasons left, form right. Success state confirmed on the live site — it echoes the name and the number it will call |
| `[~]` | **E5.4** Mobile bottom-sheet variant | |
| `[~]` | **E5.5** Global open state | Context provider, opened from every CTA |
| `[~]` | **E5.6** Pre-fill from context | Room type from the Property page card you clicked |
| `[~]` | **E5.7** Auto-open rules | Delay after arrival + exit intent, **once per visitor**, remembered in localStorage |
| `[x]` | **E5.8** Server action → write `leads` row | **Verified in production 2026-09-21.** A submission on the live site took `leads` from 0 to 1 |
| `[!]` | **E5.9** Resend notification to the team | **Wired but dead in production.** No `RESEND_*` variable and no `LEAD_NOTIFY_EMAIL` exist on Vercel, so the lead saved on 2026-09-21 notified nobody. Blocked on E16.15 |
| `[~]` | **E5.10** In-modal success state | Echoes what they asked for. No redirect |
| `[~]` | **E5.11** Applicant confirmation email | **Env-gated** — dead until a domain is verified in Resend |
| `[~]` | **E5.12** Honeypot field | |
| `[x]` | **E5.13** IP rate limiting | Sliding window, 5 per 10 minutes, keyed by a SHA-256 of the IP salted with the app secret — the raw address is never stored. Per-instance, so a speed bump rather than a wall; the comment says so |
| `[x]` | **E5.14** Error + retry states | A rejected server action no longer becomes an unhandled rejection. New `SubmitError` offers retry, phone and WhatsApp, and nothing typed is cleared |
| `[~]` | **E5.15** WhatsApp deep link | Pre-filled message including room type |
| `[~]` | **E5.16** Delete the `formsubmit.co` form | |
| `[x]` | **E5.17** Admin leads view | Columns, `-createdAt` sort, searchable by name/phone/email/message, status filter via the Filters menu |

**Done when:** a submission lands in `/admin → Leads` and in the inbox within seconds.

---

# E6 — Home page

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E6.1** Hero | Hero, location card on the photo, phone line under the CTAs |
| `[x]` | **E6.2** Trust strip | Full-bleed band under the hero — metro, security, inclusions |
| `[x]` | **E6.3** Why Safe Haven — 4 items | Four value cards, copy still marked E15.1 |
| `[x]` | **E6.4** Room preview — 3 cards | "Rent shared on enquiry" on every card; CTA pre-fills the room type |
| `[x]` | **E6.5** Location block | Renders only categories that have rows — hospitals/shopping wait on E15.4 |
| `[x]` | **E6.6** Community teaser + WhatsApp band | Teaser + WhatsApp band with a pre-filled first message |
| `[x]` | **E6.7** How booking works — 3 steps | Step 3 states in words that nothing is paid on this website |
| `[x]` | **E6.8** Testimonials | Built; returns null while no quotes are published (E15.7) |
| `[x]` | **E6.9** Closing CTA band | Dark closing band — enquiry + phone |
| `[x]` | **E6.10** Mobile layout pass | Checked at 390px and 1280px: no horizontal overflow, one h1 |

---

# E7 — Property page

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E7.1** Page intro | Existing intro kept; page now has one h1 and a real structure under it |
| `[x]` | **E7.2** "Included in every rent" strip — 5 icons | Five-icon band from `RENT_INCLUSIONS` — the shared seed, not a restatement |
| `[x]` | **E7.3** Room block — single | Alternating block, `id="single"` so `/property#single` lands on it |
| `[x]` | **E7.4** Room block — double | Photo on the opposite side; same component |
| `[x]` | **E7.5** Room block — triple | Same component again |
| `[x]` | **E7.6** Availability badges from CMS | Badge tone read straight off `availability` — CMS values map with no lookup |
| `[~]` | **E7.7** Photo gallery + lightbox | Built: Radix focus trap, Escape, wrapping arrow keys, focus restored. NOT click-tested — see below |
| `[x]` | **E7.8** Comparison table — desktop | Real `<table>` with caption and row headers; verified visible at 1280px |
| `[x]` | **E7.9** Comparison — stacked cards on mobile | Stacked cards at 390px, 5 rows each, driven by the same `COMPARISON_ROWS` |
| `[x]` | **E7.10** House rules section | Four rules, all drafted — E15.14 |
| `[x]` | **E7.11** CTA band | Now a shared `CtaBand`; the home page uses it too |

---

# E8 — Community page

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E8.1** Hero | Intro kept, minus the unverified campus count; join card sits directly under it |
| `[x]` | **E8.2** WhatsApp join card | Reads `COMMUNITY.inviteUrl` from config. No link yet, so it asks you to message us rather than offering a dead button |
| `[x]` | **E8.3** "What gets shared" — 4 cards | Four concrete categories — still need your confirmation (E15.15) |
| `[x]` | **E8.4** Ground rules — 3 items | Three numbered rules, each with its reason |
| `[x]` | **E8.5** Gallery from `communityPosts` | Built; returns null while `community-posts` is empty |
| `[x]` | **E8.6** CTA band | Shared `CtaBand` |
| `[~]` | **E8.7** Track `whatsapp_community_join` | Event wired via `trackEvent`, which no-ops without a GTM container. Cannot fire until both the invite link (E15.9) and a container (E13) exist |

---

# E9 — About Us page

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E9.1** Hero + origin story | Structure done. Story slot renders a loud "not written yet" block — E15.6 is the only thing left |
| `[x]` | **E9.2** Stats strip | Hides itself while `STATS` is empty, and it is empty on purpose |
| `[x]` | **E9.3** Founder cards from CMS | Cards built; shows two marked skeletons until E15.5 supplies names, roles and bios |
| `[x]` | **E9.4** Values — 3 items | Three values, each restating a rule the rest of the site keeps — sign-off is E15.16 |
| `[x]` | **E9.5** CTA band | Shared `CtaBand` |

---

# E10 — Contact Us page (contact + location merged)

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E10.1** Hero | Form and details side by side — neither path makes you scroll past the other |
| `[~]` | **E10.2** Contact form with subject dropdown | Built on the shared `contactSchema` + `submitContactAction`; in-place success state. The `leads` write itself is unverified until Postgres connects |
| `[x]` | **E10.3** Contact details panel | Address, phone, email, hours — all from `SiteConfig`, phone and email tappable |
| `[x]` | **E10.4** WhatsApp card | WhatsApp panel with a pre-filled first message |
| `[x]` | **E10.5** Social placeholder block | One quiet line while `SOCIALS` is empty, rather than dead icons |
| `[x]` | **E10.6** Google Maps embed + "Open in Maps" | Iframe only mounts on click — verified absent from the server HTML. "Open in Maps" always available |
| `[x]` | **E10.7** Distance tables from CMS | Reads the shared `src/content/places.ts`; hides categories with no confirmed rows |
| `[x]` | **E10.8** Mobile pass | Verified at 390px: no overflow, one h1 |

---

# E11 — FAQ page

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E11.1** Accordion component | New `Accordion` on Radix — roving arrow keys, Home/End, correct ARIA, real buttons |
| `[~]` | **E11.2** CMS-driven, grouped by category | Grouping and category order built and working; still fed by the seed until `getFaqsByCategory()` can reach Postgres |
| `[x]` | **E11.3** Draft the starting questions | 14 questions drafted. 7 answered from rules the site already keeps; 7 marked as needing you (E15.8) |
| `[x]` | **E11.4** `FAQPage` JSON-LD | Publishes ONLY confirmed answers — verified: 7 questions in the JSON-LD, none of the unconfirmed ones |

---

# E12 — SEO & structured data

| | Task | Notes |
| --- | --- | --- |
| `[x]` | **E12.1** Per-route `generateMetadata` | |
| `[ ]` | **E12.2** OG images | |
| `[x]` | **E12.3** `Organization` + `LocalBusiness` JSON-LD | Address, geo, hours, phone |
| `[x]` | **E12.4** `BreadcrumbList` JSON-LD | |
| `[x]` | **E12.5** `sitemap.ts` | |
| `[x]` | **E12.6** `robots.ts` | |
| `[x]` | **E12.7** Canonical URLs | |
| `[ ]` | **E12.8** Local SEO copy pass | "PG in Greater Noida", "boys hostel near Knowledge Park II", campus names |
| `[ ]` | **E12.9** Google Business Profile | Off-site, but it outranks the website for local searches |

---

# E13 — Analytics

| | Task | Notes |
| --- | --- | --- |
| `[!]` | **E13.1** GA4 | |
| `[!]` | **E13.2** Google Tag Manager | |
| `[!]` | **E13.3** Search Console verification | |
| `[!]` | **E13.4** Events | `popup_open`, `popup_dismiss`, `enquiry_submit`, `whatsapp_click`, `call_click`, `community_join` |
| `[!]` | **E13.5** Mark `enquiry_submit` a conversion | |

---

# E14 — Performance & accessibility

| | Task | Notes |
| --- | --- | --- |
| `[ ]` | **E14.1** `next/image` everywhere, correct `sizes` | |
| `[ ]` | **E14.2** Lazy-load galleries and the map | |
| `[ ]` | **E14.3** Font preload, `display: swap` | Already self-hosted |
| `[ ]` | **E14.4** Lighthouse mobile ≥ 90 | Most of your traffic is phones |
| `[ ]` | **E14.5** CLS audit | Hero and gallery are the usual culprits |
| `[ ]` | **E14.6** Keyboard nav + visible focus | Popup, drawer, accordion, lightbox |
| `[ ]` | **E14.7** Contrast audit | **Measured: white on `--color-action` #f97316 is 2.80:1 — fails WCAG AA (needs 4.5:1).** Every primary button on the site is affected. #ea580c is 3.56:1, #c2410c is 5.18:1. The admin panel already uses #c2410c; the site needs a decision — darken the action colour, or use dark text on orange. Slate-400 labels still to check |
| `[ ]` | **E14.8** Screen-reader labels on icon-only buttons | |
| `[ ]` | **E14.9** `prefers-reduced-motion` | |
| `[~]` | **E14.10** `not-found`, `loading`, `error` boundaries | |
| `[ ]` | **E14.11** Cross-browser check | Chrome, Safari, Edge, Firefox — latest 2 |

---

# E15 — Content population

Not code. Blocks launch harder than anything above.

| | Task | Notes |
| --- | --- | --- |
| `[!]` | **E15.1** Confirm the invented facts | CCTV, warden, inclusions, housekeeping frequency, power backup, callback time, visiting hours — listed on the design canvas |
| `[!]` | **E15.2** Photos — building exterior | |
| `[!]` | **E15.3** Photos — each room type | |
| `[!]` | **E15.4** Photos — common areas, study room, kitchen, terrace | |
| `[!]` | **E15.5** Founder photos, names, roles, bios | |
| `[!]` | **E15.6** Origin story paragraph | |
| `[!]` | **E15.7** Collect 3–5 real resident testimonials | With permission to publish name + college |
| `[!]` | **E15.8** FAQ answers | |
| `[!]` | **E15.9** WhatsApp community invite link | |
| `[!]` | **E15.10** Decide the food/mess question | Clanbridge leads with it; we currently say nothing |
| `[!]` | **E15.11** Final phone number and email | Current ones are placeholders |
| `[!]` | **E15.12** Replace seed data with the real thing | |
| `[!]` | **E15.13** Confirm the nearby-place list and distances | Full campus list, plus hospitals and shopping. Only Knowledge Park II, Pari Chowk, Ram-Eesh and Galgotias are on record — the home page hides the categories it has no rows for rather than guessing |
| `[!]` | **E15.14** Confirm the house rules | Gate hours, guest policy and who cleans what are drafted. A rule the building does not enforce is the first thing a resident quotes back |
| `[!]` | **E15.15** Confirm the community categories and ground rules | What the group is actually used for, and what gets someone removed. Currently my best guess |
| `[!]` | **E15.16** Sign off the About values, and decide on stats | The three values are published in your name. Stats stay empty until a number is both true and worth printing |

---

# E16 — Launch

| | Task | Notes |
| --- | --- | --- |
| `[!]` | **E16.1** Buy domain + DNS | |
| `[x]` | **E16.2** Vercel project + env vars | Deployed 2026-09-21 to safe-heaven-theta.vercel.app. 10 env vars set. `NEXT_PUBLIC_*` must be Config not Secret — Vercel refuses, correctly, since they are inlined into the browser bundle |
| `[x]` | **E16.3** Supabase production DB | Production runs on the same Supabase project, session pooler 5432 |
| `[x]` | **E16.4** Payload migrations for production | Initial migration generated (35 tables) and applied by `build:deploy` on the first successful deploy |
| `[!]` | **E16.5** Verify sending domain in Resend | Unblocks E5.11 |
| `[!]` | **E16.6** Rotate the database password | Current one was pasted in chat — dev only |
| `[!]` | **E16.7** Smoke-test checklist | Every CTA, both form paths, all six routes, mobile + desktop |
| `[!]` | **E16.8** Admin handover guide | Add a room, upload photos, mark sold out, read leads |
| `[!]` | **E16.9** Supabase backup schedule | |
| `[!]` | **E16.10** Uptime monitor | Also catches the free-tier project pausing |
| `[x]` | **E16.11** Decide the production pooler mode | Transaction pooler (6543) for the app, session pooler (5432) for migrations via `DATABASE_DIRECT_URI`. Right for serverless on its own merits, and that is the only reason it stands — the failure it was originally adopted to fix turned out to be `max: 1` (E16.12), not the pooler. The `prepare: false` warning does not apply: the adapter is node-postgres |
| `[x]` | **E16.12** "timeout exceeded when trying to connect" | **Closed. One cause, not three: `max: 1`.** A pool of one starved every caller that needed a second connection — a request rendering the home page fires four queries through `Promise.all`, and `payload migrate` needs one for Payload's init and another for the migration runner. The queued caller waits out `connectionTimeoutMillis` and reports a message that reads like a network failure. Runtime was fixed by `max: 10` in c65fad0; migrations stayed broken until 5e18181 because they were still pinned to 1. Reproduced on a laptop that could reach the database in 446ms, fixed, and confirmed by `migrate:status` connecting and by a Vercel `build:deploy` passing. The session pooler, the transaction pooler and the Supabase incident were all red herrings. Not re-tested, and not worth re-testing: session pooler with `max: 10` |
| `[x]` | **E16.13** Delete the `/diag` route | **Done 2026-09-21.** Route, `.env.example` entry and both `scripts/check-*` diagnostics removed. `DIAG_TOKEN` still has to be deleted from Vercel by hand — the route is gone, so it does nothing, but a stale secret is still a stale secret |
| `[x]` | **E16.20** Reconcile `payload_migrations` | **Done 2026-09-21.** The `dev` / `batch -1` push marker is deleted and `20260921_190119_icon_options` is recorded as batch 2. Baselined rather than run, because the migration is `ALTER TYPE ... ADD VALUE` with no `IF NOT EXISTS` and push had already applied the labels. The statement asserted that all five enums actually carried `shopping` and `hospital` before writing anything, so the ledger is not claiming something that is not true. `migrate:status` connects now, which is also the proof that the `max: 5` fix works |
| `[x]` | **E16.14** Restore `build:deploy` as the Vercel build command | **Done 2026-09-21.** Deployment green with migrations running in Vercel's build container — the one network path `/diag` could not measure |
| `[!]` | **E16.15** Add the Resend variables to Vercel | `/diag` reported no environment variable beginning with `RESEND`, and `LEAD_NOTIFY_EMAIL` is absent too. Enquiries can now be saved, but **nobody is told one arrived** |
| `[x]` | **E16.16** Seed the production CMS | **Done 2026-09-21.** 1 property, 3 room types, 5 amenities, 4 nearby places, 7 FAQs, plus the home and community globals — counted back out of Postgres, not assumed. Left unseeded on purpose: the About origin story (E15.6), 7 unconfirmed FAQ answers (E15.8), the community highlights and every photo |
| `[x]` | **E16.17** Confirm a real enquiry is stored | **Done 2026-09-21.** `leads` went 0 → 1 after one submission on the live site. The write path, the transaction and the success state are all confirmed. What this did NOT prove: the notification email (E5.9, no Resend variables on Vercel), the honeypot (E5.12), the contact form (E10.2), or that the row is readable in `/admin` (E16.18) |
| `[~]` | **E16.18** Log in to `/admin` in production | `/admin` serves a LOGIN form, not Payload's create-first-user screen, so an account already exists and the panel is not open to whoever finds it. Still to confirm: that the credentials work, and that the lead from E16.17 is readable in the Leads list |
| `[x]` | **E16.19** One source for the contact number | `SiteConfig.ts` called itself the single source, but `leadService.ts` and `emailClient.ts` had the number typed into three user-facing strings and the address into a fourth. E15.11 says both change later, so those four would have gone stale silently on the day they did. They now read `CONTACT` and `ADDRESS`. Generated migrations are excluded from Biome for the same reason `payload-types.ts` already is |

---

# E17 — Post-launch backlog

Not scheduled. Listed so they don't get lost.

| | Task |
| --- | --- |
| `[ ]` | Legal pages — privacy, terms, refund policy |
| `[ ]` | Cookie consent (DPDP) |
| `[ ]` | Online token payment to hold a room (Razorpay) |
| `[ ]` | Resident portal — rent, maintenance requests |
| `[ ]` | Referral programme page |
| `[ ]` | Blog / SEO hub — city guides, student budgeting |
| `[ ]` | Second property + the catalogue UI that needs |
| `[ ]` | Multi-role CMS users |
| `[ ]` | Virtual tour / video walkthrough |
| `[ ]` | Hindi language toggle |

---

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

## Suggested order

```
E0 ─▶ E1 ─▶ E2 ─▶ E3 ─▶ E4 ─▶ E5 ─▶ E6 ─▶ E7 ─▶ E8 ─▶ E9 ─▶ E10 ─▶ E11 ─▶ E12 ─▶ E13 ─▶ E14 ─▶ E16
                                                 └── E15 runs in parallel from here ──┘
```

Two rules worth not breaking:

1. **E3 before E6–E11.** Building pages before the content model is settled means rewriting them.
2. **E5 early, not late.** The enquiry popup is the only thing on this site that makes money.
   It should work before the About page is pretty.

If the timeline compresses, ship **E0 → E5 + E6 + E7** and let Community, About and FAQ follow
after launch. Those pages are additive; the browse-and-enquire path is not.

## Definition of done (every subtask)

- TypeScript clean, ESLint clean, `npm run build` passes
- Works at 390px and 1440px
- Keyboard reachable, visible focus
- No hardcoded content that belongs in the CMS
- No invented facts that E15.1 hasn't confirmed
