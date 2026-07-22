# SmartX V4 design QA

Date: 2026-07-22

Scope: desktop `/v4` round-5 refinement for Signals phone fidelity, All-in-one density, Closing CTA/motion, and Updates editorial polish. Execute is intentionally unchanged pending a dedicated composition discussion. The proposed Learn pipeline is documented, not implemented. Mobile composition remains deferred by `docs/website-v4.md`.

## Rendered evidence

Deterministic browser viewport: 1440×900 CSS px, DPR 1.

| Surface / state | Evidence |
| --- | --- |
| Signals · Smart Money | `output/playwright/v4-round5/01-signals-smart-money.png` |
| Signals · Market | `output/playwright/v4-round5/02-signals-market.png` |
| Signals · Watchlist | `output/playwright/v4-round5/03-signals-watchlist.png` |
| All-in-one | `output/playwright/v4-round5/04-all-in-one.png` |
| Closing · default | `output/playwright/v4-round5/05-closing.png` |
| Closing · CTA hover | `output/playwright/v4-round5/05-closing-hover.png` |
| Updates · default | `output/playwright/v4-round5/06-updates.png` |
| Updates · featured hover | `output/playwright/v4-round5/06-updates-hover.png` |

## Round-5 decisions and results

### Signals / phone fidelity

- Reduced the desktop phone by roughly 9% so it remains the product proof without overpowering the chapter copy.
- Removed the hand-drawn product navigation from the phone shell. The shell now owns only iPhone system/hardware chrome; the real SmartX H5 navigation remains inside each product capture.
- Expanded the internal screenshot viewport so the real H5 bottom navigation is visible above the system Home Indicator without a duplicate icon layer.
- Rebuilt Smart Money / Market / Watchlist as three equal-width, centered columns. The selected rule has a stable width and no longer changes with label length.
- All system and scene labels in the authored shell meet the 11px minimum.

### Execute / Learn

- Execute received no structural change in this round. Its two-path content inventory remains available, but the screen is explicitly not frozen.
- The Learn UI remains unchanged. `docs/website-v4.md` now contains the five-stage Memory nutrient loop contract: receipt enters, analysis decomposes it, four domains consume relevant evidence, information converges, and one refined packet returns to the next-ranking origin.
- The Learn contract includes identity continuity, one-shot/low-frequency timing, transform/opacity-only implementation, reduced-motion behavior, and a semantic fallback.

### All-in-one

- Changed the title to one line: `Every venue. One terminal.`
- Removed the explanatory subtitle, `Context travels with you`, and the `ONE TERMINAL` spine label.
- Preserved the SmartX intelligence-layer hub and one unlabelled relationship line.
- Vertically centered the full brand field while retaining a wide 3×2 venue grid; all six official assets keep icon/name/category/status alignment.

### Closing Banner

- Replaced the repeated `Start with SmartX` copy with the factual kicker `Live on Polymarket` and removed the redundant body sentence.
- Matched the Hero CTA construction: the arrow block is teal from rest, the fill travels from right to left, and the arrow never shifts.
- Three dispersed pixel packets now converge toward the common rail and narrow into one precise output. This directly visualizes `gets sharper` instead of acting as a generic marquee.

### Updates

- Added visible dates to all three placeholder stories.
- Replaced the clipped top-right cover with a consistent 4px radius.
- Added restrained non-link hover feedback: 1.2% cover zoom, category-rule extension, and title color change. No pointer cursor, arrow, or fake permalink was added.

## Interaction and accessibility verification

- Smart Money, Market, and Watchlist switching passed; selected controls report `aria-pressed="true"` and update the real H5 capture.
- Closing CTA default/hover screenshots confirm the teal arrow block remains fixed while the text region fills.
- Updates default/hover screenshots confirm the editorial response without adding a false click affordance.
- No horizontal overflow at 1440×900 (`scrollWidth === clientWidth === 1440`).
- `prefers-reduced-motion: reduce` verification: Closing animation name is `none`, the animated journey is hidden, the static journey is visible, and the page reports zero running Web Animations.
- Browser console: zero runtime errors. The development-only direct-hash test emitted one Next Image LCP suggestion because Signals was forced above the fold; the normal landing route is unaffected.

## Engineering verification

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed; `/v4` prerendered as static content, route size 11 kB and first load 124 kB.
- Motion review: `output/playwright/v4-round5/animation-review.md` — **Approve**.

## Accepted follow-up scope

- Discuss and redesign Execute as a dedicated screen before further implementation.
- Confirm the Learn Memory nutrient loop before replacing the current profile-register visualization.
- Replace static H5 states with final product recording when supplied; the product viewport and shared phone shell remain stable.
- Replace the three article placeholders with Operations' launch content; articles can remain non-links until URLs exist.
- Compose and sign off the dedicated mobile layout only after desktop approval.

## Round-6 Learn / closed-loop rebuild

Scope: only `03 / Learn`. The supplied 1280×720 concept image is the visual source of truth; the existing SmartX V4 palette, typography, and factual four-domain states remain authoritative where the generated concept is ambiguous.

### Rendered evidence

| Surface / state | Evidence |
| --- | --- |
| Source reference · 1280×720 | `output/playwright/v4-round6-learn/reference-1280x720.png` |
| Source + implementation comparison · 1280×720 | `output/playwright/v4-round6-learn/comparison-1280x720.png` |
| Implementation · decomposition state · 1280×720 | `output/playwright/v4-round6-learn/implementation-1280x720.png` |
| Implementation · split-state checkpoint · 1280×720 | `output/playwright/v4-round6-learn/split-state-1280x720.png` |
| Implementation · desktop acceptance · 1440×900 | `output/playwright/v4-round6-learn/implementation-1440x900.png` |

### Findings closed

- **P0 · loop topology:** Next Feed is now the actual loop origin. Rank 05 leaves the queue and enters Memory Reasoner; the rebuilt packet returns through one right-side orthogonal route, lands at rank 01, and 01–04 shift down to refill 02–05. There is no disconnected `Next Feed` label or second implied origin.
- **P0 · decomposition clarity:** Reasoner has one shared output stem, one visible horizontal split, four semantic packets, and four aligned absorbers. The split is traceable from one packet into Interest / Signal / Style / Edge instead of appearing independently over each domain.
- **P1 · factual state:** Interest and Signal absorb/update, Style records, and Edge remains pending. The bottom merge only reassembles written evidence; no unsupported Edge result or aggregate score is invented.
- **P1 · craft and fidelity:** The copy baseline now aligns optically with Reasoner; queue spacing, reasoner scale, absorber spacing, merge point, and return route match the reference composition. Neutral absorber shells, semantic pixels, colored merge traces, and directional chevrons replace the previous sparse prototype lines.
- **P1 · motion:** The complete cycle is 12 seconds. Motion is restricted to `transform` and `opacity`; movement is staged as consume → reason → split → absorb → merge → return → rerank. The title period uses the same teal result color as the returned packet.
- **P2 · accessibility:** The diagram has a full causal `aria-label` and hidden explanatory copy. `prefers-reduced-motion` freezes the semantic final state, removes route movement, and preserves all four domain statuses.

### Intentional differences from the generated image

- `NEXT FEED` remains visible because it names the product consequence; the generated image leaves the queue unlabeled.
- No blur glow, ornamental particle field, or fake scoring UI was added. Contrast comes from semantic color, line hierarchy, and directional motion.
- The browser implementation keeps the canonical SmartX title/body type scale rather than copying minor generated-text raster artifacts.

### Verification

- Source and implementation were compared together at the same 1280×720 viewport and state, then the final composition was rechecked at 1440×900, DPR 1.
- 1440×900 reports no horizontal overflow and no browser runtime errors.
- `npm run typecheck` — passed.
- `npx eslint src/components/v4/story-page.tsx` — passed.
- `npx eslint . --ignore-pattern '.claude/worktrees/**'` — passed. The unfiltered `npm run lint` still traverses another agent's generated `.claude/worktrees/banner-footer/.next` output and fails outside this change scope.
- Animation review — passed: `output/playwright/v4-round6-learn/animation-review.md` (transform/opacity-only movement, no blur glow, no layout-property animation, and an explicit reduced-motion state).

final result: passed

## Round-7 Learn / return-spine refinement

- Moved the complete Memory loop down 42px at desktop size. At 1440×900 the diagram now occupies y=170–820, balancing the left title/copy without touching either viewport edge.
- Tightened the right return route by 69px and changed its hierarchy from a persistent frame into a return spine: the static track is low contrast, arrow density is reduced, and only the segment currently carrying the reassembled packet illuminates.
- Preserved the signed-off topology and timing; the change is visual hierarchy rather than a new narrative.
- Evidence: `output/playwright/v4-round7-learn/learn-return-spine-1440x900.png`.
- No horizontal overflow and no browser runtime errors at 1440×900. Typecheck and the scoped full-project ESLint command pass.
- Animation review: `output/playwright/v4-round7-learn/animation-review.md` — **Approve**.

## Round-8 Learn / queue continuity and semantic distribution

- Rebuilt Next Feed as one clipped six-packet queue driven by one shared transform. Rank 05 can leave while the replacement and remaining four candidates move together, so no rank is temporarily empty and independent opacity windows cannot desynchronize.
- Removed the separate green `settled` object. The returned enriched packet now overlays the persistent muted rank-01 candidate, then its semantic colors dissipate to reveal the same candidate underneath.
- Normalized the diagram to one absolute center axis shared by the queue input, Memory Reasoner, branch origin, merge endpoint, and bottom return-route origin. Only the right-side return spine intentionally breaks symmetry.
- Differentiated the four decomposed packet shapes and output quantities: Interest 5→2, Signal 7→4, Style 6→3, Edge 4→1. Edge remains visibly pending rather than pretending to update.
- Closed the merge-to-return gap and aligned the merge stem endpoint exactly with the bottom route origin.
- Sampled the complete 12-second animation cycle in the real 1440×900 browser: rank 01 remained occupied at every checkpoint while the colored return packet crossed and faded.
- `npm run typecheck`, project ESLint excluding the other agent's generated worktree, and `git diff --check` pass.
- Animation review: `output/playwright/v4-round8-learn/animation-review.md` — **Approve**.
