import type { Metadata } from "next";

import { MotionLabLoader } from "./motion-lab-loader";

export const metadata: Metadata = {
  title: "Motion Lab | SmartX",
  description: "Technical validation for the SmartX market-universe narrative.",
};

export default function MotionLabPage() {
  return <MotionLabLoader />;
}

