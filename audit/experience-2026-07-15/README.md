# SmartX Website Experience Audit

- Date: 2026-07-15
- Route: `http://127.0.0.1:3000/motion-lab/narrative/`
- Viewports: 1920 x 1080 and 390 x 844
- Goal: make the experience continuous, calm, legible, credible, and visually distinctive without reading like a product demo.

## Overall verdict

The direction is right, but the current page still feels like three good studies placed next to each other:

1. a distinctive terminal-grid Hero;
2. a spatial market-intelligence film;
3. a product mock followed by a conventional editorial footer.

The primary problem is not a lack of effects. The page lacks one persistent visual carrier and one stable hierarchy. Each state introduces a new center of attention, a new visual grammar, and a new density level. The user repeatedly has to re-orient.

The next pass should prioritize continuity and product truth before adding more visual effects.

## Implementation result

The approved pass was implemented on 2026-07-15:

- Snap states reduced from six to five; Lock remains an in-flight feedback moment.
- Total pinned distance is `4.65` viewports, with a slower scrub and directional magnetic settle so transition choreography remains visible.
- A keyboard-accessible five-state chapter rail now replaces the hidden-scrollbar ambiguity.
- Hero Canvas fade was delayed and lengthened so the source grid and incoming starfield overlap instead of producing a black gap.
- Postprocessing now starts only after the bright Hero relay has fully exited, removing the gray-white transition frame.
- Make the Trade now converges the Planet into the live chart endpoint and keeps Fast Move, Smart Money, News, capital structure, and related-market context attached to that price.
- The right column is editorial and links to the real product; the staged amount/outcome trade form has been removed.
- The Decision Anchor travels from the product composition into the AI Memory receipt position.
- Planet orbits render as complete loops rather than disappearing behind the sphere.
- Memory uses system typography for dense reading, merges its four dimensions into the right panel, and supports both DOM and Canvas node selection.
- Memory exits through a shared horizon into normal document scrolling.
- Updates use one title typeface and a stronger row/media hover state; Footer uses the same structured launch CTA grammar as Hero.
- Hero, Trade, closing, and footer links carry placement-specific UTM content values into `app.smartx.io`.
- Reduced-motion users receive the original static Hero followed by the same Signal, Inspection, Trade, and Memory information in normal document flow.

Implementation evidence is in `output/playwright/design-pass-2026-07-15-v2/`.

## Flow health

| Step | State | Health | Main observation |
| --- | --- | --- | --- |
| 1 | Hero | Good foundation | Strongest brand moment, but the next chapter is not clearly discoverable. |
| 2 | See the Move | Promising | The starfield is attractive but still generic; the market meaning is weak. |
| 3 | Signal Lock | Needs change | It behaves like an extra stop and creates a quiet dead zone between two meaningful chapters. |
| 4 | Know the Why | Mixed | Evidence is more relevant now, but the planet, four labels, rings, particles, and title all compete. |
| 5 | Make the Trade | Redesign | The left/right structure is valid, but the product crop dominates and still reads as a staged mock. |
| 6 | AI Memory | Promising | The idea is strong, but the causal link from the trade is not yet the visual protagonist. |
| 7 | Memory to Updates | Mixed | Normal document scrolling is correct, but the large empty band makes the handoff feel accidental. |
| 8 | Updates | Good foundation | Editorial rows are preferable to cards; typography and link credibility need refinement. |
| 9 | Footer | Redesign | Six tiny columns, inert items, and a boxed CTA make the ending dense and prototype-like. |

## Highest-impact findings

### P0: Create one persistent signal carrier

The selected signal should remain perceptually identical throughout the story:

`meteor -> inspected resource node -> chart endpoint -> decision receipt -> Memory node -> Updates horizon`

Color, screen position, scale, and motion direction can evolve, but the user should never have to guess whether a new object represents the previous one.

### P0: Reduce the number of narrative stops

There are currently six snap points: Hero, Signal, Lock, Inspection, Product, and Memory. Signal Lock is not a full chapter and should not be a magnetic stop. It should be a short moment inside the flight from See the Move to Know the Why.

Recommended anchors:

1. Hero
2. See the Move
3. Know the Why
4. Make the Trade
5. AI Memory

The total pinned distance can move from 5.2 viewports toward roughly 4 viewports. The user should spend more time settled on meaningful states and less time feeding the scroll timeline.

### P0: Add a quiet progress affordance

The runtime hides the native scrollbar, while the integrated route does not show the existing scroll marker. The result is visually clean but makes both the existence and the length of the story unclear.

Use one restrained progress device instead of explanatory copy:

- begin as a small scroll glyph below the Hero CTA;
- become a thin five-state chapter rail after the first gesture;
- show only the active chapter label during transitions;
- allow keyboard focus and direct chapter navigation;
- disappear when normal Updates scrolling begins.

### P0: Establish a motion-energy curve

Motion should not have the same energy everywhere:

- Hero: ambient and restrained
- See the Move: acceleration and discovery
- Lock: rapid deceleration
- Know the Why: mostly still, with one active evidence path
- Make the Trade: stable and precise
- AI Memory: one causal pulse after confirmation
- Updates and Footer: normal document motion only

Random meteors and dense particle movement should calm down once the user is expected to read.

### P0: Raise the readability floor

Many labels and supporting lines are 8-10 px. This makes the interface feel like a scaled-down concept image instead of a usable product.

- Data labels: minimum 11-12 px
- Body and explanatory text: 13-15 px
- Footer links: 12-13 px
- Keep the pixel face for brand moments, chapter titles, and short labels only
- Use the body/utility face for product copy, article titles, controls, and navigation

The pixel type is currently used so broadly that Hero, product, Updates, and Footer all have the same voice and therefore no hierarchy.

## Make the Trade

### Current problems

- The chart is the largest object, but it is mostly decorative and simplified.
- Product details are miniature, so the large UI does not produce more credibility.
- The evidence rail repeats information already explained on the planet.
- The right side mixes headline, explanation, decision summary, form, and system disclaimer at similar visual weights.
- The default fixture says `Live context` while the action says `Simulation only`, which weakens trust.
- On mobile, Amount, price summary, decision basis, and Memory feedback are hidden to make the composition fit. The remaining action no longer resembles a complete trade.

### Recommended desktop composition

Use an art-directed crop of real Marin components instead of a complete miniature terminal.

```text
| actual market detail crop, 56-60% | decision column, 32-36% |
| chart + selected evidence point   | Make the Trade          |
| only the UI needed for this act   | YES 68.4 cents          |
|                                   | outcome / amount / CTA   |
|                                   | decision receipt         |
```

- Keep the product crop unframed or use only a subtle product boundary; do not present it as a screenshot card.
- Use the real market header, chart component, and order controls with deterministic fixtures.
- Carry the four evidence inputs into one concise decision receipt rather than repeating the full evidence rail.
- Align the trade panel vertically with the chart endpoint so the decision feels attached to the movement.
- Let the product UI enter in layers: chart line first, market context second, trade action last.

### Transition in

The selected orbit should flatten into the chart line. Its active node becomes the current chart point. Evidence labels should dock into chart annotations before the rest of the product UI appears. Avoid fading the entire product shell in as a new object.

### Transition out

After confirmation, collapse the trade action into a compact decision receipt containing outcome, amount, price, and evidence count. That receipt travels into AI Memory and becomes the active Memory node. This is the strongest opportunity to make the product mechanism understandable without adding copy.

### Mobile composition

- Keep decision basis, price, amount, and CTA visible.
- Limit the chart to about 40-45% of the viewport.
- Put the decision summary before the chart or pin a compact ticket beneath it.
- Do not hide essential transaction state; reduce secondary chart chrome instead.

## AI Memory

- The strongest story is not the universe itself; it is what changed because of this trade.
- Default state should visibly distinguish an example from a confirmed user action.
- After a simulated trade, highlight exactly one changed dimension first, then let the user inspect the others.
- Reduce the number of simultaneous labels. The current right detail panel plus bottom navigation plus five spatial nodes creates three competing reading systems.
- On mobile, the large detail panel covers the visualization. Use a compact active-dimension summary and reveal deeper details on tap.

## Updates and Footer

### Transition back to the website

Ending the pinned spatial story before Updates is the correct decision. The handoff should be shorter and more intentional:

- shrink the current empty band;
- flatten the final Memory orbit into a horizontal rule;
- reuse that rule as the top edge of Updates;
- stop particles, depth motion, and chapter snapping completely.

This gives the user a clear physical return from spatial narrative to document reading.

### Updates

- Keep the current editorial-row structure; it is calmer and more credible than cards.
- Use a readable typeface for article titles instead of the pixel display face.
- Restore a meaningful featured visual at tablet widths instead of hiding it at 1180 px.
- Give every article its real destination. Three rows pointing to the same Medium homepage reads as placeholder content.
- Keep one featured item and two compact items; do not make the section longer.

### Footer

The Footer should become a trust layer, not a sitemap dump.

Recommended structure:

```text
Full-width closing band
SmartX vision --------------------------- Open SmartX

Footer main row
Brand + one sentence     Product     Resources     Community

Footer bottom row
Copyright     Terms / Privacy / Risk     Status only if real
```

- Remove the outlined CTA card treatment; use a full-width closing band.
- Reduce six equal columns to one brand block and three useful link groups.
- Product names should be real links or be removed. Inert text looks unfinished.
- Terms, Privacy, and Risk Disclosure should be links. Do not ship placeholder legal labels.
- `All systems operational` should link to a real status source or be omitted.
- Move TradingView attribution next to the chart or into the legal row if required.
- Increase link size and contrast.
- On mobile, keep legal and status information; do not hide trust content to save space.
- Stop the background grid before or at the Footer so the page gets a calm final surface.

## Design principles for the next pass

1. One focal point per state.
2. One persistent object across transitions.
3. Motion slows down when reading begins.
4. Real product structure beats decorative product simulation.
5. Pixel typography is a signature, not the default for every line.
6. Essential transaction information is never removed on mobile.
7. After Memory, the website behaves like a normal document.
8. Footer content must be real, linked, and trust-building.

## Accessibility and interaction risks

- The hidden scrollbar needs an equivalent progress affordance and a way to skip the long pinned scene.
- The current reduced-motion branch lands on Product and omits the Signal, Why, and AI Memory story. Reduced motion should use short crossfades or normal stacked sections, not remove content.
- 8-10 px labels and low-contrast footer links are difficult to read even at 1920 px.
- Mobile hides essential trade information and legal/status content instead of reflowing it.
- Add a skip link and verify keyboard order through chapter navigation, product context controls, Memory dimensions, Updates, and Footer.
- The amount input needs a stable `name` and an intentional autocomplete policy before production.

## Skill strategy

### Use now

- `product-design:audit`: flow, hierarchy, trust, and responsive review.
- `frontend-design`: visual direction, typography roles, and composition.
- `web-design-guidelines`: accessibility, focus, responsive, and interaction checks.
- `playwright`: exact-state screenshots, mobile checks, and transition recordings.
- `vercel:react-best-practices`: run after visual structure is stable to protect runtime performance.

### Worth adding

- `emilkowalski/skills`: use `improve-animations` for the complete GSAP/CSS motion pass, `review-animations` for final timing/easing review, and `apple-design` for fluid spatial continuity.
- `pbakaus/impeccable`: most useful commands here are `typeset`, `layout`, `distill`, `animate`, and `polish`.

### Not the primary tool for this problem

- `shadcn/improve` is useful after the design is frozen, when the work needs to be split into precise implementation plans. It is not a visual-direction or motion-polish skill.
- A new component-effects library is not required. The existing R3F + GSAP + React stack is sufficient; the missing work is art direction, semantic motion, and product-component fidelity.

## Recommended execution order

1. Freeze the continuity model and reduce the snap states.
2. Redesign Make the Trade on desktop and mobile using real product components.
3. Implement the trade-receipt-to-Memory handoff.
4. Rebuild the Updates exit and Footer information architecture.
5. Run typography/layout distillation.
6. Run motion timing, performance, reduced-motion, keyboard, and responsive QA.

## Evidence

Captured screenshots are in `output/playwright/design-audit-2026-07-15/`.
