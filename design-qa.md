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

---

# Waitlist follow-up — mobile hierarchy and result actions · 2026-08-28

## Scope

- Waitlist screens only; the shared SmartX navigation was not changed.
- Direct entry H5, quiz question H5, and the signed-in result action area.
- Backend question fetching, invite handling, authentication, and result recovery logic remain unchanged.

## Comparison evidence

- Direct-entry source: `/var/folders/jx/8lhk_zbj02d4hb48l_8_10940000gn/T/codex-clipboard-805abfb5-cd0b-4c60-8a4d-16aec39c2d20.png`.
- Direct-entry implementation: `output/browser/waitlist-ui-followup/entry-mobile.png`.
- Side-by-side direct-entry comparison: `output/browser/waitlist-ui-followup/compare-entry.png`.
- Quiz source: `/var/folders/jx/8lhk_zbj02d4hb48l_8_10940000gn/T/codex-clipboard-0e56b9ea-e1a1-45fd-a796-3760e861f5cc.png`.
- Quiz implementation: `output/browser/waitlist-ui-followup/quiz-2-mobile.png`.
- Side-by-side quiz comparison: `output/browser/waitlist-ui-followup/compare-quiz.png`.
- Result closed state: `output/browser/waitlist-ui-followup/result-desktop-closed.png` and `result-mobile-closed.png`.
- Result download disclosure: `output/browser/waitlist-ui-followup/result-desktop-open.png` and `result-mobile-open.png`.
- Responsive browser checks used a 390 × 844 viewport override; the in-app browser content capture is 375 × 812 after browser chrome.

## Findings and resolutions

| Severity | Finding | Resolution |
| --- | --- | --- |
| P1 | The quiz artwork occupied nearly half of the H5 viewport, pushing most of the question and options below the fold. | Reduced the artwork to a responsive `200–260px` context strip and tightened the question-panel top spacing. The prompt and three answer choices are now visible in the verification capture. |
| P1 | The direct-entry headline inherited a desktop hard break, producing an awkward four-line mobile title. | Mobile now ignores the desktop break, uses a slightly tighter responsive display size, and preserves a real word space; the headline settles into three readable lines. |
| P2 | The direct-entry eyebrow repeated information already expressed by the headline and primary CTA. | Removed `The SmartX trader type test`; retained only conversion-relevant reassurance and alternate paths. |
| P2 | Result-card format choices were always visible under the persona poster, increasing page noise and separating download from sharing. | Moved Download next to Share result in the right action area. Story and X / TG sizes render only after the semantic disclosure is opened. |
| P2 | A long download label would crowd the two-column H5 action row. | Added the localized short label `Download` for English, Simplified Chinese, Japanese, and Korean. |

## Interaction and accessibility

- Download is a native `details` / `summary` disclosure, so keyboard activation and open/closed semantics are retained without a custom menu state machine.
- The closed state exposes no format choices; the open state exposes two labelled download links with exact pixel dimensions.
- Focus-visible styling covers the disclosure trigger and both download links.
- The direct entry, quiz options, result share, copy-link, sign-out, and demo-review controls remain operable in the verified states.

## Engineering validation

- `npm run compile` — passed; all four locale catalogs compiled.
- `npm run typecheck` — passed.
- `npm run lint` — passed with the existing `src/lingui/LinguiProvider.tsx:55` exhaustive-deps warning and no errors.
- `npm run build` — passed; 17 static pages generated and `/waitlist` exported successfully.
- `git diff --check` — passed.

final result: passed

---

# Waitlist direct entry — conversion hierarchy and layout QA · 2026-08-28

## Scope and evidence

- Source visual truth: `/var/folders/jx/8lhk_zbj02d4hb48l_8_10940000gn/T/codex-clipboard-d7ba7154-d841-41e5-a172-4e59b96d0e04.png`.
- Source pixels: `3816 × 1894`, representing a `1908 × 947` @2x desktop capture.
- Implementation route/state: `/waitlist/`, direct entry, English, no demo overlay.
- Implementation screenshot: `output/playwright/waitlist-entry-first-principles/desktop-live-1404x697.jpg`.
- Comparison viewport and implementation pixels: `1404 × 697`, device scale factor 1.
- Density normalization: the source was downsampled to `1404 × 697` as `output/playwright/waitlist-entry-first-principles/source-normalized-1404x697.jpg`; no browser chrome or device frame is included.
- Full-view combined comparison: `output/playwright/waitlist-entry-first-principles/comparison-full.jpg`.
- Focused copy/form comparison: `output/playwright/waitlist-entry-first-principles/comparison-focused.jpg`.
- Responsive evidence: `output/playwright/waitlist-entry-first-principles/desktop-1024x768.jpg`, `mobile-live-390x844.jpg`, and `mobile-zh-390x844.jpg`.

## Intended product changes

- The supplied screenshot is the visual-language source, while the user-requested structural target intentionally reverses the desktop composition from copy-left/art-right to art-left/copy-right.
- Natural users now receive one unambiguous primary action, `Start the test`, with `No invite needed` directly below it. The invite-code path is a clearly labelled secondary branch, and result recovery remains tertiary.
- Navigation, backend-provided questions, login/recovery behavior, and the friend-invite entry are outside this layout change and remain intact.

## Findings and comparison history

| Round | Severity | Finding | Fix | Post-fix evidence |
| --- | --- | --- | --- | --- |
| 1 | P1 | The no-invite path was a small underlined link beneath a dominant invite-code `Begin` button, so natural visitors could reasonably infer that an invite was required. | Promoted the natural path to the only teal primary CTA and added explicit no-invite reassurance; moved invite entry below a labelled divider with a neutral secondary button. | Full and focused comparisons show the CTA as the strongest element while the invite path remains visible without competing with it. |
| 1 | P1 | Direct entry placed copy on the left and art on the right, contradicting the established friend-entry reading direction. | Reversed the desktop composition to art-left/copy-right and retained the mobile top-art/bottom-copy adaptation. | `desktop-live-1404x697.jpg`, `desktop-1024x768.jpg`, and `mobile-live-390x844.jpg`. |
| 2 | P2 | Entering `?demo=1` did not set review-only state until the reviewer changed the screen selector, so the first click could still reach a mutating invite reservation call. | Initialize demo mode from the query string and reset the invite field whenever the direct-entry target is selected. | In review mode, both the no-invite CTA and a valid invite code enter the quiz without reservation; result recovery enters the email stage. |
| 3 | — | Rechecked the final desktop, mid-width, mobile, and Chinese states after the hierarchy and demo-safety fixes. | No actionable P0/P1/P2 issue remains. | Combined comparisons, responsive captures, clean console tab, and interaction checks listed below. |

## Required fidelity surfaces

- **Fonts and typography:** the Playfair display title, IBM Plex/Inter body and control text, weights, line-height, and two-line desktop title preserve the source hierarchy. Mobile wraps naturally without truncation; Chinese switches fully to localized copy.
- **Spacing and layout rhythm:** the desktop uses equal visual halves with the supplied artwork enlarged on the left and a bounded 620px action column on the right. The 1024px desktop capture has no collision or overflow. H5 keeps the existing top-art flow and a readable action sequence.
- **Colors and tokens:** black canvas, white title/body, muted secondary text, `#08DFB5` primary CTA, pill radii, and low-contrast neutral invite state remain aligned with the Waitlist design system.
- **Image quality and asset fidelity:** the existing `waitlist-intro.png` source asset is reused without replacement, stretching, CSS recreation, or generated substitute. Scaling preserves its monochrome linework and human figures at desktop and mobile sizes.
- **Copy and content:** the main CTA communicates the default action; `No invite needed` removes qualification anxiety; `Have an invite code?` and `Start with invite` define the secondary path; result recovery remains visible. New copy is translated in English, Simplified Chinese, Japanese, and Korean catalogs.

## Interaction, responsiveness, and console verification

- `Start the test` is enabled on first view and reaches the quiz.
- A valid eight-character invite enables `Start with invite`; review mode reaches the quiz without mutating backend reservation data.
- `Already tested? View my result` reaches the recovery email stage.
- English and Simplified Chinese were switched in the real browser; all four new strings changed language with no English fallback.
- Desktop `1404 × 697`, desktop `1024 × 768`, and mobile `390 × 844` checks reported no horizontal document overflow.
- A fresh browser tab after the final dev-server restart reported zero console warnings and zero console errors.

## Engineering validation

- `npm run typecheck` — passed.
- `npm run lint` — passed with one pre-existing warning in `src/lingui/LinguiProvider.tsx:55`; zero errors.
- `npm run build` — passed; 17 static pages generated.
- Production build temporarily invalidated the running Next.js development manifest; the preview server was restarted and the final browser pass was clean.

final result: passed

### Consumer homepage · Screen 5 SmartX Hub and demo identity pass · 2026-08-25

- Source asset: `public/assets/consumer-network/account-hub-network-brand-teal.webp` (`1920 × 800`). The SmartX-owned glow and circuit traces use the website brand teal `#08DFB5`; Apple, Google, bank, Coinbase, Binance, Solana, Robinhood, Base, and BNB Chain retain their distinct colors.
- Desktop implementation evidence: `output/playwright/consumer-screen5-final-1440.png`, captured in the in-app browser at `1440 × 900` with the 800px section aligned to the viewport top.
- Required combined comparison: `output/playwright/consumer-screen5-source-implementation-comparison.png`. The source is normalized to the same 1440 × 800 section frame and shown beside the implementation in one comparison input.
- The image is rendered at approximately 94% on desktop to avoid amplifying the deliberately soft texture. A short four-edge mask blends the bitmap into the page background, and a separate elliptical matte removes circuit detail directly behind the copy without creating a rectangular panel.
- The hub, confirmed logos, and major routes remain readable; the copy column has a stable dark reading field. The HTML copy remains outside the bitmap, so line wrapping, contrast, and accessibility do not depend on generated text.
- The section has a single 1400ms entry settle using only opacity and transform. `prefers-reduced-motion` removes the entry animation and keeps the final image state.
- Mobile was checked at `390 × 844`; it uses a dedicated cover crop and vertical copy shade rather than mechanically applying the desktop mask.
- Second-screen public identities now use `Trader 01–04` plus `Verified profile / Demo profile`. No `@handle` remains in the rendered component. Named endorsement copy is replaced with neutral relationship text such as `A trader you follow liked this`.
- TypeScript, ESLint, `git diff --check`, and the production build passed. The development server was restarted after the production build so the local preview no longer shares stale build output.

Decision: **Approve**.

final result: passed

---

# Blog masthead and related-story simplification · 2026-08-25

## Scope and evidence

- Routes: `/blog/` and `/blog/[slug]/` on `codex/blog-consumer-redesign`.
- Required desktop check: `1440 × 900`; mobile check: `390 × 844`.
- Evidence: `output/playwright/blog-typography-refinement/final-list-simplified-1440.png`, `final-related-grid-1440.png`, `final-list-simplified-390.png`, and `final-related-grid-390.png`.
- The final pass used the in-app browser against the live local Next.js preview. Dark/light switching, console output, page overflow, and responsive card order were checked after the layout changes.

## Findings and resolutions

| Severity | Finding | Resolution |
| --- | --- | --- |
| P2 | The Blog masthead behaved like a second hero: Field notes, article count, update date, and a two-line display title delayed the first story. | Reduced it to one `SmartX Journal` line plus one short description. At `1440 × 900`, the masthead is about `173px` high and the featured story begins at about `238px`. |
| P2 | The related-story area mixed one large lead with two text rows, creating unnecessary hierarchy and height. | Replaced it with three equal `394.7px` desktop columns at `1440px`; every card uses the same image, metadata, and title structure. |
| P2 | `Keep reading`, lead excerpts, Read story, and arrow treatments repeated intent already communicated by `From the journal`. | Removed them. The section now has one left-aligned title and a single top rule. |
| P2 | The simplified desktop grid could become too narrow on phones. | Kept three equal columns on desktop and switched to one ordered column at `640px`, preserving `01 / 02 / 03` and full-width images. |

## Final QA

- Typography: the list masthead remains the only large serif statement; related-card titles and metadata use IBM Plex Sans. No PixelOperatorMono or JetBrainsMono appears in public Blog UI.
- Spacing: the list masthead is reduced to roughly two-thirds of its previous height; the related section is a compact `614px` including its bottom spacing and footer handoff.
- Color and imagery: dark/light Blog tokens remain intact; all three related stories use their real semantic cover assets at a consistent `16:9` crop.
- Copy: Field notes, story count, updated date, and Keep reading are absent. The masthead explanation is a single sentence.
- Responsive behavior: no horizontal overflow was detected at `1440 × 900` or `390 × 844`; the three related cards keep their document order when stacked.
- Interaction and accessibility: all card links retain visible focus states and restrained hover feedback; reduced-motion removes image scaling transitions; the Blog-only theme toggle remains available on both list and detail routes.
- Runtime: the fresh final tab reported no console errors or warnings.

Decision: **Approve**.

final result: passed

---

### Be early concentric-wave rebuild · 2026-08-25

- Source visual truth: `/var/folders/jx/8lhk_zbj02d4hb48l_8_10940000gn/T/codex-clipboard-304fce69-316b-4be5-a921-a539ca719f4d.png` (`3840 × 2560`). The supplied Robinhood capture is a motion reference only; its lime palette, line primitives, and page composition are intentionally not copied.
- Implementation: `http://localhost:3000/`, desktop viewport override `1440 × 900`, browser capture `1390 × 891`; the Closing section is `600 CSS px` high and its canvas backing store is `2850 × 1200` at DPR 2.
- Normalized source: `output/playwright/consumer-closing-wave-reference.png` (`1390 × 594`). Implementation crop: `output/playwright/consumer-closing-wave-a.png` (`1390 × 594`). Side-by-side comparison: `output/playwright/consumer-closing-wave-comparison.png` (`2780 × 594`).
- State: Closing section fully visible, live motion running when the tab is foregrounded. The focused comparison is also the full relevant surface because this pass changes only the Closing background.

**Fidelity findings**

- Typography/copy: `Be early`, supporting sentence, and CTA typography remain unchanged and centered; no reference text was rasterized into the effect.
- Spacing/layout: all generated circles share the copy center; a gradual elliptical quiet zone protects the title and CTA without a visible rectangular mask.
- Color/tokens: the field stays monochrome on `#010101`; teal remains exclusive to the CTA.
- Image quality: the low-resolution bitmap is no longer rendered. Canvas is resolution-aware with DPR capped at 2, so dot edges remain clear at desktop and large-screen sizes.
- Content: the effect communicates a signal radiating from `Be early`; no extra controls, labels, particles, or Robinhood-specific visual language were introduced.
- No actionable P0/P1/P2 mismatch remains. Optional P3: the product/UI owner may tune wave contrast after viewing a full cycle.

**Animation review**

| Before | After | Why |
| --- | --- | --- |
| One low-resolution bitmap with offset circular paths | One mathematically centered point field with periodic radial wave distance | Removes geometry drift and keeps every visible wave tied to the title origin |
| Multiple visual rings implied by one fixed raster | Every dot is evaluated once and assigned to one of 12 batched brightness paths | Avoids layered-image interference and reduces Canvas fill calls |
| Static settle animation on the whole image | Continuous low-speed radial propagation plus restrained angular brightness circulation | Motion now explains outward network formation; the Robinhood influence stays secondary |
| Full-resolution work regardless of visibility | DPR capped at 2, render capped at 40fps, and `requestAnimationFrame` stops offscreen | Controls main-thread painting without reducing foreground clarity |
| No valid motion fallback for a redesigned field | Reduced motion draws one stable concentric state and never schedules movement | Preserves the visual meaning without positional animation |

**Animation verdict**

- Performance: Canvas painting is necessary for a responsive, non-layered point field; the 12-path batching, adaptive `14–20px` spacing, DPR cap, 40fps ceiling, and offscreen pause remove the obvious avoidable cost. There is no easy transform-only substitute that preserves per-dot radial behavior.
- Interruptibility and timing: this is ambient explanatory motion rather than a user-triggered UI transition. It resumes from current time when visible and stops immediately offscreen.
- Origin, physicality, and cohesion: the title center is the single origin; the angular component changes brightness only and never displaces the rings.
- Accessibility: `prefers-reduced-motion` is handled in the component and produces a static final field.
- Decision: **Approve**.
- Engineering: `npm run typecheck`, `npm run lint`, `git diff --check`, and `npm run build` passed. The final browser tab reported no warnings or errors.

final result: passed

---

### Consumer homepage CTA and casing pass · 2026-08-25

- Source truth: current user instruction for the Consumer homepage header, waitlist behavior, and Discovery eyebrow casing. The One Account Figma frames `22160:8612`, `22160:8821`, and `22160:9028` were reviewed as proposal inputs only; no unapproved One Account redesign was implemented in this pass.
- Implementation evidence: `output/playwright/consumer-hero-cta-v4.png`, captured in the in-app browser at `1440 × 900`, DPR 1. The screenshot shows the right-aligned `Launch Alpha` header action and the retained centered `Join the Waitlist` CTA without changing Hero composition.
- Interaction check: clicking either `Join the Waitlist` button keeps the visitor on `/`, replaces that button label with `Coming soon` for 2.2 seconds, and then restores the original label. `Launch Alpha` remains a real link to the current Alpha.
- Copy check: `Personalized for you` exists exactly once in sentence case; the previous all-caps string is absent.
- Layout check: the header remains 65px high; the `Launch Alpha` CTA fits without collision or overflow. Browser console reported no warnings or errors.
- Engineering: `npm run typecheck`, `npm run lint`, `git diff --check`, and `npm run build` passed.

final result: passed

---

# Consumer Network Blog redesign — design QA

## Scope

- Branch: `codex/blog-consumer-redesign`
- Worktree: `/Users/wuxiuchen/Downloads/同步空间/SmartX/smartx-web-fe-blog-redesign`
- Reference: the signed-off Consumer Network homepage on `/`, not the retired navy/pixel Blog treatment
- Implementation: `/blog/`, `/blog/page/2/`, and all seven published `/blog/[slug]/` routes
- Primary browser viewport: 1440 × 900, DPR 1
- Responsive verification viewport: 390 × 844
- States: Blog index page 1 and page 2, article dark and light reading themes, sticky contents rail, pagination, and reduced-motion CSS fallbacks

## Comparison evidence

- Homepage hero + Blog index in one comparison input: `output/playwright/blog-consumer-redesign/comparison-home-blog-list.png`
- Homepage Consumer Network section + Blog article body in one comparison input: `output/playwright/blog-consumer-redesign/comparison-home-blog-detail.png`
- Reference captures: `/var/folders/jx/8lhk_zbj02d4hb48l_8_10940000gn/T/smartx-blog-design-audit/01-home-top.png` and `02-home-network.png`
- Implementation captures: `blog-list-1440-top-final.png`, `blog-list-1440-rows.png`, `blog-list-page2-1440.png`, `blog-detail-1440-top.png`, `blog-detail-1440-body.png`, and `blog-detail-1440-light.png` in the same evidence directory
- Responsive captures: `blog-list-390-top.png` and `blog-detail-390-top.png`

## Visual system fidelity

- **Typography:** Playfair Display carries Journal and article display titles; IBM Plex Sans carries navigation, story titles, summaries, and long-form reading; JetBrains Mono carries dates, indices, categories, and read time; Lexend remains exclusive to the SmartX wordmark.
- **Color and background:** the index stays on the homepage's `#010101` canvas with `#08DFB5` as the only strong accent. Article dark mode uses the same foundation; light mode becomes a restrained warm-gray reading surface without changing the product cover palette.
- **Hierarchy and spacing:** the index keeps one lead story and numbered archive rows rather than becoming a card wall. The article preserves a 680px reading column and a 246px sticky contents rail. Desktop whitespace and the 65px site header match the homepage rhythm.
- **Images:** existing real Blog covers remain intact and are consistently framed at 16:9. No generated placeholder, fake product UI, or ornamental stock imagery was introduced.
- **Shell:** header placement, owl/wordmark scale, Product/Blog navigation, waitlist action, and teal footer are shared with the Consumer Network language. Docs and Legal links remain available in the footer.

## Findings and fixes

| Severity | Finding | Resolution |
| --- | --- | --- |
| P1 | The first integrated index inherited the article theme switch even though the approved index is fixed dark; switching it changed only the icon and created a false control. | Added an explicit `allowThemeToggle` header contract. The switch now appears only on article routes, while the index header matches the homepage exactly. |
| P2 | Page 2 contains only one published story, so an empty archive heading and divider would imply missing content. | The archive section is omitted when there are no remaining page items; pagination stays visible and identifies page `02`. |
| P2 | Article covers were visually quiet at the full 1440px screenshot scale and needed focused verification. | Checked the rendered 680 × 383 cover crop at intrinsic image resolution; the source cover, title, chart, and SmartX mark are present without stretching or clipping. |

No P0, P1, or P2 issue remains after the final pass.

## Interaction and accessibility verification

- Pagination `Newer` navigates from `/blog/page/2/` to `/blog/`; the current page state exposes `aria-current="page"`.
- The article theme control switches between dark and light themes and retains an action-specific accessible label.
- The contents rail exposes the active section with `aria-current="location"` and updates during scroll.
- Skip links, focus-visible outlines, semantic headings, labelled navigation, and external-link safety attributes are present.
- Mobile index and article layouts have no visible horizontal clipping at 390 × 844; long headlines, article metadata, and the contents list reflow without collapsing their hierarchy.
- Hover motion is pointer-gated, uses transform/color/opacity only, and is removed by `prefers-reduced-motion`.
- Final browser console check: zero warnings and zero errors.

## Engineering validation

- `npm test` — passed, 8/8 Blog tests.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run build` — passed; 16 static pages generated, including seven published Blog detail routes and `/blog/page/2`.
- `git diff --check` — passed.

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

---

# Consumer Network homepage — design QA

## Scope

- Branch: `codex/consumer-network-redesign`
- Reference: Figma file `t38RJ52jEzew2IHUY4EwTA`, frames `22134:8149` through `22134:8330`
- Implementation: `/` in the existing SmartX Next.js application
- Browser verification viewport: 1280 × 720, DPR 2
- Reference frame sizes: hero 1920 × 990; network 1920 × 1080; performance, discovery, and account 1920 × 800; CTA 1920 × 600; footer 1920 × 776
- State: desktop, section motion settled, default color scheme

## Comparison evidence

- Combined full-view comparison input: `output/playwright/qa/figma-vs-implementation.jpg`
- Reference captures: `/Users/wuxiuchen/.codex/visualizations/2026/08/24/01a03428-1aaf-7f33-abc5-fcae960fe7c8/figma-audit/01-hero.png` through `07-footer.png`
- Implementation captures: `output/playwright/qa/hero.jpg` through `footer.jpg`
- Focused comparison: discovery/product composition, using `04-discovery.png` and `output/playwright/qa/discovery.jpg`; this was selected because the product image has the most sensitive aspect-ratio and crop relationship.
- The Figma frames were normalized next to the 1280 × 720 implementation captures in one comparison image. Black letterboxing in the reference column reflects the source frames' different section aspect ratios, not missing implementation content.

## Intentional differences from the supplied Figma

- Removed the `Login` action because the public site should not imply an account login flow.
- Moved the navigation group to the right, adjacent to the waitlist CTA.
- Added restrained, one-time section motion while preserving the Figma resting state.
- Kept the current product-capture disclaimer from the approved product-truth requirements.

## Findings and iteration history

| Round | Severity | Finding | Resolution |
| --- | --- | --- | --- |
| 1 | P2 | The discovery product capture used a fixed desktop height and became vertically stretched at narrower desktop widths. | Switched the image to its intrinsic aspect ratio and rechecked the product-to-landscape composition. |
| 1 | P3 | Several exported SVG dimensions were rounded away from their browser-rendered intrinsic size, producing Next Image development warnings. | Used stable integer intrinsic dimensions and removed unnecessary CSS sizing overrides. |
| 2 | — | Hero, network, performance, discovery, account, CTA, and footer were compared together after all entry motion had settled. | No remaining P1 or P2 mismatch. Typography, assets, spacing hierarchy, crop direction, and section color transitions match the supplied design at the responsive verification width. |

## Animation review

| Element | Trigger | What It Does | Assessment | Recommendation |
| --- | --- | --- | --- | --- |
| Network product fragments | While the second screen is visible | Leaderboard and Square run restrained 16-second product-state loops; the single-visible-card Signal sequence runs an independent 12-second A → B → A loop | Good: each movement explains a product state, the sequence pauses offscreen, and the three gestures remain distinct | Keep |
| Performance product UI | First viewport entry | Enters from the left over 1100 ms | Good: explains the visual handoff into the product story | Keep |
| Discovery product UI | First viewport entry | Enters from the right over 1150 ms | Good: direction matches the composition and uses only transform/opacity | Keep |
| Account network | First viewport entry | Subtle settle and opacity change over 1400 ms | Good: on-screen movement uses the strong ease-in-out curve | Keep |
| CTA dot field | First viewport entry | Opacity/scale settles over 1500 ms | Good: decorative motion is rare, restrained, and stops completely | Keep |
| Links and buttons | Hover or press | 160 ms underline, color, translate, or `scale(0.97)` feedback | Good: short, interruptible transitions and pointer-gated hover | Keep |
| Reduced motion | OS preference | Removes positional keyframes and displays final resting states | Good: motion is removed without hiding content | Keep |

Findings: the only intentional infinite animation is the user-approved second-screen product narrative; it pauses offscreen and is removed under reduced motion. There is no `transition: all`, UI `ease-in`, layout-property animation, or ungated hover motion.

Verdict: Approve.

## Engineering validation

- TypeScript: passed
- ESLint with zero warnings: passed
- Production build: passed
- Production dependency audit: existing repository advisories remain in `nanoid` and the Next.js/PostCSS chain; this branch adds no packages and does not change dependency manifests.
- Browser console: no new error or warning after the final image-dimension pass.

final result: passed

### Second-screen product-motion direction · 2026-08-25

- Current second-screen structural and timing checks were run at the required `1440 × 900` desktop viewport; visual sign-off remains with the product/UI owner.
- Signal source truth: Figma node `22148:30` and `output/playwright/consumer-signal-figma-reference.png` (`1338 × 796`). Browser implementation evidence: `output/playwright/consumer-network-signal-static-v3.jpg` (`1390 × 891`) from the in-app browser with a `1440 × 900` viewport override.
- Focused normalized comparison: `output/playwright/consumer-signal-figma-comparison-v3.jpg` (`1288 × 452`). Both Signal cards are normalized to approximately the same displayed width; this is the blocking typography, spacing, color, image, and copy comparison rather than a full-screen visual judgment.
- Motion-state evidence: right-swipe Copy `output/playwright/consumer-signal-swipe-right-v3.jpg`; left-swipe Skip `output/playwright/consumer-signal-swipe-left-v3.jpg`; full success Toast `output/playwright/consumer-signal-toast-v3.jpg`.
- `Verified, not claimed` is an open leaderboard crop with no local title or range selector. Rowdy's 30D P&L ticks through two increases before the same row moves from rank 02 to 01, so the ranking change has a visible cause.
- `Picked for you` is represented by the real Square / For You product structure. Its vertical feed restores social recommendation context (`also liked this` / `people you follow liked this`) and cycles through a binary prediction position, a meme coin, and a tokenized stock.
- All three position previews reserve the right side for position value and PnL. Prediction keeps side and average entry on the left; PUMP uses average-entry market cap, while AAPLx uses average-entry price. Generic `Position · Open` and transaction-event labels are removed.
- `One tap to trade` uses two different Signal records but renders only one complete card at a time. Card A follows the touch indicator to the right and reveals its own blurred afterimage with the Copy cue; card B later moves left and reveals its own afterimage with the Skip cue. The next record remains fully hidden until the preceding action is complete.
- The Signal sequence completes one right-swipe trade and one left-swipe skip in a 12-second loop. The trade toast has a 160ms entry, at least two seconds fully visible, and a 160ms exit; skip does not produce a false success toast. Leaderboard and Square retain their restrained 16-second state loops.
- Product fragments use open top/bottom fades rather than an extra presentation card; feature titles and descriptions use a tighter four-pixel relationship.
- Current design decisions, product facts, motion contracts, and material provenance are recorded in `docs/consumer-network-homepage-handoff.md` for the next AI or developer handoff.

#### One-tap Signal motion review

| Before | After | Why |
| --- | --- | --- |
| A readable rear card advanced before the trade was confirmed | The next card stays at `opacity: 0`; the current card reveals only a static deck underlay and diagonal Copy cue | Product causality is now correct: opportunity B cannot appear before opportunity A has a confirmed order |
| The success status flashed for roughly 240ms | Each status enters in 160ms, remains fully visible for 2s, and exits in 160ms | The result is readable without turning the system response into a slow transition |
| The second swipe followed immediately after the first state change | The next card gets a stable reading interval after the toast, with about 1.84s of quiet time before its swipe | Separates two transactions and removes continuous-motion fatigue |
| The authored Signal card was 252px tall and drifted from the product reference | The card now uses the Figma-derived 230px structure with a 44px trader header and compact market body | Restores the real product hierarchy instead of adapting the card around the previous animation |
| The website card was materially narrower than the Figma card and its market rows collapsed toward the center | The third-column crop now renders the card at approximately `398 × 230px`; market title, opinion, position, and quote rows stretch across the Figma-derived content width | Fixes the user-reported fidelity gap in spacing, hierarchy, and scan direction |
| The same right-swipe success pattern repeated twice | A trades right with Copy and a success toast; B skips left with a red Skip cue and no trade toast | Demonstrates both product decisions without falsely presenting a skip as a trade |
| The underlay was an empty dark plate | The underlay now reuses the current card as a static low-saturation, lightly blurred afterimage, with exact Figma action icons | Keeps the depth treatment product-derived and avoids a generic presentation-card effect |

**Interruptibility & timing.** The loop is a predetermined, non-interactive marketing explanation, so CSS keyframes are appropriate here; it does not impersonate a draggable control. If the preview becomes user-draggable, the card and status must move to pointer-captured, interruptible spring/transition state rather than reusing these keyframes. Drag and release remain asymmetric at 480ms / 160ms; toast entry/exit are 160ms with a two-second reading hold.

**Performance.** All moving states use only `transform` and `opacity`; the underlay background and shadow remain static. The loop is absent when the section is offscreen.

**Accessibility.** `prefers-reduced-motion` removes all queue, gesture, Copy/Skip cue, afterimage-state, and status animations while preserving A as the only visible card and keeping B hidden.

**Implementation anchors.** Unified Square position fields are rendered in `src/components/consumer-network/network-product-previews.tsx:120`; the Figma-derived Signal card starts at `src/components/consumer-network/network-product-previews.tsx:290`; the afterimage, directional actions, queue, and toast start at `src/components/consumer-network/network-product-previews.tsx:360`. The trade-specific unmasked crop is defined at `src/components/consumer-network/consumer-home.module.css:335`; the afterimage and Copy/Skip cues start at `src/components/consumer-network/consumer-home.module.css:1779`; the toast starts at `src/components/consumer-network/consumer-home.module.css:1900`; directional timelines start at `src/components/consumer-network/consumer-home.module.css:2300`; reduced-motion overrides start at `src/components/consumer-network/consumer-home.module.css:3207`.

**Final fidelity pass.** Fonts: the product crop uses the SF Pro system stack and the Figma `8–12px` hierarchy rather than the website display font. Spacing: card, header, market panel, position grid, and quote row match the Figma proportions; the market rows stretch to the full content width. Colors: semantic teal, secondary grays, borders, and surfaces use the Figma values. Images/icons: trader/market imagery is product-derived, and entry/copy/Copy/Skip glyphs are exact Figma exports. Copy: trader stats, opinion, position value, entry/current, and copied count match the reference state. The fresh verification tab reported no console warnings or errors.

Decision: **Approve**.

final result: passed
