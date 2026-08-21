# Waitlist Design QA

Date: 2026-08-21

Reference: selected dark left-image/right-copy direction

Implementation state: quiz question 1, direct landing, result, referral landing

Comparison viewport: 1265 × 712

## Visual comparison

- Composition matches the selected direction: one semantic square image on the left, serif question on the right, and four vertical radio choices.
- Dark navy, restrained mint, rounded surfaces, spacing, and type hierarchy remain consistent across landing, quiz, email, result, and referral states.
- The question illustration now explains the scenario rather than acting as decorative art.
- The production SmartX logo asset is used in the global header and result card.
- The direct landing content is vertically centered within the viewport below the header.
- Result hierarchy is reduced to the persona card, three display attributes, rank, relationship pair, and one primary share action. Downloads remain at the bottom-left of the card.

## Interaction QA

- `123456` / `Use prototype code`: passed; one click enters question 1.
- `SMARTX-RSK-7X2K`: passed.
- Invalid, claimed, and temporarily locked invite states: passed with distinct recovery copy.
- Six questions → email → OTP → result: passed.
- Persona axes and independent Conviction / Instinct / Resilience scoring: passed.
- Story and OG downloads: passed.
- Share unlock, rank boost, one-time invite deck, and `result_id` referral landing: passed.
- Browser console: no application errors.

## Findings

- P0: none.
- P1: none.
- P2: none remaining in the implemented placeholder-art scope.

Final result: passed.
