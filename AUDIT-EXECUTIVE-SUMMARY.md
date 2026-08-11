# Common Ground — Executive Summary

**Audited:** commit `45c9499`, 2026-08-02 · 37 page routes, 3 API routes, ~42,400 lines
**Reviewed as:** Chief Clinical Officer + division president, joint read
**Question on the table:** is this property fit to replace or supplement the public website in the mental health and parent support space?

---

## Recommendation: **NO-GO for publication.** Conditional go for a staged launch.

This is not a weak build. Parts of it are better than what most ABA organizations have in market, and one page (`/support/at-home`) is a model I would want to make the sitewide standard. But three defects would create real liability the day this goes live, and a fourth class of defect — unverified content shipped to families making financial and legal decisions — is the kind of thing that ends up in a complaint rather than a bug tracker.

Do not publish as-is. Do not publish "just the safe pages" without the routing fixes in Phase 1, because the safe pages currently link into the unsafe ones.

---

## The three findings that drive the recommendation

### 1. The Mental Health Center invents a caregiver's clinical history and then presents it back to her as fact

`src/app/support/mental-health/components/RiskEngine.ts:168-198` generates a fabricated 30-day record of a parent's stress, anxiety, sleep, and support using `Math.random()`. `src/app/support/mental-health/page.tsx:247-249` seeds that fiction on first visit, and lines 263-266 write it to `localStorage`, where it becomes permanently indistinguishable from real entries. `DashboardTab.tsx:359-389` then renders it under the heading **"Patterns worth knowing · From your last 30 days"** with statements like *"Sleep has slipped about 9 points over the last week"* and *"Stress has been elevated 5 days in a row."*

A caregiver who visits once sees a month of trend data about herself that never happened. The "demo view" banner (`page.tsx:377-437`) disappears the moment she enters a name — the fabricated data does not. This is a fabricated health record presented as a finding, on a page carrying the Texas ABA Centers logo.

### 2. The care-plan flow tells caregivers nothing is monitored while transmitting their most sensitive disclosure in the URL

Every page of the Support Guide flow closes with (`src/content/carePlan.ts:131`):

> *"Nothing you tap here is seen, stored, or monitored by anyone."*

`src/lib/buildPlan.ts:111-115` encodes each selection as a query parameter — `/support/care-plan?team=no&b=…&r=cannot-keep-doing`. The route is `dynamic = 'force-dynamic'` (`care-plan/page.tsx:34`), so every tap is a server request. Row IDs include `cannot-keep-doing`, `nothing-left`, `grieving`, `marriage-strain`, `thinking-stopping`. Those selections land in hosting access logs, in any analytics tool, in browser history, and in the `Referer` header on outbound links. The organization's own privacy policy (`privacy/page.tsx:91-96`) confirms analytics are collected.

The claim is absolute, it is adjacent to the risk, and the code does not support it. That is the specific pattern regulators and plaintiffs' counsel look for.

### 3. The crisis escalation path for self-injury is a 404

`src/app/support/at-home/page.tsx:145` — when a caregiver selects a Tier-1 behavior (hitting, throwing, elopement, self-injury), the page correctly refuses to generate strategies and shows a safety interstitial. Its primary button, **"Open crisis support,"** links to `/support/crisis`. That route does not exist; the real one is `/support/care-plan/crisis`. The secondary button dials the Texas ABA Centers admissions line, which is not a 24/7 crisis service. **988 does not appear anywhere on that page.**

The gating logic here is genuinely good clinical engineering. The exit door is nailed shut.

---

## Also blocking, briefly

- **`/support/financial` ships 24 unresolved `[verify]` editorial placeholders** in user-facing copy — SSI income limits, ABLE contribution caps, Medicaid waiver wait times, IRS mileage rates (`financial/page.tsx:303, 315, 327, 338, 433, 444, 451, 455, 481, 535, 549, 568, 580, 587, 606, 695, 731, 780, 841, 873, 919, 921, 1160`). Families make irreversible financial decisions on these numbers.
- **The privacy policy contradicts the code on three counts** — it claims the site is "fully anonymous" and collects no names or emails (`privacy/page.tsx:97-100`) while two API routes collect email addresses and a modal collects first names; it omits Resend from the third-party table entirely; and it never mentions the 25+ `localStorage` keys the site writes.
- **The client portal is publicly reachable, indexable, and full of fabricated clinical detail** — named child, named BCBA, mastery criteria (`client/(portal)/care-plan/page.tsx:13-35`). No authentication exists. `robots: { index: true }` is set globally at `layout.tsx:38` with no override.
- **The Mental Health Center's two primary buttons render a blank page.** `DashboardTab.tsx:187, 215, 221` dispatch tab keys (`'checkin'`, `'calming'`) that no longer exist in the 3-tab structure (`page.tsx:64`), so nothing matches any render guard.

---

## What is genuinely strong

`/support/at-home` is the best clinical work in the repo — Tier-1 behavior gating, "Possible / Unclear" hedging that requires two converging cues, explicit protection of self-stimulatory behavior from reduction framing, disclaimers sitting adjacent to every claim, and the only real signed-in branch on the site. `src/lib/bandwidth.ts` is disciplined product thinking with an honest doc comment. `scripts/care-plan-safety-audit.mjs` is a CI-enforced clinical guardrail — rare, and worth extending. `/support/find` has a working English/Spanish toggle nobody else on the site has. See `AUDIT-WHAT-WORKS.md`; that list is short because it is honest, not because there is nothing there.

---

## Effort to publishable state

| Phase | Scope | Effort |
|---|---|---|
| **Phase 1 — Blocking** | 9 blockers: remove fabricated history, fix crisis routing, fix broken tab dispatch, resolve or remove `[verify]` copy, rewrite privacy policy to match code, gate/noindex client portal, correct absolute privacy claims | **3–4 weeks**, 1 engineer + BCBA + counsel |
| **Phase 2 — Pre-launch** | Crisis-affordance consistency, WCAG 2.1 AA remediation, IA repair (11 orphan routes), reconcile the two competing wellness scores, delete ~2,000 lines of dead components | **4–5 weeks**, 1 engineer + designer + BCBA |
| **Phase 3 — Post-launch** | Mobile pass (README states desktop-only today), Spanish beyond one page, performance, signed-in branching sitewide | **6–8 weeks** |

**Realistic date to a defensible public launch: 8–10 weeks** with one full-time engineer, ~20 hours of BCBA review, and ~10 hours of legal review. Roughly 40% of that is content and sign-off work that cannot be parallelized away.

**Do not rebuild.** The architecture is sound, the content model is well-factored, and the strongest pages already demonstrate the right patterns. The problem is that those patterns were applied unevenly and one subsystem (`/support/mental-health`) was left in a state its own successor module (`src/lib/bandwidth.ts`) documents as deprecated. This is remediation, not replacement.

---

## Scope note

Everything above was verified by reading source and running a production build. Live analytics behavior, the hosting provider's log retention, deployed third-party scripts, real Lighthouse metrics, and actual screen-reader behavior **could not be audited from the repository** and are called out as such in `AUDIT-FINDINGS.md`.
