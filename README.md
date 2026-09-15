# Safe Heaven Accomodations

Website for Safe Heaven Accomodations — student housing and co-living. Visitors
browse properties, compare rooms and pricing, and submit a booking enquiry; staff
manage listings, availability and leads through a built-in CMS.

## Stack

| Layer     | Choice                                              |
| --------- | --------------------------------------------------- |
| Framework | Next.js 16.2.6 (App Router, `src/`)                 |
| UI        | React 19, Tailwind CSS v4, TypeScript               |
| CMS       | Payload 3 — mounted in-app at `/admin`              |
| Database  | Supabase Postgres (`@payloadcms/db-postgres`)       |
| Media     | Supabase Storage via the S3-compatible adapter      |
| Email     | Resend                                              |
| Hosting   | Vercel                                              |

There is no separate backend service. The CMS, the REST API and the lead
handling all run inside this one Next.js application.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin _(available from T2 onward)_

## Scripts

| Command         | Purpose                     |
| --------------- | --------------------------- |
| `npm run dev`   | Development server          |
| `npm run build` | Production build            |
| `npm run start` | Serve the production build  |
| `npm run lint`  | ESLint                      |

## Project structure

```
src/
  app/                 routes, layouts, route handlers
  components/
    ui/                primitives (Button, Card, Modal, ...)
    layout/            Header, Footer, shell
    sections/          composed page sections
  lib/                 data access, helpers, validation schemas
  payload/
    collections/       Payload collection configs
    globals/           Payload global configs
docs/
  PLAN.md              phased build plan and decisions
```

## Working on this repo

`AGENTS.md` applies: this is Next.js 16, whose APIs differ from earlier
versions. Check `node_modules/next/dist/docs/` before using a Next API.

The build plan, data model and phase order live in [`docs/PLAN.md`](docs/PLAN.md).

## Environment variables

See [`.env.example`](.env.example). `.env.local` is git-ignored.

## Deployment

Vercel, with Supabase for the database and Supabase Storage for media.
Deployment steps are covered in T23 of the plan.
