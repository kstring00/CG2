# Common Ground

A white-label parent navigation platform for autism families.

Common Ground gives caregivers clear next steps, a local resource directory, and
real support — free, with no account required. It ships brand-neutral: any
clinic, nonprofit, or health system can deploy it under their own name, phone
number, and domain without touching application code.

> Common Ground is currently optimized for desktop and laptop. Mobile
> responsiveness is a planned future pass.

## White-labeling

Every deployment-specific value lives in one place: [`src/config/site.ts`](src/config/site.ts),
which exports a single `SITE` object. Defaults are in
[`src/config/site.defaults.json`](src/config/site.defaults.json) so the Node
build scripts in `/scripts` read the same values without duplicating them.

Nothing else in the codebase hardcodes an organization name, phone number,
email, or domain.

| Environment variable | `SITE` key | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_ORG_NAME` | `orgName` | `Common Ground` |
| `NEXT_PUBLIC_SITE_URL` | `domain` | `https://commonground.example` |
| `NEXT_PUBLIC_SITE_PHONE` | `phone` | `+10000000000` ⚠️ placeholder |
| `NEXT_PUBLIC_SITE_PHONE_DISPLAY` | `phoneDisplay` | `(000) 000-0000` ⚠️ placeholder |
| `NEXT_PUBLIC_SITE_EMAIL` | `email` | `hello@commonground.example` ⚠️ placeholder |
| `NEXT_PUBLIC_SITE_FIRST_CALL_PROVIDER_ID` | `firstCallProviderId` | `null` |
| `NEXT_PUBLIC_SITE_LOGO_SRC` | `logoSrc` | `/logos/common-ground-mark.png` |

The phone and email defaults are deliberately obvious placeholders so a
misconfigured deploy fails loudly rather than shipping a wrong number to
families in crisis. **Set them before going live.**

`firstCallProviderId` is optional. Set it to an `id` from
[`src/lib/providers.ts`](src/lib/providers.ts) when the deployment has an
affiliated clinic it wants families routed to first; leave it unset and the
copy falls back to neutral "your clinic" language and directory-wide guidance.

Swapping the logo: replace `public/logos/common-ground-mark.png`, or point
`NEXT_PUBLIC_SITE_LOGO_SRC` at your own asset. The favicon, Apple touch icon,
PWA icons, and Open Graph image are generated from that mark — regenerate them
if you change it.

## The two layers

The product is intentionally split into two distinct experiences. This
separation is the core of the product strategy, and the code structure mirrors
it:

| Layer | Route | Who it is for | Visual cue |
|-------|-------|---------------|------------|
| **Free Parent Support** | `/support/*` | Every family — Medicaid, waitlist, pre-diagnosis, not-yet-enrolled. No account required. | Green "Free · open to everyone" chip, emerald banner at the top of every page |
| **Client Portal** | `/client` (gate) → `/client/portal`, `/client/care-plan`, `/client/progress`, `/client/coaching`, `/client/messages` | Families already enrolled with the operating provider. Content is personalized, HIPAA-scoped, tied to a BCBA-authored care plan. | Accent chip, lock iconography, accent banner at the top of every page |

### What lives in each layer

**Free (`/support`)**
- Guided next steps (stage-based)
- Resource library
- Sensory-friendly local guide
- Community (local groups, events, online spaces — non-HIPAA, general support)
- Help & hotlines

**Client (`/client/*`)**
- Portal home ("this week with your child")
- Care plan (BCBA-authored goals)
- Progress (session data in plain language)
- Parent coaching (modules tied to current goals)
- Secure messaging with BCBA / RBT
- (Future) AI companion grounded in the child's real plan

### What was intentionally removed from the free layer
- AI companion — moved to client portal roadmap (needs real plan data to be safe)
- Direct parent-to-parent matching ("Connect") — replaced with moderated
  Community browsing; 1:1 matching is a harder trust/safety problem for a
  public layer

## Provider directory

`src/lib/providers.ts` and `src/lib/data.ts` contain a verified directory of
real organizations in the Greater Houston / Texas area. Entries are third-party
resources, not advertisements — the app does not claim any provider evaluates,
treats, or waitlists faster than another. Copy steers parents toward *questions
to ask* rather than toward a particular vendor.

If you deploy outside Texas, replace the directory data. The UI, filtering, and
"start here" routing are geography-agnostic.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Type:** Fraunces (display) + Inter (body) via `next/font/google`
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Language:** TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No database and no required env vars for local development — unset values fall
back to the placeholder defaults above.

Optional integrations:

| Variable | Enables |
|---|---|
| `OPENAI_API_KEY` | `/api/chat` ABA guide assistant |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | care-plan email + weekly nudge |

## Project Structure

```
src/
├── config/
│   ├── site.ts                     # ⭐ SITE object — all white-label values
│   └── site.defaults.json          # shared defaults (app + build scripts)
│
├── app/
│   ├── page.tsx                    # Landing page — "two doors" IA
│   ├── layout.tsx                  # Root layout + fonts + metadata
│   ├── not-found.tsx               # 404
│   ├── globals.css                 # Tailwind + brand styles
│   ├── icon.png / apple-icon.png   # generated from the brand mark
│   ├── opengraph-image.png         # 1200×630 social card
│   ├── robots.ts / sitemap.ts / manifest.ts
│   │
│   ├── support/                    # 🌐 FREE layer — open to everyone
│   │   ├── layout.tsx              # Uses SupportShell
│   │   ├── page.tsx                # Free area home
│   │   ├── resources/              # Curated library
│   │   ├── sensory-friendly/       # Local guide
│   │   ├── community/              # Groups & events
│   │   └── help/                   # Hotlines, respite, advocacy
│   │
│   └── client/                     # 🔒 PRIVATE layer — sign-in required
│       ├── page.tsx                # Sign-in gate
│       └── (portal)/               # Route group — uses ClientShell
│           ├── portal/             # Portal home
│           ├── care-plan/          # BCBA goals
│           ├── progress/           # Session data
│           ├── coaching/           # Parent modules
│           └── messages/           # Secure messaging
│
├── components/
│   ├── brand/BrandLogo.tsx         # reads SITE.logoSrc + SITE.orgName
│   ├── layout/
│   │   ├── SupportShell.tsx        # Free-area nav (emerald cues)
│   │   └── ClientShell.tsx         # Client-portal nav (accent cues)
│   └── ui/
│       ├── LayerBadges.tsx         # FreeBadge + ClientOnlyBadge primitives
│       ├── ClientDemoBanner.tsx    # "Prototype preview" notice
│       ├── DemoDataNotice.tsx
│       └── TrustPanel.tsx
└── lib/
    ├── data.ts                     # Stage content + resource types
    ├── providers.ts                # Verified directory + first-call resolution
    └── utils.ts                    # cn(), formatDate(), etc.
```

## Worksheets

`npm run care-plan:worksheets` regenerates the eight fillable PDFs into
`public/worksheets/` (gitignored — they are build output). Each carries
`SITE.orgName` as its header and PDF `/Author`.

Several of the eight ship as pre-built PDF blobs rather than being laid out at
build time. Their text lives inside content streams that are ASCII85-encoded
and then Flate-compressed, so `scripts/pdf-brand.mjs` decodes each stream
through its declared filter chain, rewrites the brand, re-encodes it, and
rebuilds the xref table (byte offsets shift, so the table has to be regenerated).

`scripts/verify-worksheet-branding.mjs` runs on every `predev` and `prebuild`
and fails the build if any worksheet still carries legacy brand text or the
retired brand red in its header mark. It decodes the filter chains before
checking — a plain grep over these PDFs reports "clean" on a page that visibly
reads the old brand name, which is exactly how this shipped broken once.

## Brand Palette

| Token | Hex | Usage |
|---|---|---|
| `brand-navy-500` / `primary` | `#1a2e52` | Primary actions, links |
| `brand-plum-500` | `#703068` | Secondary accent |
| `brand-purple-500` | `#32175a` | Tertiary accent |
| `brand-teal-500` / `accent` | `#0F6E56` | CTAs, client portal accent |
| `brand-warm-*` | cool neutral tints | Backgrounds |
| `brand-muted-*` | greys | Text, borders |

Crisis and safety UI uses Tailwind's default `rose-*`, deliberately kept outside
the brand scale so it reads as a safety signal rather than brand colour.

The free layer adds **emerald** (Tailwind default) for "open to everyone"
signals. The client portal leans on **teal accent** for "personal to your
family" signals. This contrast is intentional and the two palettes should not
mix within a page.
