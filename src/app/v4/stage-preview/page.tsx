import type { Metadata } from "next";

import { EvidenceStage } from "@/components/v4/evidence-stage";
import styles from "@/components/v4/v4.module.css";

export const metadata: Metadata = {
  title: "SmartX v4 | EvidenceStage preview",
  robots: { index: false },
};

/** 临时预览：EvidenceStage 四个语义终态（静态先行，验收用） */
export default function StagePreviewPage() {
  return (
    <main className={`${styles.page} ${styles.stagePreview}`}>
      {(
        [
          ["signals", "Signals — 四源汇聚成一条命中"],
          ["execute", "Execute — packet 走完管线"],
          ["learn", "Learn — 决策沉积进 Memory band"],
          ["allinone", "All-in-one — 只有 Live 车道接入终端"],
        ] as const
      ).map(([state, caption]) => (
        <figure key={state}>
          <EvidenceStage state={state} />
          <figcaption>{caption}</figcaption>
        </figure>
      ))}
    </main>
  );
}
