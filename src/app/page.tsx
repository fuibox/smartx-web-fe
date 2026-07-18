import Script from "next/script";

export default function Home() {
  return (
    <>
      <div
        className="page-shell"
        dangerouslySetInnerHTML={{
          __html: `
      <canvas
        id="kinetic-grid"
        class="kinetic-grid"
        aria-hidden="true"
      ></canvas>
      <div class="grain-layer" aria-hidden="true"></div>
      <div class="scan-layer" aria-hidden="true"></div>

      <header class="site-header reveal reveal-interface">
        <div class="brand-mark" aria-label="SmartX">
          <img
            class="brand-mark__full"
            src="/assets/smartx-logo.svg"
            alt="SmartX"
          />
        </div>

        <nav class="signal-nav" aria-label="SmartX links">
          <span class="signal-nav__stamp" aria-hidden="true">SMARTX &copy;2026</span>
          <span class="signal-nav__divider" aria-hidden="true"></span>
          <a
            class="signal-link"
            href="https://x.com/SmartXTerminal"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SmartX on X"
            data-label="X"
          >
            <span class="signal-link__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path
                  d="M6 5h3.4l3 4.2L16 5h2.4l-4.7 6.3L19 19h-3.4l-3.3-4.7L8.6 19H6.2l5.1-6.9z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </a>
          <a
            class="signal-link"
            href="https://t.me/+CTeuBkpOxSNkN2Y0"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SmartX Telegram"
            data-label="Telegram"
          >
            <span class="signal-link__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path
                  d="M20.3 5.2 3.8 11.5l4.1 1.5 8.5-5.2-6.6 6 0 4.2 2.6-2.3 4.4 3.3z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.4"
                />
              </svg>
            </span>
          </a>
          <a
            class="signal-link"
            href="https://smartx.gitbook.io/smartx.mvp-guidebook.io"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SmartX Docs"
            data-label="Docs"
          >
            <span class="signal-link__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path
                  d="M8 4.8h6.4l3 3v11.4H8z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="1.4"
                />
                <path
                  d="M14.4 4.8v3h3"
                  fill="none"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="1.4"
                />
                <path
                  d="M10.4 12h4.8M10.4 15.2h4.8"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="1.4"
                />
              </svg>
            </span>
          </a>
        </nav>
      </header>

      <main class="hero">
        <div class="hero-inner">
          <h1
            class="hero-title reveal reveal-title-lock"
            aria-label="The AI Trading Terminal Built Around You"
          >
            <span class="hero-title__line">
              <span
                class="hero-title__phrase hero-title__phrase--first"
                data-calibrate-text
                >The AI Trading Terminal</span
              >
            </span>
            <span class="hero-title__line">
              <span
                class="hero-title__phrase hero-title__phrase--second"
                data-calibrate-text
                >Built Around You</span
              >
            </span>
          </h1>
          <p class="hero-body reveal reveal-copy">
            Alpha tuned to your focus, edge, and style
          </p>

          <!-- Restore this link when the beta is ready.
          <a
            href="https://app.smartx.io/"
            class="hero-cta reveal reveal-control"
            aria-label="Launch SmartX Beta"
          >
            <span class="hero-cta__label">
              <span class="hero-cta__text hero-cta__text--default">Launch Beta</span>
              <span class="hero-cta__text hero-cta__text--hover" aria-hidden="true">Reveal Alpha</span>
            </span>
            <span class="hero-cta__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path
                  d="M5 12h13m0 0-4.5-4.5M18 12l-4.5 4.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.7"
                />
              </svg>
            </span>
          </a>
          -->
          <button
            type="button"
            class="hero-cta hero-cta--coming-soon reveal reveal-control"
            aria-label="SmartX Beta coming soon"
            disabled
          >
            <span class="hero-cta__label">
              <span class="hero-cta__text hero-cta__text--default">Coming Soon</span>
              <span class="hero-cta__text hero-cta__text--hover" aria-hidden="true">Coming Soon</span>
            </span>
            <span class="hero-cta__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path
                  d="M12 5v7l4 2.4"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.7"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                />
              </svg>
            </span>
          </button>
        </div>
      </main>
          `,
        }}
      />
      <Script src="/smartx-main.js" type="module" strategy="afterInteractive" />
    </>
  );
}
