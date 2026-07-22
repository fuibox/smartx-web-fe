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

final result: passed
