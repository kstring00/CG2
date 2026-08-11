# What Works — and should become the standard

This list is short because it is honest. Everything below was verified in code, and each item is here because I would defend it in front of a clinical review board, not because it looks polished.

Where something on one page should become the sitewide rule, I say so explicitly.

---

## 1. `/support/at-home` is the best clinical work in the repository. Make it the template.

`src/app/support/at-home/page.tsx` + `src/lib/atHomeMatcher.ts`

This page does the hardest thing on the site — helping a caregiver think about why a behavior is happening — and it does it without once overstepping. Five things it gets right that nothing else on the site does:

**Tier-1 gating that actually refuses.** `atHomeMatcher.ts:40-43` defines `TIER_ONE_BEHAVIORS = ['hitting', 'leaving', 'throwing', 'self-injury']`. When one is selected, `page.tsx:62` hard-returns from `revealResults()`, `page.tsx:129` removes the submit button entirely, and `page.tsx:134` swaps the whole results region for a safety interstitial. The printed handoff also suppresses strategies (`page.tsx:75`). This is not a warning banner over a working feature — the feature is genuinely disabled. Most products in this space show the disclaimer and generate the advice anyway.

**Epistemic hedging with a real threshold.** `atHomeMatcher.ts:144` — a function is only labelled "Possible" when at least two independent cues converge. Everything else is "Unclear," and the explanation tells the caregiver *what to watch for next time* (`:130-139`) rather than guessing. The copy at `:150` is precise: *"This is still a possibility to discuss, not a confirmed function."*

**Self-stimulatory behavior is explicitly protected from reduction framing.** `atHomeMatcher.ts:222` — *"Repetitive or self-stimulatory behavior is often adaptive and is not automatically a target for reduction. Focus on comfort, access, regulation, communication, and whether the behavior is safe."* This is neurodiversity-affirming, clinically current, and the kind of sentence that tells an autistic adult reading the site that the organization has been paying attention. It should appear anywhere the site touches stimming.

**Disclaimers sit on top of the claim, not in a footer.** Four of them, each within a few lines of what it qualifies: `page.tsx:120` (*"These are four lenses to consider—not a diagnosis or confirmed function"*), `:129` (*"ABC organizes an observation. It does not prove why a behavior occurred"*), `:137` (*"A BCBA can assess the pattern… and individualize treatment"*), `:155` (*"Observation coaching—not an assessment"*). **This adjacency pattern is the sitewide standard I would adopt.** Compare with `/support/mental-health`, where the equivalent hedge is a 12px subtitle under a large animated score.

**No restrictive procedure appears anywhere.** I searched the entire repository for extinction, planned ignoring, response cost, time-out, restraint, seclusion, and aversives. The only hits are `what-is-aba/page.tsx:48-50`, which correctly frames aversives as historical and unethical, and `marriage/content.ts:224`, which is a couples' de-escalation signal between adults. **For an ABA organization's parent-facing site, this is a clean result and it is a real achievement.** The strategy library (`src/lib/atHomeStrategies.ts`) is antecedent- and skill-based throughout.

Fix the broken crisis link (Blocker B-3) and this page is publishable as-is.

---

## 2. `src/lib/bandwidth.ts` is the right answer to a problem the rest of the site still has

Three things make this module unusually good:

**The doc comment is honest about why it exists.** `:1-26` names the failure it replaces — measurement scattered across four surfaces — and states the reason plainly: *"a measurement that doesn't change anything just adds shame."* Then it enumerates what the thing is not: *"Not a diagnosis. Not a mental health score. Not a streak. Not a benchmark. Not a number to chase."* I have rarely seen a product decision documented this well in code.

**The measurement does something.** `:167-172` — `TIER_STEP_LIMIT` makes the tier gate how many steps the care plan shows. Three sliders, four tiers, one consequence. That is a complete contract, and it is why this instrument is defensible where `RiskEngine.ts` is not: it does not classify the person, it sizes the plan.

**Internal severity is separated from user-facing language.** `:143-148` — the tier IDs are `high-risk` and `severe`; the labels the caregiver reads are **"Stretched thin"** and **"Today is heavy."** The engineering can be blunt while the copy stays human. `:150-161` extends this — every tier's result copy ends with a forward-looking "we'll" statement so nothing reads as a verdict.

**This should be the only wellness instrument on the site.** Retiring `RiskEngine.ts` in its favour resolves Blockers B-5 and B-6 together.

---

## 3. `scripts/care-plan-safety-audit.mjs` — a clinical guardrail enforced by CI

`package.json:10` wires this into `prebuild`, so the build fails if the care-plan flow ever regresses. It asserts, over `src/app/support/care-plan`, `src/app/support/intake`, `src/lib/buildPlan.ts`, and the parent-first content files:

- no `localStorage` / `sessionStorage` / `document.cookie` except an explicit legacy-cleanup deletion (`:32-42`)
- no `fetch`, no AI gateway, no model references (`:44-48`)
- no `<form>` elements (`:50-54`)
- no `<textarea>`, no `contenteditable` (`:57-59`)
- only `radio` and `checkbox` inputs — any other input type throws (`:61-67`)

I verified it runs and passes. A companion script, `care-plan-content-uniqueness.mjs`, asserts 488 distinct strings across 21 rows with **zero duplicates** — which is why the care-plan flow does not exhibit the copy-paste problem the brief asked me to look for.

**This is the single most transferable pattern in the codebase.** The Mental Health Center — which stores eight self-reported mental-health dimensions, free-text journal entries, and a name — has no equivalent coverage at all. Extending this harness to `/support/mental-health` would have caught Blockers B-1 and B-4 before they shipped.

---

## 4. `/support/find` — the Spanish implementation and the shortlist privacy model

**A real bilingual implementation.** `find/page.tsx:46, 116-172, 450-454` — a complete `en`/`es` string table with a working toggle, including translated blurbs in `resources.ts:387-401` written by someone who speaks Spanish (*"Información y referidos en español de un equipo familiarizado con el sistema de Texas"*). This is the only page on the site with it. **The string-table structure is directly reusable** — extending it to the crisis pages and `/support/care-plan` is mechanical, not exploratory.

**Honest listing framing.** `find/page.tsx:114` — *"Listings are informational, not rankings or endorsements. Confirm availability, insurance, and services directly with each organization."* This is exactly the disclaimer a provider directory needs, and it is one line away from the listings themselves. `providers.ts:240, 406, 486` even marks unconfirmed language support as `'Spanish — verify'` rather than asserting it. **The homepage provider cards (`design-preview/page.tsx:96-101`) should adopt this framing** — they currently name four real businesses with no such qualifier.

**Correct table handling.** `find/page.tsx:816` wraps the comparison table in `overflow-x-auto`. `privacy/page.tsx:163` uses `overflow-hidden` and clips. This page is right; make it the rule.

---

## 5. `/support/caregiver` and `/support/couples` — the disclaimer pattern to copy

`caregiver/page.tsx:133`:
> *"Common Ground is parent support, not clinical care. These tools are general mental-health techniques drawn from public, evidence-based practice. They do not diagnose, treat, or replace care from a licensed clinician. If you are in crisis, call or text **988**."*

`couples/page.tsx:245`:
> *"**Scope note:** This page offers general relationship and co-parenting education. It does not provide legal advice, diagnose a relationship, replace licensed care, or make decisions about your child's treatment plan."*

Both are specific about what is being disclaimed, both name the alternative, and the first makes 988 tappable inside the disclaimer itself. Neither is buried. `caregiver/page.tsx:128` also does something small and smart — the "If a tool isn't enough today" panel puts human support and 988 one click from every tool, in a persistent expander rather than a footnote.

**These two sentences are the model.** Every page that produces guidance should carry an equivalent, written for that page's specific risk.

---

## 6. `/support/check-in` — the correct crisis-interrupt pattern, already built

`check-in/page.tsx:153-170` — when `shouldShowCrisisCallout(tier)` is true (severe tier only), the page renders a bordered rose panel *before* the routine continue action, containing a tappable 988 button and the sentence *"Common Ground is not a crisis service."*

This is precisely what `/support/mental-health` fails to do at its "At-risk zone" band (Blocker B-5) and what `/support/hard-days` fails to do at "Crisis zone" (H-1). **The pattern does not need to be designed — it needs to be copied from this file into those two.**

---

## 7. `voice.md` — a working editorial standard

Most voice guides are aspirational. This one is enforceable: it gives paired avoid/prefer examples (`voice.md:47-58`), names a canonical reference page (`:12`), and — critically — documents when to break its own rules (`:73-76`): *"Crisis messaging uses normal sentence case because lowercase reads as low-stakes — and 988 is high-stakes."* That is a writer who has thought about the consequence of the style, not just the style.

Two rules deserve to be enforced in CI: `:35` (*"No clinical claims"*) and `:9` (no streak shaming). Both are currently violated — `what-is-aba/page.tsx:406` makes an uncited efficacy claim, and `DashboardTab.tsx:431-434` renders a "day check-in streak" counter. **The guide is right and the code drifted from it.** That is a much better problem than the reverse.

---

## 8. Accessibility and craft items that are genuinely done

- **Alt text is complete and meaningful.** All 11 `<Image>` elements have `alt`; the descriptive ones are actually descriptive (`design-preview/page.tsx:140` — *"Father and daughter doing a puzzle with a Texas ABA Centers therapy kit"*; `couples` hero — *"A couple holding hands at a table, looking toward their child playing outside — a quiet moment of connection amid parenting life."*). Zero missing, zero filename-as-alt.
- **`prefers-reduced-motion` is handled almost everywhere** — `globals.css:182`, `design-preview/page.module.css:1267`, `care-plan/template.tsx:158`, `BorderGlow.css:156`, plus `useReducedMotion()` threaded through `SupportShell`, `CalmMode`, `StabilizeSelector`, and the page templates. `SupportShell.tsx:136, 157, 239, 254` even branches the spring physics on it. Only the mental-health module is missing a block (M-10).
- **`focus-visible` is used 233 times across 383 interactive elements**, and the 13 bare `outline-none` instances almost all pair with a `focus:ring` on the same line. This is well above what I usually find.
- **Dialog semantics exist and are correct in two places** — `caregiver/page.tsx:133` and `at-home/page.tsx:162` both use `role="dialog" aria-modal="true" aria-labelledby`. The fix for the broken onboarding modal (H-5) is a copy-paste from either.
- **The build is clean.** `next build` compiles in 9.3s with no type errors and prerenders 41 routes. Shared First Load JS is 102 kB, which is reasonable for React 19 + Next 15 + framer-motion.
- **Content is well-factored.** `src/content/carePlan*.ts` and `src/lib/*` keep clinical copy out of components and behind stable IDs — which is exactly what makes the CI copy-uniqueness check possible. The brief asked me to flag hardcoded clinical content as a maintenance risk; the care-plan system is the counter-example, and `/client/*` (hardcoded child, BCBA, and mastery criteria) is the risk.

---

## What this list is not

I am not counting the visual design, the motion work, or the writing quality as findings-grade strengths, though all three are above average for the category. The `BorderGlow` effect and the spring-animated nav are accomplished, and the copy on `/support/hard-days` is the most emotionally credible writing I read in the repo. But none of that is what makes a clinical property publishable, and treating it as an offset against the blockers would be the exact inflation the brief warned about.

The genuinely load-bearing strengths are items 1, 2, 3, and 6 — one page, one module, one CI script, and one interaction pattern. Extend those four across the site and most of this audit resolves itself.
