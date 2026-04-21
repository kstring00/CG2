# Common Ground — Demo

A parent support platform concept for autism families, by Texas ABA Centers.
This is a self-contained demo with mock data — no backend, no auth, no
environment variables required.

## The two layers

The product is intentionally split into two distinct experiences. This
separation is the core of the product strategy, and the code structure mirrors
it:

| Layer | Route | Who it is for | Visual cue |
|-------|-------|---------------|------------|
| **Free Parent Support** | `/support/*` | Every family in Texas — Medicaid, waitlist, pre-diagnosis, not-yet-enrolled. No account required. | Green "Free · open to everyone" chip, emerald banner at the top of every page |
| **Client Portal** | `/client` (gate) → `/client/portal`, `/client/care-plan`, `/client/progress`, `/client/coaching`, `/client/messages` | Families already enrolled with Texas ABA Centers. Content is personalized, HIPAA-scoped, tied to a BCBA-authored care plan. | Accent-red "Client portal · sign-in required" chip, lock iconography, accent banner at the top of every page |

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

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Texas ABA Centers brand palette)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Language:** TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

That's it — no env vars, no database, no setup needed.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page — "two doors" IA
│   ├── layout.tsx                  # Root layout + fonts
│   ├── globals.css                 # Tailwind + brand styles
│   │
│   ├── support/                    # 🌐 FREE layer — open to everyone
│   │   ├── layout.tsx              # Uses SupportShell
│   │   ├── page.tsx                # Free area home
│   │   ├── next-steps/             # Stage-based guidance
│   │   ├── resources/              # Curated library
│   │   ├── sensory-friendly/       # Local guide
│   │   ├── community/              # Groups & events
│   │   └── help/                   # Hotlines, respite, advocacy
│   │
│   └── client/                     # 🔒 PRIVATE layer — sign-in required
│       ├── page.tsx                # Sign-in gate
│       └── (portal)/               # Route group — uses ClientShell
│           ├── layout.tsx
│           ├── portal/             # Portal home
│           ├── care-plan/          # BCBA goals
│           ├── progress/           # Session data
│           ├── coaching/           # Parent modules
│           └── messages/           # Secure messaging
│
├── components/
│   ├── brand/TexasAbaLogo.tsx
│   ├── layout/
│   │   ├── SupportShell.tsx        # Free-area nav (emerald cues)
│   │   └── ClientShell.tsx         # Client-portal nav (accent cues)
│   └── ui/
│       ├── LayerBadges.tsx         # FreeBadge + ClientOnlyBadge primitives
│       ├── ClientDemoBanner.tsx    # "Prototype preview" notice
│       ├── DemoDataNotice.tsx
│       └── TrustPanel.tsx
└── lib/
    ├── data.ts                     # Mock data + types
    └── utils.ts                    # cn(), formatDate(), etc.
```

## Brand Palette

| Token               | Hex       | Usage                  |
|----------------------|-----------|------------------------|
| `brand-navy-500`     | `#1a3264` | Primary actions, links  |
| `brand-red-500`      | `#c8364c` | Accent, CTAs, client portal |
| `brand-burgundy-500` | `#8c2040` | Secondary accent        |
| `brand-purple-500`   | `#3c2264` | Tertiary accent         |
| `brand-warm-500`     | `#f0cf8e` | Warm backgrounds        |

The free layer adds **emerald** (Tailwind default) for "open to everyone"
signals. The client portal leans on the existing **accent** red for "personal
to your family" signals. This contrast is intentional and the two palettes
should not mix within a page.
