type HeroGridController = {
  getCanvas: () => HTMLCanvasElement | null;
  pause: () => void;
  resume: () => void;
  renderOnce: () => void;
};

declare global {
  interface Window {
    SmartXKineticGrid?: HeroGridController & {
      start: () => void;
      destroy: () => void;
    };
  }
}

export {};
