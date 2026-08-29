"use client";

export type WaitlistDemoTarget =
  | "gate"
  | "referral"
  | `quiz-${number}`
  | "email-create"
  | "email-recover"
  | "verify"
  | "unlock"
  | "unlock-ready"
  | "result"
  | "result-hidden";

const STATIC_VIEWS: Array<{ value: WaitlistDemoTarget; label: string }> = [
  { value: "gate", label: "Entry · direct" },
  { value: "referral", label: "Entry · friend invite" },
  { value: "email-create", label: "Email · save result" },
  { value: "email-recover", label: "Email · view my result" },
  { value: "verify", label: "Email · verification" },
  { value: "unlock", label: "Unlock · incomplete" },
  { value: "unlock-ready", label: "Unlock · completed" },
  { value: "result", label: "Result" },
  { value: "result-hidden", label: "Result · hidden" },
];

export function WaitlistDemoControl({
  value,
  questionCount,
  onSelect,
  onExit,
  className,
}: {
  value: WaitlistDemoTarget;
  questionCount: number;
  onSelect: (target: WaitlistDemoTarget) => void;
  onExit: () => void;
  className?: string;
}) {
  const quizViews = Array.from({ length: Math.max(questionCount, 6) }, (_, index) => ({
    value: `quiz-${index + 1}` as WaitlistDemoTarget,
    label: `Question ${index + 1}`,
  }));

  return (
    <details className={className}>
      <summary>Demo · review screens</summary>
      <div>
        <label htmlFor="waitlist-demo-view">Jump to</label>
        <select
          id="waitlist-demo-view"
          value={value}
          onChange={(event) => onSelect(event.target.value as WaitlistDemoTarget)}
        >
          <optgroup label="Entry">
            {STATIC_VIEWS.slice(0, 2).map((view) => (
              <option key={view.value} value={view.value}>{view.label}</option>
            ))}
          </optgroup>
          <optgroup label="Quiz">
            {quizViews.map((view) => (
              <option key={view.value} value={view.value}>{view.label}</option>
            ))}
          </optgroup>
          <optgroup label="Account and result">
            {STATIC_VIEWS.slice(2).map((view) => (
              <option key={view.value} value={view.value}>{view.label}</option>
            ))}
          </optgroup>
        </select>
        <small>Review-only. Backend data is not changed.</small>
        <button type="button" onClick={onExit}>Reload live flow</button>
      </div>
    </details>
  );
}
