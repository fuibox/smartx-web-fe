# SmartX narrative desktop audit

Viewport: 1440 × 900. Captured from the local narrative homepage.

## Flow evidence

1. `01-hero-desktop.png` — strong visual identity and clear opening CTA; the hero still reads more like a brand statement than a product promise.
2. `02-see-the-move.png` — four signal types are visible, but the meteors are not explicitly mapped to the legend and the scene leaves a large amount of unused space.
3. `03-signal-lock.png` — the selected meteor and copy are spatially connected, but the copy is still visually quiet compared with the canvas.
4. `04-know-the-why.png` — all orbit lines render, but the planet/orbit metaphor does not yet explain how evidence becomes a decision.
5. `05-product.png` — the product handoff is the strongest state: evidence, price, chart, and action are concrete.
6. `06-memory.png` — the trade receipt makes the memory handoff legible, though the transition is abrupt after the product state.

## Highest-impact findings

- Know the Why is structurally under-explained: the sphere is the dominant visual, while the causal relationship between the selected signal, four evidence dimensions, and the future chart is secondary.
- The active evidence state is not visibly coupled to a named orbit. The orbit colors, meteor colors, signal labels, and evidence labels should share one explicit mapping.
- The lock-to-why transition fades between two metaphors instead of transforming the locked signal into the evidence constellation.
- The flow is strongest only when it reaches the product chart. Earlier scenes need one concrete decision object to carry through the narrative.

## Accessibility limits

The DOM exposes chapter navigation and product evidence buttons with useful names and `aria-pressed` state. The core narrative visualization is still canvas/WebGL-led, so keyboard reading order, screen-reader equivalents, and reduced-motion comprehension need a dedicated pass beyond screenshot evidence.
