# Page Inventory & Route Map

**Commit `45c9499` · 37 page routes + 3 API routes · verified against `next build` output (41 prerendered entries)**

Status key: 🔴 **Blocked** (cannot publish) · 🟠 **Needs work** · 🟢 **Publishable** (minor fixes only) · ⚫ **Remove or merge**

Bundle figures are First Load JS from the production build.

---

## Public / root

| Route | File | Status | Bundle | Reachable from | Owner-facing note |
|---|---|---|---|---|---|
| `/` | `app/page.tsx` → `app/design-preview/page.tsx` | 🔴 | 123 kB | — (entry) | **The homepage is a one-line re-export of `design-preview`.** Duplicate content at two URLs, no canonical, no page metadata. Four named third-party businesses carry a "Website" link that goes to `/support/find` (`design-preview:349`). Static "Step 1 of 4" progress bar implies personalized state (`:247`). LCP image at `quality={100}`, `sizes="100vw"`. |
| `/design-preview` | `app/design-preview/page.tsx` | ⚫ | 123 kB | 0 inbound | Byte-identical to `/`. Delete or `noindex` + canonical. |
| `/privacy` | `app/privacy/page.tsx` | 🔴 | 111 kB | `SiteFooter`, `/welcome` | **Contradicts the code in four places** — see B-8. Claims "fully anonymous," omits Resend, omits all 25+ storage keys, denies PHI handling. Devotes a full HB 149 section to a chat widget that does not render. Third-party table uses `overflow-hidden` and clips at 320px (`:163`). Only page besides `/welcome` and `/support/couples` with real metadata. |
| `/welcome` | `app/welcome/page.tsx` | ⚫ | 125 kB | 0 inbound | Archived marketing homepage. **Correctly `noindex`ed** (`welcome/layout.tsx:10`) with a comment explaining the migration. Delete once the migration is done. |
| `/intake` | `app/intake/page.tsx` | ⚫ | 153 kB | 0 inbound | A dev preview harness ("IntakePreviewPage") for `IntakeFlow`. Duplicates `/support/intake`. Not `noindex`ed. |
| `/today` | `app/today/page.tsx` | ⚫ | 116 kB | 0 inbound | Orphan. No inbound links anywhere. Decide: promote or delete. |
| `/calm` | `app/calm/page.tsx` | 🟠 | 141 kB | homepage tile only (`design-preview:90`) | Full-screen calming surface. No `<h1>`, no metadata, no outbound internal links — a genuine dead end. Not in `SupportShell` nav, so unreachable once inside `/support/*`. |

---

## Parent Support layer — `/support/*`

All render inside `SupportShell` (`app/support/layout.tsx`), which supplies a 12-item sidebar, the "open to every family" chip, and `CrisisPill`.

### In the primary navigation

| Route | File | Status | Bundle | Note |
|---|---|---|---|---|
| `/support` | `app/support/page.tsx` → `HomeBaseV22` | 🟠 | 155 kB | Support home. No `<h1>`, no metadata, no direct outbound `<Link>` in the page file (all routing is inside `HomeBaseV22`). The nav below it omits 11 routes that ship. |
| `/support/care-plan` | `app/support/care-plan/page.tsx` | 🔴 | 165 kB | **Flagship flow, and the site's sharpest privacy problem.** Footer asserts *"Nothing you tap here is seen, stored, or monitored by anyone"* (`content/carePlan.ts:131`) while `buildPlan.ts:111-115` encodes selections like `r=cannot-keep-doing` in the URL on a `force-dynamic` route. Content quality is high — 488 unique strings, CI-verified, zero duplicates. 4 `<h1>` elements. |
| `/support/care-plan/crisis` | `app/support/care-plan/crisis/page.tsx` | 🟠 | 113 kB | Well-structured crisis sheet with documentation prompts, team contact, and an immediate-danger panel. **Nothing links to it as "crisis support"** — `at-home:145` points at the non-existent `/support/crisis` instead. One outbound link. |
| `/support/connect` | `app/support/connect/page.tsx` | 🟢 | 111 kB | Parent connection preview. Moderated-group framing is sound. Receives traffic from several "talk to your coordinator" CTAs that over-promise (see `/support/hard-days`). |
| `/support/caregiver` | `app/support/caregiver/page.tsx` | 🟢 | 124 kB | **Model disclaimer page.** `:133` scope note is the sitewide template; `:128` puts 988 one click from every tool. Also the destination of CrisisPill's "See all crisis resources" — which is wrong, this is a toolbox not a crisis page. Needs metadata. |
| `/support/couples` | `app/support/couples/page.tsx` | 🟢 | 126 kB | Strong scope note at `:245`. DV Hotline correctly surfaced (`:345-348`). One of only 3 routes with real metadata. |
| `/support/what-is-aba` | `app/support/what-is-aba/page.tsx` | 🟠 | 124 kB | Best educational content on the site — the myth-busting at `:48-50` handles ABA's aversive history honestly, and the glossary (`:141-152`) is genuinely useful. **But `:406-409` makes an uncited efficacy claim** labelled "4 findings" with no sources. High-value SEO page with no metadata. |
| `/support/at-home` | `app/support/at-home/page.tsx` | 🔴 | 129 kB | **Best clinical work in the repo — blocked by one broken link.** Tier-1 gating, "Possible/Unclear" hedging, self-stim protection, four adjacent disclaimers, the only signed-in branch on the site. `:145` "Open crisis support" → `/support/crisis` = 404, and 988 appears nowhere on the page. Fix the href and this is publishable. 2 `<h1>`. |
| `/support/resources` | `app/support/resources/page.tsx` | 🟢 | 136 kB | Curated library. Needs metadata. |
| `/support/siblings` | `app/support/siblings/page.tsx` | 🟢 | 126 kB | Sibling support. One of the better-realized secondary pages. Needs metadata. |
| `/support/find` | `app/support/find/page.tsx` | 🟢 | 151 kB | **The Spanish implementation and the shortlist privacy model — extend both.** Only page with an `en`/`es` toggle (`:450`); locale is not persisted and `<html lang>` never changes. Only `/support/*` page that gets the full 4-number crisis bar (`SupportShell:281-309`). Honest listing disclaimer at `:114`. `w-[1480px]` and `min-w-[520px]` need a 320px check. 2 `<h1>`. |
| `/support/financial` | `app/support/financial/page.tsx` | 🔴 | 116 kB | **24 unresolved `[verify]` placeholders** in SSI limits, ABLE caps, waiver wait times, and IRS mileage rates — several citing 2024 figures. 1,294 lines, no outbound internal links, no metadata. Highest-value SEO page on the site and currently unpublishable. |
| `/client` (nav item) | see Client layer below | 🔴 | — | Linked from the support sidebar as "Client Portal Preview." |

### Ships but **not in any navigation**

| Route | File | Status | Bundle | Inbound | Note |
|---|---|---|---|---|---|
| `/support/mental-health` | `app/support/mental-health/page.tsx` | 🔴 | **210 kB** | 2, both in content data | **Highest clinical risk and heaviest page, reachable only from a care-plan content link.** Fabricated 30-day history persisted as real (B-1); "At-risk zone" classification with no crisis interrupt (B-5); both primary CTAs render a blank page (B-4); competes with `bandwidth.ts` (B-6); streak counter violates `voice.md`. No `<h1>`, no metadata, no reduced-motion block. |
| `/support/hard-days` | `app/support/hard-days/page.tsx` | 🔴 | 119 kB | homepage tile only | Emotionally the strongest writing in the repo. **But the 8-item checklist scores to "Crisis zone"** (`:672`) and answers with static copy; at "High load" it recommends NAMI, a Mon–Fri line, on a page whose header says *"for the 2am moments."* 988 appears in the top band as inline text, not a button. Promises a "care coordinator" the free layer does not have (`:260-267`). Disappears from navigation once the user is inside `/support/*`. |
| `/support/check-in` | `app/support/check-in/page.tsx` | 🟢 | 120 kB | homepage tile only | **The correct crisis-interrupt pattern lives here** (`:153-170`) — copy it into `/support/mental-health` and `/support/hard-days`. Uses the canonical `bandwidth.ts` instrument. No `<h1>`, no metadata. File comment says it is "surfaced after the parent has a plan"; no such link exists. |
| `/support/sleep` | `app/support/sleep/page.tsx` | 🟠 | 116 kB | 1 (`carePlanParentFirst:456`) | Solid content. `:573` "Evidence-based guides" is uncited. No metadata. |
| `/support/sensory-friendly` | `app/support/sensory-friendly/page.tsx` | 🟠 | 120 kB | 1 (`carePlanParentFirst:331`) | `:244` "Suggestion form coming soon" — unimplemented affordance. No outbound links. No metadata. |
| `/support/caregiver/identity` | `app/support/caregiver/identity/page.tsx` | 🟠 | 114 kB | **0** | 492 lines of finished content, zero inbound links. |
| `/support/community` | `app/support/community/page.tsx` | ⚫ | 102 kB | **0** | Orphan. Explicitly demo data (`DemoDataNotice`). No outbound links. Publish it properly or delete it. |
| `/support/help` | `app/support/help/page.tsx` | ⚫ | 126 kB | **0** | Orphan. Overlaps `/support/find` and `/support/resources`. |
| `/support/providers` | `app/support/providers/page.tsx` | ⚫ | 126 kB | **0** | Orphan, and a second provider directory competing with the far better `/support/find`. Merge or delete. No outbound links. |
| `/support/pathfinders` | `app/support/pathfinders/page.tsx` | 🔴 | 107 kB | **0** | **Promises a service that does not exist and contradicts the privacy posture.** `:12-15` — *"Reaches out when the data turns… When your check-ins say you're carrying more."* `PathfinderCard.tsx:11` concedes Pathfinders are "being onboarded." Zero inbound links, so no user reaches it today — but it ships and is indexable. |
| `/support/intake` | `app/support/intake/page.tsx` | 🟠 | 106 kB | several | Entry point to the care-plan flow. Carries the same absolute-privacy footer as B-2. Two-choice branch; clean. |

---

## Client layer — `/client/*`

**No authentication exists anywhere in the repository.** All of these prerender as public static pages and inherit `robots: { index: true }` from `app/layout.tsx:38`.

| Route | File | Status | Bundle | Note |
|---|---|---|---|---|
| `/client` | `app/client/page.tsx` | 🔴 | 111 kB | Sign-in gate. The real button is `disabled` ("production only") (`:96-102`); a live "Preview demo family" link walks straight into the portal. `portal-hero.png` is 5.6 MB at `quality={100}`. |
| `/client/portal` | `app/client/(portal)/portal/page.tsx` | 🔴 | 110 kB | *"Welcome back, Maria"* / *"Here's where things stand with Mateo"* (`:40-42`), fabricated session observations (`:20-31`). Publicly indexable. `ClientDemoBanner` renders **below** the headline and will not appear in a search snippet. |
| `/client/care-plan` | `app/client/(portal)/care-plan/page.tsx` | 🔴 | 106 kB | **Most exposed page on the site.** Named child, named BCBA ("Dr. Rachel Ortiz"), and mastery criteria (*"80% of the time"*, *"three sessions in a row"*) at `:13-35, 44-45, 64`. Reads as a real treatment record under a real provider's brand. |
| `/client/progress` | `app/client/(portal)/progress/page.tsx` | 🔴 | 106 kB | Fabricated session data. Same exposure. |
| `/client/coaching` | `app/client/(portal)/coaching/page.tsx` | 🔴 | 102 kB | Fabricated modules. No outbound internal links. |
| `/client/messages` | `app/client/(portal)/messages/page.tsx` | 🔴 | 102 kB | Simulated secure messaging with a named clinician. No outbound links. **Highest misinterpretation risk** — a parent could believe a message was sent. |
| `/client/concerns` | `app/client/(portal)/concerns/page.tsx` | 🟠 | 112 kB | Has a free-text `<textarea>` (`:139`) with no submission target and no PHI warning. 988 surfaced at `:57` and `:162` — the only client page that routes crisis well. 2 `<h1>`. |

**Immediate action for the whole layer:** add `robots: { index: false, follow: false }` to `app/client/(portal)/layout.tsx` and env-gate the preview link.

---

## API routes

| Route | File | Status | Note |
|---|---|---|---|
| `/api/chat` | `app/api/chat/route.ts` | 🔴 | Live, unauthenticated, unthrottled proxy to OpenAI on the org's key. Uncapped input. **Its only caller, `ChatWidget.tsx`, is imported by nothing** — but the endpoint ships. The system prompt (`:14-23`) is well-written and correctly routes crisis mentions to 988 and the Harris Center. |
| `/api/email-care-plan` | `app/api/email-care-plan/route.ts` | 🔴 | Collects a caregiver email **and** her selected needs, forwards both to Resend (`:30-61`) — an undisclosed processor. Directly contradicts the privacy policy's "fully anonymous" claim. Its only caller, `EmailPlanDialog.tsx`, is also dead code. Email body carries a correct clinical disclaimer (`:46`). |
| `/api/weekly-nudge` | `app/api/weekly-nudge/route.ts` | 🟠 | Collects an email. Honest doc comment (`:3-21`) explaining that automation is out of scope. Same undisclosed-processor issue. |

---

## Orphaned components (ship in the repo, rendered nowhere)

| Component | Lines | Consequence |
|---|---|---|
| `components/CrisisStrip.tsx` | 96 | **The site's best crisis affordance is not rendered.** Full-width, persistent, non-dismissable on crisis routes. Should be in the root layout. |
| `mental-health/components/CheckInTab.tsx` | 217 | **The check-in the primary CTA promises does not exist in the running app** (see B-4). |
| `components/ChatWidget.tsx` | 242 | Leaves `/api/chat` live with no consumer; privacy policy documents a feature users cannot find. |
| `components/EmailPlanDialog.tsx` | 282 | Only caller of `/api/email-care-plan`. |
| `components/homeBase/HomeBaseContinuityDashboard.tsx` | 773 | Largest dead file. |
| `components/home/HomeSupportHub.tsx` | 347 | Duplicate of homepage tile logic. |
| `components/WeeklyProgressMeter.tsx` | 297 | |
| `components/WellnessMirror.tsx` | 177 | Uses `dangerouslySetInnerHTML` (`:111`). |
| `components/PulseCard.tsx` | 125 | |
| `components/WelcomeBackPanel.tsx` | 120 | Contains a privacy claim (`:111`) nobody reads. |

**~2,676 lines total.**

---

## Route-level summary

- **37 page routes** ship. **11 have no navigation entry.** **8 have zero inbound links from anywhere.**
- **1 broken internal link:** `/support/crisis` (`at-home/page.tsx:145`) — and it is the crisis escalation path.
- **31 of 37 routes have no page-level metadata.** 5 have no `<h1>`; 4 have more than one.
- **No `sitemap.ts`, no `robots.ts`, no `public/robots.txt`.** Only `/welcome` sets `noindex`.
- **Heaviest page (210 kB) is the highest-risk page and is not in the navigation.**
- **Publishable today with only minor fixes: 7 routes.** Blocked: 15. Remove or merge: 8.
