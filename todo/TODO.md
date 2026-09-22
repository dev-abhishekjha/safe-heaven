# Safe Heaven — what is left

The only backlog. Finished work is not tracked here: it is in the git history,
and the decisions worth keeping from it now live in
[`AGENTS.md`](../AGENTS.md) under **Stack decisions on record**.

Items keep their original `E<epic>.<n>` ids, because code comments refer to
them by those ids.

**As of 2026-09-22** the site is deployed and live, the database is connected,
the CMS is populated, the enquiry pipeline has been proven end to end with a
real submission, and every colour pair meets WCAG AA with a check that fails
the build if that stops being true. What remains is not structural.

Grouped by **what is blocking each item**, because that is the only grouping
that helps — almost nothing left is hard, most of it waits on a decision, a
photograph, or an account only you can create.

| | Section | Items |
|---|---|---|
| 1 | [Do first](#1-do-first) | 3 |
| 2 | [Content only you have](#2-content-only-you-have) | 16 |
| 3 | [Accounts and services](#3-accounts-and-services) | 11 |
| 4 | [Engineering, ready to pick up](#4-engineering-ready-to-pick-up) | 5 |
| 5 | [Blocked on real photos](#5-blocked-on-real-photos) | 7 |
| 6 | [Built, not verified](#6-built-not-verified) | 17 |

A few items appear twice where they genuinely block two things, so 59 lines is
not 59 separate pieces of work.

## The thing to keep in mind

**The site looks finished and is not.** Every page falls back to seed copy that
reads exactly like real copy, so nothing on screen tells you which claims are
confirmed and which were drafted. Section 2 is what closes that gap, and
`E15.1` in particular lists sentences published in your name that nobody has
checked.

---

## 1. Do first

Three items. None takes long, and the site should not be shown to real
students until they are done.

- [ ] **Rotate the database password** — `E16.6`

  The current one was pasted into a chat transcript several times during
  debugging. It is the production database, and two real enquiries are in it.

  Supabase → Settings → Database → Reset database password, then update
  `DATABASE_PASSWORD` in Vercel and in `.env.local`. Nothing else changes:
  `DATABASE_URI` carries the literal word `ignored` where a password would go,
  specifically so this is a one-variable rotation.

- [ ] **Add the Resend variables to Vercel** — `E16.15`, unblocks `E5.9`

  `RESEND_API_KEY`, `RESEND_FROM`, `LEAD_NOTIFY_EMAIL`, all Production.

  Enquiries save correctly and notify nobody. Two leads are already sitting in
  the database unread. This is the only open item actively costing business.

- [ ] **Log in to `/admin` and read the leads** — `E16.18`

  `/admin` serves a login form rather than Payload's create-first-user screen,
  so the panel is claimed and not open to whoever finds it. Still unconfirmed:
  that the credentials work, and that the two saved leads are readable with the
  right phone number and room type.

---

## 2. Content only you have

Sixteen items, and the real launch gate. None of this can be written, guessed
or generated — each one is a fact about a building and the people in it.

### Confirm what is already published in your name

- [ ] **Confirm the invented facts** — `E15.1`

  CCTV, the warden, what rent includes, housekeeping frequency, power backup,
  the callback time, visiting hours. These are on the live site now, drafted
  from plausible assumptions. Each is a promise a resident can hold you to.

- [ ] **Confirm the house rules** — `E15.14`

  Gate hours, guest policy, who cleans what. A rule the building does not
  actually enforce is the first thing a resident quotes back at you.

- [ ] **Confirm the nearby places and distances** — `E15.13`

  Only Knowledge Park II, Pari Chowk, Ram-Eesh and Galgotias are on record. The
  hospital and shopping categories are empty and the page hides them rather
  than inventing entries, so adding real rows makes those sections appear.

- [ ] **Confirm the community categories and ground rules** — `E15.15`

  What the WhatsApp group is actually used for, and what gets someone removed.
  Currently a best guess.

- [ ] **Sign off the About values, and decide on stats** — `E15.16`

  The three values are published in your name. The stats block stays empty
  until a number is both true and worth printing.

### Write

- [ ] **Origin story paragraph** — `E15.6`

  The About page's `intro`. Deliberately not seeded, because a placeholder
  there would look finished. It currently shows a loud "not written yet" block.

- [ ] **Seven FAQ answers** — `E15.8`

  What does the rent include? · Is there a security deposit, and is it
  refundable? · Is the room furnished? · What notice before leaving? · Can I
  have visitors? · Is there a gate timing or curfew? · Is food or a mess
  included?

  Only confirmed answers reach the page and the `FAQPage` structured data, so
  these seven are invisible to visitors right now.

- [ ] **Founder photos, names, roles, bios** — `E15.5`

- [ ] **Decide the food/mess question** — `E15.10`

  Competitors lead with it. The site says nothing at all, which readers will
  assume means no.

### Collect

- [ ] **Photos — building exterior** — `E15.2`
- [ ] **Photos — each room type** — `E15.3`
- [ ] **Photos — common areas, study room, kitchen, terrace** — `E15.4`

- [ ] **Three to five real resident testimonials** — `E15.7`

  With written permission to publish name and college. The section renders
  nothing at all until real ones exist, rather than inventing praise.

- [ ] **WhatsApp community invite link** — `E15.9`

  Until it exists the join card renders an honest alternative state — asking
  you for the link — rather than a button that goes nowhere.

- [ ] **Final phone number and email** — `E15.11`

  The current ones are placeholders. They live in exactly one place
  (`src/utils/SiteConfig.ts`) plus the `site-settings` global, so this is one
  edit rather than a hunt.

- [ ] **Replace seed data with the real thing** — `E15.12`

  The wrap-up: once the above are in the CMS, the hardcoded fallbacks become a
  safety net rather than the site.

---

## 3. Accounts and services

Eleven items. All of them are you signing in somewhere and creating something.
None is code. Several unblock work elsewhere in this file.

### Domain and email

- [ ] **Buy the domain and point DNS at Vercel** — `E16.1`

  The site is on `safe-heaven-theta.vercel.app`. The sending domain, Search
  Console, the Business Profile and the OG images all want a real one, so this
  goes first.

- [ ] **Verify the sending domain in Resend** — `E16.5`, unblocks `E5.11`

  The applicant confirmation email is written and env-gated off. It stays dead
  until a verified domain exists, because mail from an unverified sender lands
  in spam and does more harm than sending nothing.

### Analytics

Nothing below can happen before a container exists. `trackEvent` already wraps
every event and no-ops silently without one, so the code side is done.

- [ ] **Google Tag Manager container** — `E13.2`
- [ ] **GA4 property** — `E13.1`
- [ ] **Search Console verification** — `E13.3`

- [ ] **Wire the events** — `E13.4`

  `popup_open`, `popup_dismiss`, `enquiry_submit`, `whatsapp_click`,
  `call_click`, `community_join`.

- [ ] **Mark `enquiry_submit` as a conversion** — `E13.5`

  Without this the whole setup measures traffic rather than enquiries, which is
  the only number that matters here.

- [ ] **Google Business Profile** — `E12.9`

  Off-site, and for "PG near Knowledge Park II" it will almost certainly
  outrank the website itself. Worth more than most of the on-site SEO work.

### Keeping it alive

- [ ] **Supabase backup schedule** — `E16.9`

  There are real leads in there now, and no backup.

- [ ] **Uptime monitor** — `E16.10`

  Also catches the free-tier Supabase project pausing, which would take the
  enquiry form down silently.

- [ ] **Delete `DIAG_TOKEN` from Vercel if it is still there** — `E16.13`

  The `/diag` route is gone, so the variable does nothing. A stale secret is
  still a stale secret.

---

## 4. Engineering, ready to pick up

Five items that need nothing from you.

- [ ] **Admin handover guide** — `E16.8`

  How to add a room, upload photos, mark one sold out, read leads, and what to
  do when a deploy fails. Matters the first day someone other than you runs
  this, and the deployment has hard-won specifics that live nowhere except
  `AGENTS.md`.

- [ ] **Smoke-test checklist** — `E16.7`

  Every CTA, both form paths, six routes, mobile and desktop. Written for you
  to run. It also closes most of section 6 in one pass, which makes it the
  highest-leverage item here.

- [ ] **`revalidateTag` on publish** — `E3.19`

  All six content routes use ISR at 60 seconds, so a CMS edit appears within a
  minute. Tag-based revalidation makes it instant. Worth doing before anyone
  else is editing content and wondering why their change has not shown up.

- [ ] **Local SEO copy pass** — `E12.8`

  "PG in Greater Noida", "boys hostel near Knowledge Park II", the campus
  names. Careful work, since the constraint is no invented facts and no prices
  — so it is phrasing what is already true, not adding claims.

- [ ] **`loading` boundaries** — `E14.10`

  `not-found` and `error` exist; `loading` does not. Matters less with static
  pages, but shows on `/admin` and any dynamic route.

---

## 5. Blocked on real photos

Seven items. All of them measure or optimise images, and the site has none —
every image slot renders a `PlaceholderImage`. Doing these now means tuning
against grey boxes and redoing it the day real photographs land.

Wait for `E15.2`–`E15.4`.

- [ ] **`next/image` everywhere with correct `sizes`** — `E14.1`

  `sizes` has to match the real layout at each breakpoint. It cannot be written
  correctly until the images it describes exist.

- [ ] **Lazy-load the galleries and the map** — `E14.2`

- [ ] **CLS audit** — `E14.5`

  The hero and the gallery are the usual culprits, and both are fixed-height
  placeholders today, so the current score means nothing.

- [ ] **Lighthouse mobile ≥ 90** — `E14.4`

  Most traffic is phones. Photographs are what will move this number, in either
  direction.

- [ ] **OG images** — `E12.2`

  The card that appears when someone shares the link on WhatsApp — which, for
  this audience, is how most people will first see the site.

- [ ] **Confirm the image pipeline end to end** — `E4.3`, `E4.5`

  Four sizes are generated and each derivative is re-encoded to WebP; uploads
  are restricted to jpeg/png/webp/avif with a 15 MB cap. Both were written
  against the generated types and neither has been proven with a real file.
  One upload confirms the first, one oversized file the second.

- [ ] **Cross-browser check** — `E14.11`

  Chrome, Safari, Edge, Firefox, latest two. Worth doing once, with real
  content, rather than twice.

---

## 6. Built, not verified

Seventeen items that are written, reviewed and believed to work, but have never
been exercised by a person. The risk here is different from unfinished work:
these will probably pass, and the ones that do not will fail in ways nobody has
imagined.

**Most of this closes in one sitting.** One test enquiry through the popup and
one through the contact form covers the majority — which is what the
smoke-test checklist (`E16.7`) is for.

### The enquiry path

- [ ] **Shared zod schema, client and server** — `E5.1` · name and phone
      required, everything else optional
- [ ] **Mobile bottom-sheet variant** — `E5.4`
- [ ] **Global open state** — `E5.5` · opened from every CTA
- [ ] **Pre-fill from context** — `E5.6` · room type carried from the card you
      clicked on the Property page
- [ ] **Auto-open rules** — `E5.7` · delay after arrival plus exit intent, once
      per visitor, remembered in localStorage. Test this deliberately: getting
      it wrong is the most annoying possible bug
- [ ] **In-modal success state** — `E5.10` · echoes what they asked for, no
      redirect
- [ ] **Honeypot field** — `E5.12` · submit with the hidden field filled and
      confirm it reports success while writing nothing
- [ ] **WhatsApp deep link** — `E5.15` · pre-filled message including room type
- [ ] **Contact form with subject dropdown** — `E10.2`
- [ ] **The `formsubmit.co` form is really gone** — `E5.16`

### Email

- [ ] **Team notification** — `E5.9` · blocked on `E16.15`, section 1
- [ ] **Applicant confirmation** — `E5.11` · blocked on `E16.5`, a verified
      Resend domain

### Content plumbing

- [ ] **Seed script** — `E3.17` · ran successfully on 2026-09-21. Re-running it
      after anyone edits in `/admin` overwrites those edits, which is worth
      knowing before the second run
- [ ] **FAQs grouped by category from the CMS** — `E11.2`
- [ ] **Community join event** — `E8.7` · cannot fire until both the invite
      link (`E15.9`) and an analytics container (`E13`) exist

### Admin

- [ ] **Credentials work and leads are readable** — `E16.18` · also section 1
- [ ] **Upload validation rejects an oversized file** — `E4.5`
