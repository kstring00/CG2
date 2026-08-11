# Common Ground — Full Findings

**Audited:** commit `45c9499`, 2026-08-02
**Method:** source read of all 37 page routes, 3 API routes, and `src/lib` / `src/content` / `src/components`; production build (`next build`, passed); WCAG contrast computed from token values.
**Sorted by severity, not by page.**

Each finding is marked **[verified in code]** or **[inferred]**. Inferred findings are architectural consequences I could not execute against but that follow directly from the code as written.

---

# BLOCKERS

---

## B-1 · Fabricated 30-day mental-health history is generated, persisted, and presented to the caregiver as her own data
**Dimension 1 (Clinical defensibility) / Dimension 3 (Privacy)** — **[verified in code]**

**Where:**
- `src/app/support/mental-health/components/RiskEngine.ts:168-198` — `seedHistory()` builds 30 days of `overall`, `stress`, `anxiety`, `sleep`, `support`, `energy` from `Math.sin`/`Math.cos` plus `Math.random()`
- `src/app/support/mental-health/page.tsx:247-249` — `if (history.length === 0) history = seedHistory();`
- `src/app/support/mental-health/page.tsx:263-266` — auto-saves that fabricated history to `localStorage['cg-history-v2']`
- `src/app/support/mental-health/components/DashboardTab.tsx:359-389` — renders it under **"Patterns worth knowing · From your last 30 days"**
- `src/app/support/mental-health/components/RecommendationsEngine.ts:157-201` — `generateInsights()` computes statistics *from the fabricated series* and states them as fact: `:167` *"Sleep has slipped about N points over the last week"*; `:177` *"On the days you felt most supported, your wellness ran N points higher"*; `:186` *"Stress has been elevated N days in a row. Bodies don't run that hot indefinitely."*

**Why it matters:** A caregiver on her first visit is shown a month of trend data about her own mental health that was invented by a random number generator, attributed to her, and framed with clinical urgency. The "demo view" disclaimer at `page.tsx:377-437` is suppressed the moment `profileSignedIn` is true — but the fabricated rows persist in `localStorage` forever and are never marked as synthetic. Real check-ins are appended to the same array (`page.tsx:233-244`), so after a week the record is a permanent, unlabelled blend of fiction and fact. This is a fabricated health record on a page branded by a clinical provider. It is indefensible in a records request, a complaint, or a deposition.

**Fix:** Delete `seedHistory()` and `anchorTodayInHistory()`. Start every user at `history = []` and let `DashboardTab.tsx:367-371` (which already has a correct empty state) do its job. If a populated demo is needed for sales, put it behind an explicit `?demo=1` route that writes to a separate storage key, never merges with real data, and stamps every row `synthetic: true`. **Requires BCBA sign-off on the replacement empty-state copy.**

---

## B-2 · Absolute privacy claim ("nothing is seen, stored, or monitored") is contradicted by sensitive selections travelling in the URL
**Dimension 3 (Privacy) / Dimension 1 (Disclaimer adjacency)** — **[verified in code]**, log-capture consequence **[inferred]**

**Where:**
- `src/content/carePlan.ts:129-132` — `exactFooter`: *"…Nothing you tap here is seen, stored, or monitored by anyone. If anyone is in immediate danger, call 911."*
- Rendered at `src/app/support/care-plan/page.tsx:66-72`, `src/app/support/care-plan/crisis/page.tsx:124-126`, `src/app/support/intake/page.tsx:58-60`
- `src/lib/buildPlan.ts:111-115` — `standardHref()` encodes every selection as `?team=…&b=…&r=…`
- `src/app/support/care-plan/page.tsx:34` — `export const dynamic = 'force-dynamic'` (every selection is a server round-trip)
- Sensitive row IDs at `src/content/carePlan.ts:575, 632, 751, 826, 888, 945, 998, 1053` — `alone`, `marriage-strain`, `judged`, `cannot-keep-doing`, `nothing-left`, `grieving`, `disappeared`, `thinking-stopping`
- `src/app/privacy/page.tsx:91-96` — the org states it collects "pages visited… device type… general geographic region"

**Why it matters:** A caregiver selects "I can't keep doing this" and the resulting URL is `/support/care-plan?team=no&b=…&r=cannot-keep-doing`. That string is transmitted to the server, written to hosting access logs, captured by whatever analytics is configured, retained in browser history on a shared family device, and leaked in the `Referer` header on any outbound link. The page she is reading tells her, in absolute terms, that none of this happens. The claim is not hedged, and it sits directly beneath the disclosure. This is the single most legally exposed sentence on the site.

**Fix (two parts, both required):**
1. Move selection state out of the URL. Use a POST-and-render or client-side state so the row ID never appears in a request line. The existing `scripts/care-plan-safety-audit.mjs` already forbids `localStorage` in this flow, so client state must be in-memory only — consistent with the guarantee.
2. Rewrite `carePlan.ts:131` to a claim the code supports: *"Your answers are not saved to an account and are not shared with your care team. Like any website, our host records page visits."* **Requires legal review.**

---

## B-3 · Crisis escalation link for self-injury and elopement is a 404; 988 is absent from the page
**Dimension 2 (Safety and crisis routing)** — **[verified in code]**

**Where:**
- `src/app/support/at-home/page.tsx:145` — `<Link href="/support/crisis">Open crisis support</Link>`
- Route does not exist. Filesystem has `src/app/support/care-plan/crisis/page.tsx` → `/support/care-plan/crisis`
- Same line, secondary CTA: `<a href="tel:+18777715725">Talk to someone now</a>` — the Texas ABA Centers admissions line
- Triggered by `src/lib/atHomeMatcher.ts:40-43` — `TIER_ONE_BEHAVIORS = ['hitting', 'leaving', 'throwing', 'self-injury']`
- `grep "tel:988" src/app/support/at-home/page.tsx` → no match

**Why it matters:** This is the exact moment the page is designed for. A caregiver has just told the site her child is hurting themselves or running from the house. The page correctly refuses to hand her a behavior strategy — good clinical judgment — and then routes her to a 404. Her only working option is a business line that does not answer at 2am. The persistent `CrisisPill` in `SupportShell.tsx:318` renders as an unlabelled icon below the `sm` breakpoint (`CrisisPill.tsx:62`), so on a phone there is no visible crisis text on the screen at all.

**Fix:** Change the href to `/support/care-plan/crisis`. Add a direct `tel:988` / `sms:988` pair as the primary action in `SafetyInterstitial`, above the admissions line. Add a build-time assertion that every internal `href` resolves to a route — this class of bug should not be catchable only by audit. **Requires BCBA sign-off on the interstitial's action ordering.**

---

## B-4 · The Mental Health Center's two primary buttons render a blank page
**Dimension 6 (Technical) / Dimension 2 (a caregiver in distress hits a dead screen)** — **[verified in code]**

**Where:**
- `src/app/support/mental-health/page.tsx:64` — `type TabKey = 'dashboard' | 'trends' | 'support'`
- `src/app/support/mental-health/page.tsx:487` — `onNavigate={(tab) => setActiveTab(tab as TabKey)}` (the `as` cast defeats the type check)
- `src/app/support/mental-health/components/DashboardTab.tsx:221` — "New check-in" → `onNavigate('checkin')`
- `src/app/support/mental-health/components/DashboardTab.tsx:215` — "Calming tools" → `onNavigate('calming')`
- `src/app/support/mental-health/components/DashboardTab.tsx:187` — "Start your first check-in" → `onNavigate('checkin')`
- Render guards at `page.tsx:468`, `:492`, `:506` match only `'dashboard'`, `'trends'`, `'support'`

**Why it matters:** `activeTab` becomes `'checkin'`, no guard matches, and every element below the tab bar unmounts. The parent is left staring at a header and three tabs with an empty page. This is the page's headline call to action, and the "Start your first check-in" button on the fresh-start screen — the first thing a new user is asked to do. There is no error, no console warning, no recovery path except noticing the tabs are still clickable.

**Related:** `src/app/support/mental-health/components/CheckInTab.tsx` (217 lines, the actual 4-step check-in with its emoji scale and feeling chips) is imported by nothing. The check-in experience the button promises does not exist in the running app.

**Fix:** Remove the `as TabKey` cast so the compiler catches this. Either restore `CheckInTab` as a real tab or repoint both buttons at `'dashboard'` / `'support'`. Add a `default:` fallback in the tab render so an unknown key can never blank the page.

---

## B-5 · Unvalidated 8-factor instrument classifies caregivers into an "At-risk zone" with no crisis interrupt
**Dimension 1 (Scope of practice) / Dimension 2 (Risk routing)** — **[verified in code]**

**Where:**
- `src/app/support/mental-health/components/RiskEngine.ts:66-89` — `computeRiskScore()`, eight weights (`stress: 0.18`, `anxiety: 0.16`, `sleep: 0.16`, …) with no citation, no validation, no provenance
- `src/app/support/mental-health/components/RiskEngine.ts:95-99` — `riskState()` returns `'Stable'` / `'Watch zone'` / `'At-risk zone'` at fixed cutoffs of 33 and 66
- `src/app/support/mental-health/components/DashboardTab.tsx:234-244` — renders the score as a large animated number out of 100 with a coloured "At-risk zone" pill
- `src/app/support/mental-health/components/RecommendationsEngine.ts:37-45` — the **only** behaviour at `risk > 66` is a card titled *"Today, the goal is just less heavy"* routing to the hard-day script

**Why it matters:** A composite score, a 0–100 scale, threshold bands, and a clinical-sounding label ("At-risk") is the visual and linguistic grammar of a screening instrument. A caregiver reasonably reads "At-risk zone / 24 out of 100" as an assessment finding. It is not one — the weights were chosen by hand and the instrument has never been validated against anything. That is scope-of-practice exposure for a BCBA-led organization that does not license mental-health screening.

The routing compounds it: a user can max out stress, anxiety, overwhelm, and isolation while zeroing sleep, bandwidth, support, and hopefulness — the worst possible profile — and the site's entire response is a suggestion to drop a chore and lie down. There is no interrupt, no 988 surfacing, no acknowledgement that the top band might warrant a human. The `UrgentTab` exists but lives one tab away and is never auto-surfaced.

**Fix:** Remove the numeric score and the zone labels from the caregiver-facing UI, or replace the whole instrument with `src/lib/bandwidth.ts`, which already solves this correctly (see B-6). If any banded output survives, the top band must interrupt the flow with 988 before showing routine content — the pattern at `src/app/support/check-in/page.tsx:153-170` is the right one and already exists in this codebase. **Requires BCBA sign-off.**

---

## B-6 · Two contradictory wellness measurement systems ship simultaneously; the successor module documents the predecessor as removed
**Dimension 1 (Terminology consistency) / Dimension 5 (Contradictory content)** — **[verified in code]**

**Where:**
- `src/lib/bandwidth.ts:1-26` — the module doc states it *replaces* the scattered measurement including "the 8-slider dashboard at `/support/mental-health`" and enumerates what it is not: "Not a diagnosis. Not a mental health score. Not a streak. Not a benchmark. Not a number to chase."
- `src/lib/bandwidth.ts:120-148` — 3 sliders → tiers labelled "Doing well" / "Some strain" / "Stretched thin" / "Today is heavy"
- `src/app/support/mental-health/components/RiskEngine.ts:37-99` — still ships: 8 sliders → 0–100 score → "Stable" / "Watch zone" / "At-risk zone"
- `src/app/support/mental-health/page.tsx:146` + `DashboardTab.tsx:431-434` — a **"day check-in streak"** counter, the exact thing `bandwidth.ts:24` says the product does not do and `voice.md:9` explicitly forbids

**Why it matters:** The same caregiver can complete `/support/check-in` and be told "Doing well," then open `/support/mental-health` and be told "Watch zone," in the same session, with no reconciliation. Two different scales, two different vocabularies, two different theories of what is being measured. A clinician asked which one the family should believe has no answer. The deprecation was documented but never executed, which means the codebase itself asserts that the shipped page should not exist.

**Fix:** Finish the migration `bandwidth.ts` describes. Retire `RiskEngine.ts` and `RecommendationsEngine.ts`, or reduce `/support/mental-health` to a content surface that reads the single canonical `cg.bandwidth.v1` value. Delete the streak counter. **Requires BCBA sign-off on which instrument is canonical.**

---

## B-7 · `/support/financial` ships 24 unresolved `[verify]` placeholders in financial, tax, and eligibility guidance
**Dimension 6 (Craft) / Dimension 1 (Defensibility)** — **[verified in code]**

**Where:** `src/app/support/financial/page.tsx` lines `303, 315, 327, 338, 433, 444, 451, 455, 481, 535, 549, 568, 580, 587, 606, 695, 731, 780, 841, 873, 919, 921, 1160`

Representative:
- `:303` — *"**Wait** Months to about a year [verify]."* (Medicaid waiver)
- `:327` — *"**Wait** 10+ years in most parts of Texas [verify]."*
- `:433` — ABLE Age Adjustment Act *"starting in 2026 [verify effective date]"*
- `:444` — *"currently $18,000 / year per beneficiary [verify for current tax year]"*
- `:919` — *"a defined monthly threshold ($1,550/month in 2024 [verify current-year SGA limit])"*
- `:1160` — state paid-leave list *"(CA, NY, NJ, MA, WA, CT, OR, CO, RI, DC, and others [verify list])"*

**Why it matters:** This page is in the primary navigation as "Paying for Care" (`SupportShell.tsx:64`). Families use these figures to decide when to apply for waivers, how much to contribute to an ABLE account, and whether a working adult child will lose benefits. Several cite 2024 figures in an August 2026 site. The `[verify]` marker is the author telling us the number was never checked — and it is visible to the reader, which reads as either sloppiness or a disclaimer, neither of which is acceptable on a page carrying a clinical brand.

**Fix:** Verify every figure against the current-year source, cite it inline with a date, and add a page-level "figures current as of {date}" stamp. Add a CI check that fails the build on `[verify` in `src/app/**`. Until verified, take the page down rather than publish it. **Requires legal review** (benefits/tax guidance).

---

## B-8 · Privacy policy makes three claims the code contradicts
**Dimension 3 (Privacy and regulatory)** — **[verified in code]**

**Where — claim vs. code:**

| Claim | Location | Contradicted by |
|---|---|---|
| *"We do not collect names, email addresses, phone numbers… The site is fully anonymous to use."* | `privacy/page.tsx:97-100` | `api/email-care-plan/route.ts:19-61` collects an email address **and** the caregiver's selected needs, forwards both to Resend. `api/weekly-nudge/route.ts:30-70` collects an email. `mental-health/components/OnboardingModal.tsx:66-73` collects a first name → `localStorage['cg-name']` (`page.tsx:141, 291`) |
| Third-party table lists **only** OpenAI and Vercel | `privacy/page.tsx:173-175` | **Resend** receives caregiver email addresses and care-plan content (`api/email-care-plan/route.ts:49-61`, `api/weekly-nudge/route.ts:58-70`) and is not disclosed anywhere |
| *"most standard privacy rights… do not apply in practice — we simply don't have personal data associated with you"* | `privacy/page.tsx:218-220` | Same as above; also ignores the Texas Data Privacy and Security Act |
| *"does not create, store, or transmit protected health information"* | `privacy/page.tsx:194-196` | The site stores self-reported anxiety, stress, sleep, isolation, and hopefulness keyed to a first name (`cg-inputs-v2`, `cg-history-v2`, `cg-name`), plus free-text journal entries (`cg-journal`, `CalmingToolsTab.tsx:542-553`) |
| **No mention of client-side storage at all** | entire document | 25+ `localStorage` / `sessionStorage` keys across `mental-health/page.tsx:140-146`, `homeBaseActivity.ts:9-14`, `bandwidth.ts:225`, `carePlanStorage.ts:196`, `useParentContext.ts:13`, `weeklyProgress.ts:38`, `find/page.tsx:352-363`, `CalmingToolsTab.tsx:122/542/821`, `IdentityTopic.tsx:33-51`, `CouplesTopic.tsx:54-67`, `CrisisStrip.tsx:7` |

**Why it matters:** "Fully anonymous" is an absolute claim, in a policy document, on a healthcare brand, that the same repository disproves in two API routes. A caregiver who supplies her email to receive a care plan has done exactly the thing the policy says is impossible. The undisclosed Resend processor is a straightforward vendor-disclosure gap.

**Fix:** Rewrite the "What Information We Collect," "Third-Party Services," and "Your Rights" sections against an actual data inventory. Add a client-side storage section enumerating every key, its purpose, and how to clear it. Add Resend. Remove "fully anonymous." **Requires legal review.**

---

## B-9 · Client portal is publicly reachable, indexable, and contains fabricated clinical detail about a named child and a named BCBA
**Dimension 3 (Regulatory) / Dimension 6 (SEO)** — **[verified in code]**

**Where:**
- `src/app/client/page.tsx:96-102` — the real sign-in button is `disabled` ("production only"); a live "Preview demo family" link goes straight to `/client/portal`. No middleware, no auth, no session anywhere in the repo.
- `src/app/client/(portal)/care-plan/page.tsx:13-35` — hardcoded goals for **"Mateo"** with mastery criteria: *"He does it by himself three sessions in a row"*, *"4 out of 5 mealtimes"*, *"within 3 seconds, 80% of the time"*
- `src/app/client/(portal)/care-plan/page.tsx:44-45, 64` — *"This plan was built by **Dr. Ortiz**"*, *"Behavior specialist (BCBA) — **Dr. Rachel Ortiz**"*
- `src/app/client/(portal)/portal/page.tsx:40-42` — *"Welcome back, **Maria**"*, *"Here's where things stand with **Mateo**"*; `:20-31` fabricated session observations
- `src/app/layout.tsx:38` — `robots: { index: true, follow: true }` globally; the only override in the repo is `welcome/layout.tsx:10`
- Build output confirms `/client/portal`, `/client/care-plan`, `/client/progress` prerender as static public pages

**Why it matters:** Search engines will index a Texas ABA Centers page that reads like a real child's treatment record. `ClientDemoBanner` (`components/ui/ClientDemoBanner.tsx`) does say "Prototype preview," but it renders *below the fold-level headline* and will not appear in a search snippet or a screenshot. A parent, a competitor, or a journalist landing on `/client/care-plan` sees plausible clinical documentation. Separately, the README describes this layer as "HIPAA-scoped" — publishing it unauthenticated invites exactly the wrong inference about the organization's controls.

**Fix:** Add `robots: { index: false, follow: false }` to `client/(portal)/layout.tsx` immediately. Put the portal behind an env-gated flag or basic auth for demos. Move the demo banner above the `<h1>`. **Requires legal review** before any public exposure of the client layer.

---

# HIGH

---

## H-1 · `/support/hard-days` scores a checklist into a "Crisis zone" and answers with generic guidance and a business-hours phone line
**Dimension 2 (Risk collection → generic response)** — **[verified in code]**

**Where:**
- `src/app/support/hard-days/page.tsx:651-665` — 8-item interactive checklist ("You dread waking up in the morning," "You've been crying in private")
- `:672` — renders `"{n} of 8 — Early signals / Moderate depletion / High load / Crisis zone"`
- `:276-294` — `getWarningMessage()` returns fixed copy per band
- `:287` — at 5–6 checked ("High load"), the recommendation is *"consider calling NAMI at 1-800-950-NAMI"*
- `:236` — the page's own resource card correctly states NAMI is **"Mon–Fri, 10am–10pm ET"**
- `:336-338` — the page header: *"This page is for the **2am moments**"*

**Why it matters:** An unvalidated 8-item checklist producing a band labelled "Crisis zone" is a screening output. The site collects the risk signal and returns static text. At the "High load" band the primary referral is a helpline that is closed at the exact hour the page says it exists for — and the copy in `getWarningMessage()` omits the hours that the card 400 lines above gets right. 988 appears in the band-8 message only, as inline text, not as a tappable action.

**Fix:** Make 988 a tappable button in every band from 3 upward. Remove the "Crisis zone" label or replace it with non-clinical language. Never surface a business-hours line as the primary action without its hours attached. **Requires BCBA sign-off.**

---

## H-2 · Recommendation engine states fabricated facts about the caregiver's week
**Dimension 1 (Clinical claims)** — **[verified in code]**

**Where:**
- `src/app/support/mental-health/components/RecommendationsEngine.ts:114` — *"You've had three hard days in a row."* Trigger condition (`:110`) is `inputs.hopefulness < 35` — a single slider position, right now. Nothing about three days is measured.
- `:147-148` — *"Your support score is doing real work. On days you marked support 6+, your wellness ran 12 points higher on average."* Trigger (`:143`) is `risk < 50 && recs.length < 4`. The "12 points" is a hardcoded string. The sliders are 0–100; "6+" refers to a scale that does not exist in this component.
- `:42` — *"You've had a stretch of hard days"* at `risk > 66`, again from a single reading.

**Why it matters:** These read as personalized analysis of the caregiver's history. They are static strings behind unrelated conditions. A parent who has had one bad hour is told she has had three bad days; a parent told a specific statistic about her own data is being shown a number nobody computed. Combined with B-1, the page's entire "insight" layer is fiction presented as observation.

**Fix:** Delete the fabricated temporal and statistical claims. Any statement about a trend must be computed from real entries and gated on sufficient data.

---

## H-3 · Free-layer pages promise a care navigator, a dashboard, and proactive outreach that do not exist
**Dimension 5 (User outcomes) / Dimension 3 (Privacy contradiction)** — **[verified in code]**

**Where:**
- `src/app/support/mental-health/components/UrgentTab.tsx:81-83` — *"Your CG family care navigator can also help you find ongoing support — **message them anytime through your CG dashboard**."* Rendered on the free layer, to users with no account, no navigator, and no dashboard. This is the closing paragraph of the crisis tab.
- `src/app/support/pathfinders/page.tsx:12-15` — *"Reaches out when the data turns — When your check-ins say you're carrying more, you don't have to ask. **They reach out.**"*
- `src/app/support/pathfinders/page.tsx:16-19` — *"Sits in on school meetings if you want. ARD, IEP, 504."*
- `src/components/PathfinderCard.tsx:50-53` — *"A real human who has walked this road… **check in when the weeks get heavy**."* Same file `:11` concedes *"Real Pathfinders are being onboarded now."*
- `src/app/support/hard-days/page.tsx:260-267` — a "Texas ABA Centers — Care Coordinator" resource card with CTA "Talk to your coordinator" → `/support/connect`

**Why it matters:** Two problems, and the second is worse than the first. (1) A caregiver at her lowest point is told to message someone through a dashboard that does not exist — a dead end at the moment of highest need. (2) "Reaches out when the data turns" tells the parent her check-in data is monitored by staff. `SupportShell.tsx:207` tells her on every page that data is "saved privately on this device"; `DashboardTab.tsx:427` says "only you see it." The site simultaneously promises human monitoring and guarantees privacy. Both cannot be true, and the copy that promises monitoring is the copy that sells the product.

**Fix:** Remove the navigator/dashboard reference from `UrgentTab`. Rewrite Pathfinder copy to future tense with an explicit availability statement, and delete "reaches out when the data turns" entirely — it describes a data practice the privacy posture forbids. **Requires legal review** (service-availability representations).

---

## H-4 · WCAG 2.1 AA contrast failures across the muted-text system and every light-tinted card
**Dimension 4 (Accessibility — compliance)** — **[verified in code]** (ratios computed from token hex values)

| Foreground | Background | Ratio | Verdict | Uses |
|---|---|---|---|---|
| `brand-muted-400` `#8f9299` | page `#f2f4f8` | **2.83** | fails at any size | 81 |
| `brand-muted-400` | white | **3.12** | fails normal text | 81 |
| `brand-muted-300` `#b3b5ba` | white | **2.05** | fails at any size | 10 |
| `brand-muted-500` `#6e727a` | page `#f2f4f8` | **4.38** | fails normal text | 160 |
| `--ink-faint` `#B8AE9F` | `--paper` `#FBF7EF` | **2.05** | fails at any size | 14 |
| `--ink-muted` `#897E72` | `--paper` | **3.71** | fails normal text | 49 |
| `--gold` `#B08A3E` | `--watch-bg` `#F2E6C2` | **2.58** | fails — **this is the "Watch zone" pill** | — |
| `--sage` `#6B8068` | `--stable-bg` `#E4EBDB` | **3.50** | fails — "Stable" pill | — |
| `text-amber-500` | `bg-amber-50` | **2.07** | fails at any size | 9 |
| `text-amber-400` | `bg-amber-50` | **1.61** | fails at any size | 5 |
| `text-sky-500` | `bg-sky-50` | **2.60** | fails at any size | 5 |
| `text-emerald-500` | `bg-emerald-50` | **2.41** | fails at any size | 8 |
| `text-rose-500` | `bg-rose-50` | **3.34** | fails normal text | 9 |
| `text-violet-500` | `bg-violet-50` | **3.86** | fails normal text | 5 |
| `text-stone-400` | `bg-stone-100` | **2.31** | fails at any size | 15 |

Compounding: `text-[9px]` (5), `text-[10px]` (53), `text-[10.5px]` (4), `text-[11px]` (158), `text-[11.5px]` (8). `at-home/page.tsx:160` sets the **"Safety"** marker on high-risk behaviour chips at `text-[9px]`.

**Why it matters:** For a healthcare organization this is ADA Title III litigation exposure, not a design preference. The failures are concentrated in exactly the wrong places — status pills that communicate risk level, and the muted secondary copy that carries most of the site's disclaimers. The audience is sleep-deprived caregivers, disproportionately reading on phones in poor light.

**Fix:** Darken `brand-muted-400` → `#5f636b` and retire `brand-muted-300` for text. Replace all `-500` Tailwind text colours on `-50` backgrounds with `-700`/`-800`. Recolour the mental-health status tokens (`--gold` → `#7A5C1F`, `--sage` → `#3F5039`). Set a 12px floor for body text and 11px for non-essential labels; nothing safety-related below 14px. Run axe-core in CI.

---

## H-5 · The onboarding gate on the Mental Health Center is not an accessible dialog
**Dimension 4 (Accessibility)** — **[verified in code]**

**Where:** `src/app/support/mental-health/components/OnboardingModal.tsx:30-32` — `<div className={styles.modalBackdrop}><div className={styles.modal}>`. No `role="dialog"`, no `aria-modal`, no labelled heading association, no focus trap, no Escape handler, no focus restoration. It is rendered unconditionally on first visit (`page.tsx:205, 324-326`) and blocks the entire page.

**Why it matters:** A screen-reader or keyboard user tabs straight past the modal into the page behind it, which is visually obscured and non-interactive. There is no way to dismiss with Escape. This is the first thing every new user encounters on the site's mental-health surface — WCAG 2.1.2, 2.4.3, 4.1.2.

**Note:** the codebase already does this correctly elsewhere — `caregiver/page.tsx:133` (toolkit panel) and `at-home/page.tsx:162` (`StrategyDialog`) both use `role="dialog" aria-modal="true" aria-labelledby`. Copy that pattern.

**Fix:** Add dialog semantics, a focus trap, Escape-to-close, and focus restoration to the trigger.

---

## H-6 · Custom tab components declare ARIA roles without the panels they require
**Dimension 4 (Accessibility)** — **[verified in code]**

**Where:**
- `src/app/support/mental-health/page.tsx:440` — `role="tablist"` with no `aria-label`; buttons at `:451-457` have `role="tab"` and `aria-selected` but no `aria-controls`; the rendered content at `:468/492/506` has no `role="tabpanel"` and no `id`
- `src/app/support/mental-health/components/DashboardTab.tsx:331-342` — `role="tablist"` / `role="tab"` on metric selectors that control a chart, no tabpanel
- `src/app/support/mental-health/components/TrendsTab.tsx:58` — same

Repo-wide: 5 × `role="tablist"`, 5 × `role="tab"`, 3 × `role="tabpanel"`.

**Why it matters:** An incomplete tab pattern is worse than no pattern — the screen reader announces "tab, 1 of 3, selected" and then the user has no way to reach the panel it controls, and no announcement when content changes. WCAG 4.1.2.

**Fix:** Complete the pattern (`aria-controls` + `id` + `role="tabpanel"` + `tabIndex={0}`) or drop the roles and use plain buttons with a live region. `src/components/ui/PageTabs.tsx` is closer to correct — standardize on it.

---

## H-7 · Crisis affordances are inconsistent in placement, wording, and destination; the one persistent component is dead code
**Dimension 2 (Safety routing)** — **[verified in code]**

- `src/components/CrisisStrip.tsx` — a full-width persistent bar with 988 / Harris Center / 911, non-dismissable on crisis routes. **Imported by nothing.** 96 lines of the site's best crisis affordance, not rendered.
- `src/components/layout/SupportShell.tsx:281-309` — a full crisis bar with four numbers renders **only** when `isFindPage`. Every other `/support/*` page gets only the `CrisisPill` (`:318`).
- `src/components/CrisisPill.tsx:62` — the label "Talk to someone now" is `hidden sm:inline`; below 640px it is an unlabelled icon.
- `src/components/CrisisPill.tsx:10, 115-122` — "See all crisis resources" → `/support/caregiver`, which is the toolbox page, not a crisis resource page.
- No crisis affordance at all on `/`, `/privacy`, `/intake`, `/today`, `/calm`, or any `/client/*` page except via `ClientShell.tsx:183`.
- Number formatting varies: `tel:7139707000` (`CrisisStrip.tsx:70`, `welcome:180`, `hard-days:245`) vs `tel:+17139707000` (`SupportShell.tsx:300`); `tel:8777715725` (`help:127`) vs `tel:+18777715725` (7 other files).
- `src/app/support/mental-health/components/UrgentTab.tsx:45` — `sms:741741` does not prefill the required body `HOME`; the adjacent label says "Text HOME."
- `src/app/support/mental-health/components/OnboardingModal.tsx:107` — *"urgent help is always one tap away **in the tab bar**"* — there is no Urgent tab; it was folded into "Support" (`page.tsx:121-125, 506-525`). The instruction is stale.

**Verified as valid numbers:** 988, 741741, 911, 1-800-662-4357 (SAMHSA), 1-800-944-4773 (Postpartum Support International), 1-800-950-6264 (NAMI), 1-800-799-7233 / text 88788 (DV Hotline, `couples:345-348`), (713) 970-7000 (Harris Center). **External URL resolution was not tested** — no network verification was performed (see "Not auditable from the repo").

**Fix:** Render `CrisisStrip` from the root layout so it is on every page. Make the pill label visible at all widths. Repoint "See all crisis resources" at a real crisis page. Normalize all `tel:` values to E.164. Add `?&body=HOME` to the Crisis Text Line link. Fix the onboarding copy. **Requires BCBA sign-off on final wording and destination ordering.**

---

## H-8 · The homepage is a re-export of `/design-preview`; both routes ship, neither is canonical
**Dimension 6 (SEO / craft)** — **[verified in code]**

**Where:**
- `src/app/page.tsx` — the entire file is `export { default } from './design-preview/page';`
- `src/app/design-preview/page.tsx` — has no `metadata` export, no `noindex`, no canonical
- Build output: `/` and `/design-preview` both 138 B / 123 kB — byte-identical
- No `src/app/robots.ts`, no `src/app/sitemap.ts`, no `public/robots.txt`

**Why it matters:** If this becomes a primary acquisition surface — the brief's premise — the flagship page is duplicated at a URL literally named "design-preview," with no canonical tag telling Google which wins. Search Console will report duplicate content and may index the wrong one. There is no sitemap and no robots.txt at all.

**Also on this page:**
- `design-preview/page.tsx:96-101, 349` — four named third-party businesses (Caldwell & Steinbring Dentistry for Children, Speech & Motion Therapy, Easter Seals Greater Houston, Autism Society of Texas) are listed with a **"Website"** link that goes to `/support/find`, not to their websites. Naming real organizations on a clinical brand's homepage with a broken endorsement affordance is a business risk independent of the SEO one.
- `:247-251` — a static "Your pathway · Step 1 of 4" progress bar implying personalized state on a page with none.

**Fix:** Move the component into `src/app/page.tsx` and delete `/design-preview`, or add `robots: { index: false }` plus a canonical. Add `sitemap.ts` and `robots.ts`. Either link providers to their real sites or remove the "Website" affordance. **Provider listings require legal review** (endorsement / referral representations).

---

## H-9 · Eleven routes are unreachable from navigation; the highest-risk mental-health surfaces are among them
**Dimension 5 (Information architecture)** — **[verified in code]**

`SupportShell.tsx:40-73` exposes 12 destinations. These routes ship, build, and are indexable but appear in no navigation:

| Route | Inbound links | Note |
|---|---|---|
| `/support/mental-health` | 2, both in content data (`carePlanParentFirst.ts:211`, `carePlanSupport.ts:22`) | 210 kB First Load — the heaviest page on the site |
| `/support/community` | **0** | |
| `/support/help` | **0** | |
| `/support/providers` | **0** | duplicates `/support/find` |
| `/support/pathfinders` | **0** | |
| `/support/caregiver/identity` | **0** | |
| `/today` | **0** | |
| `/intake` | **0** | duplicates `/support/intake` |
| `/welcome` | **0** | `noindex` set — correctly handled |
| `/design-preview` | — | duplicate of `/` |
| `/support/hard-days`, `/support/check-in`, `/calm` | homepage only | vanish once inside `/support/*` |

**Why it matters:** A caregiver who reaches `/support/hard-days` from the homepage and then navigates anywhere in the support shell can never find it again — it is in no menu. The Mental Health Center, which carries the most clinical risk on the site, is reachable only by following a link buried in care-plan content. Meanwhile four fully-built pages have zero inbound links at all. Search engines will index all of them; the site's own navigation will not.

**Fix:** Decide per route: promote to nav, merge (`/support/providers` → `/support/find`; `/intake` → `/support/intake`), or delete. Anything kept must be reachable in ≤2 clicks from `/support`. Anything deleted must be removed, not just unlinked.

---

## H-10 · `/api/chat` is live, unauthenticated, and unthrottled; its only consumer is dead code
**Dimension 3 (Privacy) / Dimension 6 (Technical)** — **[verified in code]**, cost exposure **[inferred]**

**Where:**
- `src/app/api/chat/route.ts:25-69` — accepts an arbitrary `messages` array, prepends a system prompt, forwards to OpenAI on the org's key. No auth, no rate limit, no origin check, no size cap, no logging of who called it. `:50` caps output at 500 tokens; input is uncapped.
- `src/components/ChatWidget.tsx` — the only caller. **Imported by nothing.** 242 lines of dead code.
- `src/app/privacy/page.tsx:104-137` — an entire "AI Disclosure (Required by Texas Law)" section, citing Texas HB 149, describes a chat assistant that does not render anywhere on the site.

**Why it matters:** The endpoint is a publicly-callable proxy to a paid API on the organization's credentials. Anyone can script it. Separately, the privacy policy prominently discloses an AI feature users cannot find, which reads as either a stale document or an undisclosed feature — both bad in a compliance review.

**Fix:** Delete the route and `ChatWidget`, or restore the widget and add auth, per-IP rate limiting, input size caps, and an explicit consent gate before the first message. Reconcile the HB 149 disclosure with what actually ships. **Requires legal review** (HB 149 accuracy).

---

## H-11 · The signed-in branch the brief asks about exists on exactly one page, behind a spoofable client-side cookie
**Dimension 5 (Signed-in conflict)** — **[verified in code]**

**Where:**
- `src/app/support/at-home/page.tsx:40-44` — reads `document.cookie` for `cg_current_family|current_family|client_session`, or `?currentFamily=1`
- `:148-150` — `CurrentFamilyPanel`: *"Your team already has a plan for this. Common Ground will not run a parallel recommendation engine for a signed-in family."*
- No other page in the repo branches on enrolment status. Grep for `currentFamily` outside this file: zero matches.

**Why it matters:** The design intent is exactly right and is stated in the code — an enrolled family should not receive algorithmic behavior suggestions that compete with their BCBA's plan. That principle is implemented once. `/support/mental-health`, `/support/hard-days`, `/support/check-in`, `/support/sleep`, `/support/couples`, and `/support/care-plan` all deliver generic guidance to enrolled families with no awareness that a real clinical plan exists. A parent whose BCBA has taught a specific break-request protocol can read different advice on the same site, under the same logo, the same day. The cookie is also client-readable and unsigned — with no auth system it is never set in practice, so even the one implementation is effectively dormant.

**Fix:** Replace the cookie sniff with a real session signal once auth exists. Apply the `CurrentFamilyPanel` pattern to every page producing directive guidance. **Requires BCBA sign-off** on which pages must suppress generic content for enrolled families.

---

## H-12 · English-only except one page; language toggle does not update `<html lang>`
**Dimension 4 (Accessibility) / Dimension 5 (Population served)** — **[verified in code]**

**Where:**
- `src/app/support/find/page.tsx:46, 116, 172, 450-454` — a complete `en`/`es` string table and a working toggle. The only one on the site.
- `src/app/layout.tsx:53` — `<html lang="en">`, never updated
- `find/page.tsx:332` — `useState<Locale>('en')`; the choice is not persisted and resets on every navigation
- `src/lib/providers.ts:240, 406, 486` — provider language fields read `'Spanish — verify'` / `'Spanish — contact to verify'`

**Why it matters:** Texas ABA Centers serves the Houston metro, where roughly a third of households speak Spanish at home. One page is translated; the crisis pages, the care plan, the mental-health surfaces, and the financial guidance are English-only. Where Spanish content does render, `lang="en"` remains on the document, so a screen reader pronounces it with English phonemes — WCAG 3.1.1 and 3.1.2, and functionally unusable.

**Fix:** Set `lang` dynamically and add `lang="es"` on Spanish subtrees. Persist the locale. Prioritize Spanish for crisis routing, `/support/care-plan`, and `/support/financial` before anything else.

---

# MEDIUM

---

## M-1 · Roughly 2,000 lines of orphaned components ship in the repo
**Dimension 6** — **[verified in code]**

Zero importers: `ChatWidget.tsx` (242), `CrisisStrip.tsx` (96), `WellnessMirror.tsx` (177), `EmailPlanDialog.tsx` (282), `WeeklyProgressMeter.tsx` (297), `PulseCard.tsx` (125), `WelcomeBackPanel.tsx` (120), `HomeSupportHub.tsx` (347), `HomeBaseContinuityDashboard.tsx` (773), `mental-health/components/CheckInTab.tsx` (217).

Two of these matter beyond hygiene: `CrisisStrip` is the site's best crisis affordance (H-7) and `CheckInTab` is the check-in the primary CTA promises (B-4). `EmailPlanDialog` is the only caller of `/api/email-care-plan`, which nonetheless ships live and collects email addresses (B-8).

**Fix:** Delete or wire up. Add `knip` or equivalent to CI.

---

## M-2 · Unverified efficacy and prognosis claims
**Dimension 1** — **[verified in code]**

- `src/app/support/what-is-aba/page.tsx:406-409` — *"The research on this is consistent and significant: children whose parents are actively involved in ABA therapy make faster progress, generalize skills more effectively, and maintain gains over time."* Labelled **"4 findings"** (`:392`) but `involvementFindings` (`:134-139`) contains no citations, no studies, no sources — four prose paragraphs.
- `src/app/support/hard-days/page.tsx:102` — *"Identity loss in caregivers is well-documented and **treatable**."* A treatment-efficacy claim on a page with no clinician in the loop.
- `src/app/support/sleep/page.tsx:573` — *"Evidence-based guides"* with no source.

**Why it matters:** "The research shows" on a provider's own site, promoting the provider's own service, with no citation, is the archetype of an unsupported efficacy claim. `voice.md:35` states the site's own rule: *"No clinical claims. Common Ground does not diagnose, treat, or evaluate."*

**Fix:** Cite or soften. **Requires BCBA sign-off.**

---

## M-3 · `dangerouslySetInnerHTML` on generated content
**Dimension 6 (Security)** — **[verified in code]**

`DashboardTab.tsx:384`, `TrendsTab.tsx:106`, `WellnessMirror.tsx:111`, `pathfinders/page.tsx:66`. All four currently render developer-authored strings, so there is **no live XSS path**. The risk is that `RecommendationsEngine.generateInsights()` already interpolates computed values into these strings (`:167, 177, 186, 192, 197`) — one future change that lets a user-supplied value (a name from `OnboardingModal`, a journal line) reach the template makes it exploitable.

**Fix:** Replace with JSX and a `<strong>` component. Sanitize if HTML must stay.

---

## M-4 · Responsive integrity is unaddressed by the project's own admission
**Dimension 6** — **[verified in code]**

- `README.md:6-8` — *"Common Ground is currently optimized for desktop and laptop only. Mobile responsiveness is a planned future pass."*
- Breakpoint distribution: `sm:` 427, `md:` **23**, `lg:` 92, `xl:` 33 — the 768px tier is essentially unhandled
- `src/app/privacy/page.tsx:163` — the third-party services table is wrapped in `overflow-hidden`, so it **clips** rather than scrolls at 320px (WCAG 1.4.10 Reflow). `find/page.tsx:816` gets this right with `overflow-x-auto` — inconsistent.
- `src/components/ChatWidget.tsx:89` — fixed `width: '360px'` (dead code, but the pattern)
- `src/app/support/find/page.tsx:434` — `w-[1480px]`

**Why it matters:** Caregivers read this on phones, at night. A stated desktop-only posture is disqualifying for a public mental-health surface regardless of anything else in this document.

**Fix:** Full pass at 320 / 768 / 1024 / 1440. Wrap every table in `overflow-x-auto`. **Actual rendered behaviour was not verified — no browser testing was performed** (see below).

---

## M-5 · Reading level exceeds the 6th–8th grade target on the pages that most need to be simple
**Dimension 4** — **[inferred from sentence and clause structure; no automated readability scoring was run]**

Representative:
- `src/app/support/at-home/page.tsx:109` — *"Learn the four common functions of behavior, apply an ABC lens to one moment, and receive non-restrictive supports to discuss with your care team."* — "non-restrictive supports," "ABC lens," "functions of behavior" in one sentence.
- `src/lib/atHomeMatcher.ts:150` — *"Two or more details point in this direction… This is still a possibility to discuss, not a confirmed function."*
- `src/app/support/hard-days/page.tsx:87` — *"Caregiving at this intensity reshapes your life… It is what prolonged, high-demand caregiving does to the self over time."*
- `src/app/support/financial/page.tsx:433` — ABLE eligibility prose, unavoidably dense but unglossed.

The mental-health module is the exception and reads well — `voice.md` is working where it is applied.

**Fix:** Run Flesch-Kincaid over all caregiver-facing copy in CI with an 8.0 ceiling. Gloss every clinical term on first use. `what-is-aba/page.tsx:141-152` already has a glossary — link into it.

---

## M-6 · `npm run lint` cannot run
**Dimension 6** — **[verified in code]**

No `.eslintrc*` or `eslint.config.*` exists despite `eslint` and `eslint-config-next` in `devDependencies` and a `lint` script in `package.json:8`. `npx next lint` drops into an interactive configuration prompt, which will hang any CI job. `next build` passes and does typecheck, so this is not currently masking type errors.

**Fix:** Add a flat ESLint config extending `next/core-web-vitals`, plus `eslint-plugin-jsx-a11y`. Wire into CI.

---

## M-7 · 34 MB of images in `public/`, 26 MB of it unreferenced
**Dimension 6 (Performance)** — **[verified in code]**

16 unused files including `hero-variant3.png` (6.2 MB), `hero-compassion.png` (5.5 MB), `hero-family2.png` (5.4 MB), and ten `hero-texas-aba*.jpg` variants. Referenced-and-heavy: `portal-hero.png` (5.6 MB) on `/client`, `hero-selected.jpg` (774 KB) on `/`.

Compounding: `next.config.js:7` sets `qualities: [100]` and `deviceSizes` up to 2560; three components request `quality={100}` (`design-preview/page.tsx:143`, `client/page.tsx:51`, `welcome/page.tsx:74`). The homepage LCP element is a `fill` image at `sizes="100vw"`, quality 100, up to 2560px wide.

**Fix:** Delete the 16 unused files. Drop quality to 75–85. Convert to WebP/AVIF. Constrain `deviceSizes`. **Actual LCP/CLS were not measured — no Lighthouse run was performed.**

---

## M-8 · Duplicate and near-duplicate surfaces
**Dimension 5** — **[verified in code]**

| A | B | Overlap |
|---|---|---|
| `/support/find` (839 lines, Spanish, shortlist, compare) | `/support/providers` (528 lines) | Both are provider directories |
| `/support/intake` | `/intake` | Both are intake entry points |
| `/` | `/design-preview` | Byte-identical |
| `/support/check-in` (bandwidth) | `/support/mental-health` (8-slider) | Competing instruments — see B-6 |
| `/support/care-plan/QuestionsAndDownloads.tsx` | `/components/care-plan/QuestionsAndDownloads.tsx` | Two components, same name, 176 vs 154 lines |

**Fix:** Consolidate to one canonical surface each; 301 the retired routes.

---

## M-9 · 31 of 37 routes have no page-level metadata
**Dimension 6 (SEO)** — **[verified in code]**

Only `/privacy`, `/welcome` (noindex), and `/support/couples` define `metadata`. Everything else inherits the root title template and the single root description (`layout.tsx:12-13`), so every page shares one meta description and a generic OG card. `/support/financial`, `/support/what-is-aba`, and `/support/find` are the site's most search-valuable pages and have none.

Also: 5 pages have no `<h1>` (`/`, `/support`, `/calm`, `/support/mental-health`, `/support/check-in`); 4 pages have multiple (`/support/care-plan` has 4).

**Fix:** Add `metadata` to every route. One `<h1>` per page.

---

## M-10 · Infinite animation in the mental-health module ignores `prefers-reduced-motion`
**Dimension 4** — **[verified in code]**

`src/app/support/mental-health/mental-health.module.css:263` — `animation: pulse 2s ease-in-out infinite` on the "Live" dot. The file contains **no** `prefers-reduced-motion` block. The rest of the site handles this well (`globals.css:182`, `design-preview/page.module.css:1267`, `BorderGlow.css:156`, and `useReducedMotion` in six components) — this module is the gap. WCAG 2.3.3 / 2.2.2.

**Fix:** Add a reduced-motion block to the module.

---

# LOW

- **L-1 · `sms:988` vs `tel:988` inconsistency** — `CrisisPill.tsx:108` builds `sms:${CRISIS_NUMBER_DISPLAY}`; `SupportShell.tsx:297` hardcodes `sms:988`. Same result, two sources of truth. **[verified]**
- **L-2 · Site footer carries only a Privacy link** (`SiteFooter.tsx:34-38`) — no Terms, no Accessibility Statement, no Notice of Nondiscrimination. A Medicaid-participating provider will likely need the latter two. **[verified]** — *legal review*
- **L-3 · `.gitignore` does not exclude generated worksheets** — `scripts/materialize-*.mjs` write to `public/worksheets/` on every `prebuild`; those PDFs are not ignored. **[verified]**
- **L-4 · Two `TODO`s in shipped component logic** — `HomeBaseDayCheck.tsx:80, 102` (`/* TODO: wire HOME_BASE_BAD_DAY_TOOL_IDS when toolbox content is available */`). Benign but visible in a source review. **[verified]**
- **L-5 · `/support/sensory-friendly:244` — "Suggestion form coming soon"** — an unimplemented affordance presented as forthcoming. **[verified]**
- **L-6 · `bandwidth.ts:127-129` internal tier IDs are clinical** (`'high-risk'`, `'severe'`) while user labels are correctly soft ("Stretched thin", "Today is heavy"). Harmless today; would leak into any analytics event or error payload. **[verified]**
- **L-7 · `at-home/page.tsx:91-97` `printSummary()` uses `window.open` + `document.write`** — silently no-ops under a popup blocker with no user feedback. **[verified]**
- **L-8 · Copyright is dynamic** (`SiteFooter.tsx:24`, `privacy/page.tsx:270`) — correct, noted so it is not re-flagged. **[verified]**

---

# Not auditable from this repository

Stated explicitly rather than guessed at:

1. **Live analytics** — the privacy policy asserts analytics collection (`privacy/page.tsx:91-96`) but no analytics SDK, script tag, `gtag`, or `dataLayer` exists in `src/`. Either it is injected at the hosting layer or the disclosure is aspirational. **This must be resolved before B-8 can be closed** — the answer changes what the policy has to say.
2. **Hosting log retention** — B-2's severity depends on how long query strings are retained and who can read them. Not determinable from source.
3. **Deployed third-party scripts** — tag managers, session recorders, or chat widgets added post-build are invisible here. A session-recording tool on `/support/care-plan` would escalate B-2 substantially.
4. **Real performance metrics** — LCP, CLS, INP require a deployed instance. Only build-time bundle sizes were measured (`/support/mental-health` at 210 kB First Load JS is the outlier).
5. **Rendered responsive behaviour** — M-4 is derived from breakpoint distribution and fixed widths in source, not from viewport testing.
6. **Screen-reader behaviour** — H-5 and H-6 are derived from missing ARIA in source. Actual NVDA/JAWS/VoiceOver behaviour was not tested.
7. **External link resolution** — phone numbers were checked against known published values; outbound URLs (`psychologytoday.com`, `openai.com/privacy`, `vercel.com/legal/privacy-policy`, provider sites) were **not** fetched. No network verification was performed.
8. **Whether `RESEND_API_KEY` / `OPENAI_API_KEY` are set in production** — both routes degrade gracefully when absent (`email-care-plan/route.ts:26-28`, `chat/route.ts:33-36`), so the live data-flow surface depends on deployment config not present in the repo.
