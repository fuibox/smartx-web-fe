import type { Metadata } from "next";

import { MotionLabLoader } from "../motion-lab-loader";

export const metadata: Metadata = {
  title: "Semantic Snap | SmartX Motion Lab",
  description: "Directional semantic snapping for the SmartX market-universe narrative.",
};

export default function SemanticSnapPage() {
  return <MotionLabLoader semanticSnap />;
}
