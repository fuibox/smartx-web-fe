const evidence = [
  ["Market signal", "Momentum break", "+8.2 points in 14 minutes"],
  ["Smart money", "YES +$4.8M", "14 tracked wallets accumulating"],
  ["Wallet context", "Macro specialists", "9 recurring high-conviction wallets"],
  ["News context", "CPI miss reprices cuts", "Released 2 minutes ago"],
] as const;

const memoryDimensions = [
  ["Interests", "What you follow"],
  ["Signals", "What you trust"],
  ["Style", "How you act"],
  ["Edge", "What proves durable"],
] as const;

export function ReducedNarrativeFallback() {
  return (
    <section className="reduced-narrative content-frame" aria-label="How SmartX works">
      <article className="reduced-narrative__chapter">
        <span>01 / Detect</span>
        <h2>See the move.</h2>
        <p>SmartX surfaces material market movement as it happens.</p>
      </article>

      <article className="reduced-narrative__chapter">
        <span>02 / Inspect</span>
        <h2>Know the why.</h2>
        <div className="reduced-narrative__evidence">
          {evidence.map(([label, headline, detail]) => (
            <div key={label}>
              <small>{label}</small>
              <strong>{headline}</strong>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="reduced-narrative__chapter reduced-narrative__trade">
        <div>
          <span>03 / Execute</span>
          <h2>Make the trade.</h2>
          <p>Keep the signal, capital flow, and market context beside the decision.</p>
        </div>
        <dl>
          <div><dt>Outcome</dt><dd>YES</dd></div>
          <div><dt>Entry</dt><dd>68.4¢</dd></div>
          <div><dt>Amount</dt><dd>$1,000</dd></div>
          <div><dt>Evidence</dt><dd>3 sources</dd></div>
        </dl>
      </article>

      <article className="reduced-narrative__chapter">
        <span>04 / Learn</span>
        <h2>A trade becomes memory.</h2>
        <p>Every decision updates what SmartX should surface next.</p>
        <div className="reduced-narrative__dimensions">
          {memoryDimensions.map(([label, detail]) => (
            <div key={label}>
              <strong>{label}</strong>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
