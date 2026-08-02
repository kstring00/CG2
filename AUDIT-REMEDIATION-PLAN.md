# Remediation Plan

**Sequenced. Phase 1 must complete before any public launch. Phase 2 before the property is promoted as a primary acquisition surface. Phase 3 is post-launch.**

Sign-off legend: **[BCBA]** = clinical sign-off required · **[LEGAL]** = legal/compliance review required · **[ENG]** = engineering only

Effort assumes one full-time engineer. Clinical and legal hours are listed separately because they gate merges and cannot be compressed by adding engineers.

---

# Phase 1 — Blocking publication

**Target: 3–4 weeks · ~20 BCBA hours · ~10 legal hours**

Nothing in this phase is optional and nothing here is cosmetic. Ordered by how much of the rest depends on it.

---

### 1.1 — Answer the analytics question first *(blocks 1.5 and 1.6)*
**[LEGAL]** · 2 hours · **Do this before writing any privacy copy.**

The privacy policy asserts analytics collection (`privacy/page.tsx:91-96`) but no analytics SDK exists in `src/`. Determine what is actually injected at the hosting layer, what the hosting access-log retention period is, and whether any session-recording tool is deployed. Every downstream privacy fix depends on this answer, and a session recorder on `/support/care-plan` would escalate 1.5 significantly.

---

### 1.2 — Stop fabricating clinical history *(B-1)*
**[BCBA]** · 2 days eng + 3 BCBA hours

- Delete `seedHistory()` and `anchorTodayInHistory()` from `mental-health/components/RiskEngine.ts:168-214`.
- Remove the `seedHistory()` call at `mental-health/page.tsx:247-249`. Initialize `history = []`.
- Ship a one-time migration that clears `cg-history-v2` for existing users — synthetic rows already written cannot be distinguished from real ones and must not survive.
- The correct empty state already exists at `DashboardTab.tsx:367-371`; let it render.
- Delete the fabricated statistics in `RecommendationsEngine.ts:114, 147-148` and the fabricated temporal claim at `:42` *(H-2)*.
- If a populated demo is needed for sales, put it behind `?demo=1`, write to a separate key, never merge with real data, stamp every row `synthetic: true`.

**BCBA reviews:** replacement empty-state copy.

---

### 1.3 — Fix the crisis escalation path *(B-3)*
**[BCBA]** · 1 day eng + 2 BCBA hours

- `at-home/page.tsx:145` — change `/support/crisis` → `/support/care-plan/crisis`.
- Add a `tel:988` / `sms:988` action pair as the **primary** CTA in `SafetyInterstitial`, above the admissions line.
- Add a build-time assertion that every internal `href` in `src/` resolves to a real route. This class of bug must not be audit-only.

**BCBA reviews:** action ordering in the interstitial (988 vs. established safety plan vs. admissions).

---

### 1.4 — Fix the blank-page tab dispatch *(B-4)*
**[ENG]** · 0.5 day

- `mental-health/page.tsx:487` — remove the `as TabKey` cast so the compiler catches invalid keys.
- Repoint `DashboardTab.tsx:187, 215, 221` at valid keys, or restore `CheckInTab` as a real tab.
- Add a `default:` fallback in the tab render so an unknown key can never blank the page.

---

### 1.5 — Remove sensitive selections from the URL and correct the privacy claim *(B-2)*
**[LEGAL]** · 3 days eng + 3 legal hours

- Replace `buildPlan.ts:111-115` query-string routing with in-memory client state or POST-and-render. The row ID must never appear in a request line. `scripts/care-plan-safety-audit.mjs` already forbids `localStorage` in this flow, so in-memory is the only compliant option — keep it that way.
- Rewrite `content/carePlan.ts:131` to something the code supports. Suggested: *"Your answers are not saved to an account and are not shared with your care team. Like any website, our host records page visits."*
- Audit every other absolute privacy claim against actual behaviour: `SupportShell.tsx:207`, `DashboardTab.tsx:427`, `find/page.tsx:114`, `at-home/page.tsx:112`. (`at-home:112` is currently **accurate** — session-only `useState`, verified — and should be the template for the wording.)

**Legal reviews:** all replacement privacy language.

---

### 1.6 — Rewrite the privacy policy against a real data inventory *(B-8)*
**[LEGAL]** · 2 days eng + 4 legal hours · *depends on 1.1*

- Remove *"fully anonymous"* and *"we do not collect names, email addresses"* (`privacy/page.tsx:97-100`) — two API routes and an onboarding modal collect exactly those.
- Add **Resend** to the third-party table (`:173-175`).
- Add a client-side storage section enumerating all 25+ keys, their purpose, and how to clear them. Inventory: `mental-health/page.tsx:140-146`, `homeBaseActivity.ts:9-14`, `bandwidth.ts:225`, `carePlanStorage.ts:196`, `useParentContext.ts:13`, `weeklyProgress.ts:38`, `find/page.tsx:352`, `CalmingToolsTab.tsx:122/542/821`, `IdentityTopic.tsx:33-51`, `CouplesTopic.tsx:54-67`, `CrisisStrip.tsx:7`.
- Rewrite "Your Rights" (`:218-220`) to reflect the Texas Data Privacy and Security Act rather than asserting the rights do not apply.
- Reconcile the HB 149 AI disclosure (`:104-137`) with what actually ships — currently it documents a chat widget that does not render.
- Re-examine the HIPAA notice (`:194-196`) given that the site stores self-reported mental-health dimensions and free-text journals keyed to a first name.

---

### 1.7 — Contain the client portal *(B-9)*
**[LEGAL]** · 1 day eng + 1 legal hour

- Add `robots: { index: false, follow: false }` to `client/(portal)/layout.tsx` — **do this today, independent of everything else.**
- Env-gate the "Preview demo family" link (`client/page.tsx:97-102`) behind a flag or basic auth.
- Move `ClientDemoBanner` above the `<h1>` on all six portal pages so it appears in any screenshot or snippet.
- Consider renaming the demo family so the content cannot be mistaken for a real record.

---

### 1.8 — Resolve or remove the `[verify]` financial content *(B-7)*
**[LEGAL]** · 2 days eng + 4 legal hours (or take the page down: 1 hour)

24 placeholders at `financial/page.tsx:303, 315, 327, 338, 433, 444, 451, 455, 481, 535, 549, 568, 580, 587, 606, 695, 731, 780, 841, 873, 919, 921, 1160`. Several cite 2024 figures on an August 2026 site.

- Verify each against a current-year primary source; cite inline with the source and date.
- Add a page-level "figures current as of {date}" stamp with an owner and review cadence.
- Add a CI check failing the build on `[verify` anywhere in `src/app/**`.
- **If verification cannot complete inside Phase 1, unpublish the page.** It is better absent than wrong.

---

### 1.9 — Retire the unvalidated risk instrument *(B-5, B-6)*
**[BCBA]** · 3 days eng + 6 BCBA hours

`bandwidth.ts:1-26` already documents this migration as the intended end state. Finish it.

- Remove the 0–100 score, the animated hero number, and the `Stable / Watch zone / At-risk zone` labels from the caregiver-facing UI (`RiskEngine.ts:95-99`, `DashboardTab.tsx:234-244`).
- Make `bandwidth.ts` the single canonical instrument; have `/support/mental-health` read `cg.bandwidth.v1` rather than maintain a parallel score.
- Delete the streak counter (`page.tsx:146`, `DashboardTab.tsx:431-434`) — `voice.md:9` and `bandwidth.ts:24` both forbid it.
- **If any banded output survives, the top band must interrupt with 988 before routine content.** The correct pattern already exists at `check-in/page.tsx:153-170` — copy it.

**BCBA reviews:** which instrument is canonical, and the top-band interrupt copy.

---

### 1.10 — Fix the risk-collection response on `/support/hard-days` *(H-1)*
**[BCBA]** · 1 day eng + 3 BCBA hours

- Make 988 a tappable button in every `getWarningMessage()` band from 3 upward (`hard-days/page.tsx:276-294`).
- Remove or rename the "Crisis zone" label (`:672`) — an 8-item unvalidated checklist should not emit a clinical band name.
- Never surface a business-hours line as a primary action without its hours attached (`:287` recommends NAMI without noting Mon–Fri 10am–10pm ET, which `:236` gets right).

---

### 1.11 — Remove undeliverable service promises *(H-3)*
**[LEGAL]** · 0.5 day eng + 1 legal hour

- `UrgentTab.tsx:81-83` — delete the "message them anytime through your CG dashboard" sentence. It is a dead end at the point of highest need.
- `pathfinders/page.tsx:12-15` — **delete "Reaches out when the data turns" entirely.** It describes staff monitoring of check-in data, which directly contradicts the privacy guarantees on every other page.
- Rewrite remaining Pathfinder copy to future tense with an explicit availability statement.
- `hard-days/page.tsx:260-267` — remove the "Talk to your coordinator" card from the free layer, or gate it on enrolment.

---

### 1.12 — Close the open AI endpoint *(H-10)*
**[ENG]** + **[LEGAL]** for the disclosure · 0.5 day

Delete `api/chat/route.ts` and `ChatWidget.tsx` together, **or** restore the widget with auth, per-IP rate limiting, input size caps, and a consent gate. Either way, reconcile the HB 149 disclosure in 1.6. Same decision for `api/email-care-plan` and `EmailPlanDialog` — both are currently live endpoints with dead callers.

---

### Phase 1 exit criteria

- [ ] No fabricated data is presented as user data anywhere
- [ ] Every crisis affordance resolves to a working destination with 988 reachable in one tap
- [ ] Every privacy claim in copy is supported by the code, verified by a named reviewer
- [ ] No `[verify]` string in `src/app/**`; CI enforces this
- [ ] `/client/*` is `noindex` and not publicly walkable
- [ ] Exactly one wellness instrument ships
- [ ] BCBA has signed off on 1.2, 1.3, 1.9, 1.10; counsel on 1.5, 1.6, 1.7, 1.8, 1.11

---

# Phase 2 — Pre-launch

**Target: 4–5 weeks · ~8 BCBA hours · ~2 legal hours**

---

### 2.1 — Crisis affordance consistency *(H-7)* · **[BCBA]** · 3 days
Render `CrisisStrip` (currently dead code) from the root layout so crisis access is on every page. Make the `CrisisPill` label visible below 640px (`CrisisPill.tsx:62`). Repoint "See all crisis resources" (`:10`) away from the toolbox page to a real crisis destination. Normalize all `tel:` values to E.164 (`tel:7139707000` vs `tel:+17139707000`; `tel:8777715725` vs `tel:+18777715725`). Add the required body to the Crisis Text Line link (`UrgentTab.tsx:45`). Fix the stale "urgent help is in the tab bar" instruction (`OnboardingModal.tsx:107`). **BCBA reviews final wording and destination ordering.**

### 2.2 — WCAG 2.1 AA remediation *(H-4, H-5, H-6, M-10)* · 8 days
Darken `brand-muted-400` → `#5f636b`; retire `brand-muted-300` for text; replace all `-500` Tailwind text colours on `-50` backgrounds with `-700`/`-800`; recolour `--gold` → `#7A5C1F` and `--sage` → `#3F5039`. Set a 12px body-text floor and nothing safety-related below 14px (`at-home/page.tsx:160` currently renders the "Safety" marker at 9px). Give `OnboardingModal.tsx:30` real dialog semantics — copy the working pattern from `at-home/page.tsx:162`. Complete or remove the tab ARIA in `mental-health/page.tsx:440`, `DashboardTab.tsx:331`, `TrendsTab.tsx:58`. Add a `prefers-reduced-motion` block to `mental-health.module.css`. Wire axe-core into CI.

### 2.3 — Information architecture repair *(H-9, M-8)* · 4 days
Per route, decide promote / merge / delete. Recommended: promote `/support/mental-health`, `/support/hard-days`, `/support/check-in`, `/calm` into the sidebar; merge `/support/providers` → `/support/find` and `/intake` → `/support/intake`; delete `/design-preview`, `/today`, `/support/community`, `/support/help`. 301 everything retired. Nothing kept may be more than two clicks from `/support`.

### 2.4 — Delete dead code *(M-1)* · 1 day
~2,676 lines across ten components. Two are load-bearing and must be *wired up* rather than deleted: `CrisisStrip` (2.1) and `CheckInTab` (1.4). Add `knip` to CI.

### 2.5 — Fix uncited efficacy claims *(M-2)* · **[BCBA]** · 1 day + 2 BCBA hours
`what-is-aba/page.tsx:406-409` ("The research on this is consistent and significant…" labelled "4 findings" with zero sources), `hard-days/page.tsx:102` ("well-documented and treatable"), `sleep/page.tsx:573` ("Evidence-based guides"). Cite or soften. Enforce `voice.md:35` ("No clinical claims") in the copy checklist that already runs in `prebuild`.

### 2.6 — Extend the safety-audit harness *(builds on the strongest asset in the repo)* · 3 days
`scripts/care-plan-safety-audit.mjs` currently covers only `/support/care-plan` and `/support/intake`. Extend it to `/support/mental-health`, `/support/hard-days`, and `/support/at-home` with rules appropriate to each: no fabricated data generators, no uncited statistics, mandatory crisis-affordance presence, mandatory adjacent disclaimer. **This harness would have caught B-1 and B-4 before they shipped.**

### 2.7 — SEO and metadata *(H-8, M-9)* · 2 days
Add `metadata` to all 31 routes lacking it. Add `sitemap.ts` and `robots.ts`. One `<h1>` per page (5 pages have none, 4 have multiple). Resolve the `/` ↔ `/design-preview` duplication. Fix or remove the homepage provider "Website" links (`design-preview/page.tsx:349`) — **[LEGAL]** on the endorsement framing; adopt the honest disclaimer from `find/page.tsx:114`.

### 2.8 — Tooling hygiene *(M-3, M-6, L-3)* · 1 day
Add a flat ESLint config with `jsx-a11y` so `npm run lint` can run at all. Replace the four `dangerouslySetInnerHTML` call sites with JSX. Gitignore generated worksheet PDFs.

---

# Phase 3 — Post-launch

**Target: 6–8 weeks**

### 3.1 — Mobile *(M-4)* · 3 weeks
The README currently states the site is desktop-only. Full pass at 320 / 768 / 1024 / 1440. The `md:` tier is essentially unhandled (23 uses vs. 427 `sm:`). Wrap every table in `overflow-x-auto` (`privacy/page.tsx:163` clips today; `find/page.tsx:816` is correct). Update the README when done.

### 3.2 — Spanish beyond one page *(H-12)* · 3 weeks
`find/page.tsx:46-172` already has a reusable string-table structure. Extend it, in this order: crisis routing → `/support/care-plan` → `/support/financial` → `/support/what-is-aba`. Set `<html lang>` dynamically and mark Spanish subtrees. Persist the locale choice.

### 3.3 — Signed-in branching sitewide *(H-11)* · **[BCBA]** · 2 weeks + 4 BCBA hours
Replace the spoofable cookie sniff at `at-home/page.tsx:40-44` with a real session signal. Apply the `CurrentFamilyPanel` pattern (`:148-150`) — *"Common Ground will not run a parallel recommendation engine for a signed-in family"* — to every page producing directive guidance. **BCBA determines which pages must suppress generic content for enrolled families.**

### 3.4 — Performance *(M-7)* · 1 week
Delete 16 unused images (~26 MB). Drop `quality` from 100 to 75–85. Convert to WebP/AVIF. Constrain `deviceSizes`. Code-split `/support/mental-health` (210 kB First Load, nearly double every other route). Establish a real Lighthouse baseline — none exists today.

### 3.5 — Reading level *(M-5)* · 1 week
Add Flesch-Kincaid scoring to the existing copy checklist with an 8.0 ceiling. Gloss clinical terms on first use, linking into the glossary that already exists at `what-is-aba/page.tsx:141-152`.

---

# Sign-off register

| Item | Reviewer | Phase |
|---|---|---|
| Mental-health empty-state copy | BCBA | 1.2 |
| Crisis interstitial action ordering | BCBA | 1.3 |
| Canonical wellness instrument + top-band interrupt | BCBA | 1.9 |
| `/support/hard-days` banded response copy | BCBA | 1.10 |
| Crisis affordance wording and destinations | BCBA | 2.1 |
| Efficacy claim revisions | BCBA | 2.5 |
| Pages that must suppress generic guidance for enrolled families | BCBA | 3.3 |
| Analytics and log-retention determination | Legal | 1.1 |
| Care-plan privacy language | Legal | 1.5 |
| Full privacy policy rewrite | Legal | 1.6 |
| Client-portal public exposure | Legal | 1.7 |
| Financial / benefits / tax content | Legal | 1.8 |
| Service-availability representations (Pathfinders, navigator) | Legal | 1.11 |
| Texas HB 149 AI disclosure accuracy | Legal | 1.12 |
| Provider listing / endorsement framing | Legal | 2.7 |

---

# Sequencing notes

**Do today, before anything else:** add `robots: { index: false }` to `client/(portal)/layout.tsx` (1.7, one line) and change `/support/crisis` → `/support/care-plan/crisis` (1.3, one line). Both are single-line changes closing live exposure.

**The critical path is content and sign-off, not code.** Items 1.6 and 1.8 depend on legal availability; 1.9 depends on a clinical decision about which instrument is canonical. Adding engineers does not shorten Phase 1 below about three weeks.

**Do not defer 1.1.** Both the privacy rewrite (1.6) and the URL fix (1.5) hinge on what is actually collected in production. Guessing produces a policy that will be wrong again.

**Resist reopening the architecture.** The strongest patterns already exist in this codebase — Tier-1 gating in `atHomeMatcher.ts`, the crisis interrupt in `check-in/page.tsx:153-170`, the disclaimer voice in `caregiver/page.tsx:133`, the CI harness in `care-plan-safety-audit.mjs`, and the instrument design in `bandwidth.ts`. Most of this plan is applying five existing patterns consistently. That is remediation work, and it is why a rebuild is not warranted.
