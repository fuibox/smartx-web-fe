# Waitlist Design QA

## Evidence

- Source visual truth: `output/audit-2026-08-21-homepage-direction/02-homepage-hero.png`
- Supporting product truth: `docs/website-v4.md` and `docs/waitlist.md`
- Direct Landing: `output/audit-2026-08-21-waitlist-v2/01-direct-landing-1440x900.png`
- Question: `output/audit-2026-08-21-waitlist-v2/02-question-1440x900.png`
- Referral Landing: `output/audit-2026-08-21-waitlist-v2/04-referral-landing-1440x900.png`
- Shared result / invite state: `output/audit-2026-08-21-waitlist-v2/05-result-invites-1440x900.png`
- Combined comparison: `output/audit-2026-08-21-waitlist-v2/06-source-implementation-comparison.jpg`
- Source pixels: 1440 × 883.
- Implementation pixels: 1440 × 900.
- CSS viewport: 1440 × 900 at `devicePixelRatio: 1`.
- State: desktop, dark theme; direct Landing, first question, referral Landing, verified result, and post-share invite state.

The Figma frame is a brand-direction source rather than a page to clone. The comparison therefore checks brand family, typography hierarchy, color, density, and product credibility; the waitlist layout follows the approved flow in `docs/waitlist.md`.

## Full-view comparison

- Typography: Inter provides the same clean, high-contrast product voice as the homepage UI. Display type is intentionally larger on the conversion screens, while labels and invitation data use the existing JetBrains Mono token. Line wrapping is controlled at 1440 × 900 and no main heading is clipped.
- Spacing and layout rhythm: each screen has one dominant decision. Direct Landing uses a strong copy/form split; quiz cards remain fully visible in one desktop viewport; referral and result screens share the same poster/action two-column grammar.
- Colors and tokens: implementation uses the V4 navy, teal, warm-white, body, muted, and line tokens. Teal is reserved for state, CTA, progress, and the result-card edge.
- Image quality and asset fidelity: custom persona art is intentionally not present because the visual direction is unresolved. Every required slot is an explicit 1:1 `Artwork direction TBD` placeholder; no legacy tarot image is presented as current work. The SmartX logo remains the only active brand image.
- Copy and content: both Landing variants, nine persona names, referral framing, email binding, optional social actions, rank state, and invite actions match the current PRD.

## Focused comparison

Separate 1440 × 900 captures were inspected because the combined sheet makes question copy and result controls too small to judge.

- Question screen: title line-height, title-to-card gap, 1:1 media slots, answer wrapping, progress, and full-viewport fit all pass.
- Result screen: persona identity, explanation, roast, left-bottom downloads, active rank, optional social actions, and post-share invite replacement all pass without overflow.
- Referral screen: the inviter's result remains the first visual subject and the CTA begins the quiz without exposing an extra code-entry step.

## Comparison history

### Iteration 1

- [P2] Legacy animal codes remained visible in the new persona system.
  - Evidence: the first result capture displayed `WHALE` in the artwork placeholder and would have generated `SMARTX-WHALE-*` invite links.
  - Impact: users could reasonably conclude that the animal system was still the current public taxonomy.
  - Fix: added public persona marks (`LQD / AIM / SIG / CND / DIP / DOC / CHN / LMT / RSK`), kept the animal codes only as backward-compatible URL inputs, and generated all new links from the public marks.
  - Post-fix evidence: `04-referral-landing-1440x900.png`, `05-result-invites-1440x900.png`, and the copied URL `?result=CHN&invite=SMARTX-CHN-7X2K`.

No P0/P1 issues were found in the first pass.

## Primary interactions tested

- Direct Landing test-code autofill and invite validation.
- Six answers, including automatic progression between questions.
- Email submission and prototype OTP verification.
- Result-card export preparation for Story and OG sizes.
- Share CTA state change and 500-place rank movement.
- Invite-card unlock and copied referral URL.
- Referral Landing rendering and start CTA.
- Browser console checked on the main and referral pages: no errors or warnings.

## Remaining P3 / expected gaps

- Persona and question artwork remains intentionally unresolved and is visibly marked as a placeholder.
- Mobile composition is a safe responsive fallback only; desktop is the current signed-off implementation target.
- Rank and reward values remain browser-only prototype data.

## Final result

final result: passed
