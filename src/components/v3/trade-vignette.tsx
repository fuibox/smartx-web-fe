"use client";

import { Activity, Check, WalletCards } from "lucide-react";
import { useState } from "react";

import { fedRateMarketFixture } from "@/components/product-demo/market-demo.fixture";

import styles from "./v3.module.css";

/**
 * EXECUTE 模块：重点只有一件事——规则触发，仓位成立。
 * 左：自动化规则（IF / AND / THEN）；右：可执行的仓位票据。
 */
export function TradeVignette() {
  const [committed, setCommitted] = useState(false);

  return (
    <div className={styles.tradeGrid}>
      <div className={styles.ruleBlock}>
        <span>Automation rule</span>
        <div className={styles.ruleLine}>
          <code>IF</code>
          <p>
            Smart money net flow <b>≥ $2M / 10m</b>
          </p>
        </div>
        <div className={styles.ruleLine}>
          <code>AND</code>
          <p>
            YES price <b>&lt; 70¢</b>
          </p>
        </div>
        <div className={styles.ruleLine}>
          <code>THEN</code>
          <p>
            Buy YES <b>$1,000</b>
          </p>
        </div>
        <p className={styles.ruleStatus}>
          <i aria-hidden="true" />
          Triggered 2m ago · 3rd time this week · +18.4% simulated / 30d
        </p>
        <p className={styles.copyRow}>
          <WalletCards aria-hidden="true" />
          Mirror 9 macro-specialist wallets
          <b>COMING</b>
        </p>
      </div>

      <div className={styles.ticket}>
        <span>Selected position</span>
        <div className={styles.ticketPrice}>
          <b>68.4¢</b>
          <span>YES</span>
        </div>
        <p>
          {fedRateMarketFixture.question} · $1,000 measured entry · 5 evidence threads
          attached
        </p>
        <button
          type="button"
          className={styles.tradeButton}
          aria-pressed={committed}
          onClick={() => setCommitted(true)}
        >
          <i aria-hidden="true">{committed ? <Check /> : <Activity />}</i>
          <span>
            <small>{committed ? "Added to AI Memory" : "Preview execution"}</small>
            <strong>{committed ? "Trade recorded" : "Take position"}</strong>
          </span>
        </button>
        <p className={styles.tradeReceipt} data-visible={committed}>
          YES · $1,000 at 68.4¢ → recorded to memory
        </p>
      </div>
    </div>
  );
}
