"use client";

import { Bell, Eye, UserRoundPlus, Zap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const memoryInputs = [
  { id: "watch", label: "Watch", detail: "Markets you keep returning to", Icon: Eye },
  { id: "follow", label: "Follow", detail: "Traders whose edge you trust", Icon: UserRoundPlus },
  { id: "alert", label: "Alert", detail: "Signals worth interrupting you for", Icon: Bell },
  { id: "trade", label: "Trade", detail: "Decisions and conviction over time", Icon: Zap },
] as const;

export function MemoryLoop() {
  const [activeInput, setActiveInput] = useState<(typeof memoryInputs)[number]["id"]>(
    "trade",
  );
  const active = memoryInputs.find((item) => item.id === activeInput) ?? memoryInputs[3];

  return (
    <section
      className="memory-section content-frame"
      id="vision"
      aria-labelledby="memory-title"
      data-reveal-section
    >
      <h2 className="sr-only" id="memory-title">
        SmartX Memory vision
      </h2>
      <div className="section-kicker">
        <span>Vision</span>
        <span>Being built</span>
      </div>

      <div className="memory-loop">
        <div className="memory-actions" aria-label="Inputs to SmartX Memory">
          {memoryInputs.map(({ id, label, Icon }) => (
            <button
              type="button"
              key={id}
              className={activeInput === id ? "is-active" : ""}
              onMouseEnter={() => setActiveInput(id)}
              onFocus={() => setActiveInput(id)}
              onClick={() => setActiveInput(id)}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="memory-core" aria-label="SmartX Memory">
          <span className="memory-core__pulse" aria-hidden="true" />
          <Image src="/assets/favicon.ico" alt="" width={76} height={76} />
          <strong>SmartX Memory</strong>
          <span>Learns with every decision</span>
        </div>

        <div className="memory-output" aria-live="polite">
          <span>More relevant context</span>
          <strong>{active.label}</strong>
          <p>{active.detail}</p>
        </div>
      </div>
    </section>
  );
}
