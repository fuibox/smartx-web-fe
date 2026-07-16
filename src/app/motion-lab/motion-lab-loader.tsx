"use client";

import dynamic from "next/dynamic";

const MotionLabExperience = dynamic(
  () =>
    import("@/components/motion-lab/motion-lab-experience").then(
      (module) => module.MotionLabExperience,
    ),
  {
    ssr: false,
    loading: () => (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#020706",
          color: "#8da59f",
          fontFamily: "JetBrainsMono, monospace",
          fontSize: 12,
          textTransform: "uppercase",
        }}
      >
        Initializing motion study
      </main>
    ),
  },
);

type MotionLabLoaderProps = {
  semanticSnap?: boolean;
};

export function MotionLabLoader({ semanticSnap = false }: MotionLabLoaderProps) {
  return <MotionLabExperience semanticSnap={semanticSnap} />;
}
