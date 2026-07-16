import Image from "next/image";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { SiDiscord, SiMedium, SiTelegram, SiX } from "react-icons/si";

import { createSmartXAppHref } from "@/lib/smartx-links";

const communityLinks = [
  { label: "@SmartXTerminal", href: "https://x.com/SmartXTerminal", Icon: SiX },
  { label: "Telegram", href: "https://t.me/+CTeuBkpOxSNkN2Y0", Icon: SiTelegram },
  { label: "Discord", href: "https://discord.gg/MBcRHp9c9t", Icon: SiDiscord },
  { label: "Medium", href: "https://medium.com/@smartxofficial", Icon: SiMedium },
];

const updates = [
  {
    category: "Product",
    date: "Jul 14, 2026",
    datetime: "2026-07-14",
    title: "Building the AI Trading Terminal Around You",
    summary: "One continuous path from live evidence to execution and learning.",
  },
  {
    category: "Intelligence",
    date: "Jul 09, 2026",
    datetime: "2026-07-09",
    title: "From Signal Discovery to Trade Action",
  },
  {
    category: "Company",
    date: "Jul 02, 2026",
    datetime: "2026-07-02",
    title: "What We Are Building Next",
  },
];

const mediumHref = "https://medium.com/@smartxofficial";

export function NarrativeEpilogue() {
  return (
    <div className="experience-shell">
      <section
        className="epilogue-updates content-frame"
        id="updates"
        aria-labelledby="updates-title"
        data-reveal-section
      >
        <header className="epilogue-updates__header">
          <div>
            <span>Updates</span>
            <h2 id="updates-title">Latest from SmartX</h2>
          </div>
          <a href={mediumHref} target="_blank" rel="noopener noreferrer">
            View all on Medium
            <ExternalLink aria-hidden="true" />
          </a>
        </header>

        <div className="epilogue-updates__list">
          <a
            className="epilogue-update epilogue-update--featured"
            href={mediumHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="epilogue-update__media">
              <Image
                className="epilogue-update__image"
                src="/assets/updates/decision-loop.png"
                alt="A SmartX signal path moving through a market chart"
                width={720}
                height={420}
                sizes="(max-width: 760px) 100vw, 520px"
              />
            </div>
            <div className="epilogue-update__copy">
              <div className="epilogue-update__meta">
                <span>{updates[0].category}</span>
                <time dateTime={updates[0].datetime}>{updates[0].date}</time>
              </div>
              <h3>{updates[0].title}</h3>
              <p>{updates[0].summary}</p>
            </div>
            <ArrowRight aria-hidden="true" />
          </a>

          {updates.slice(1).map((update) => (
            <a
              className="epilogue-update"
              href={mediumHref}
              target="_blank"
              rel="noopener noreferrer"
              key={update.title}
            >
              <div className="epilogue-update__meta">
                <span>{update.category}</span>
                <time dateTime={update.datetime}>{update.date}</time>
              </div>
              <h3>{update.title}</h3>
              <ArrowRight aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="closing-band" aria-label="Open SmartX" data-reveal-section>
        <div className="closing-band__inner content-frame">
          <div>
            <span>Signal. Context. Action.</span>
            <h2>Trade with context.<br />Learn from every move.</h2>
          </div>
          <a
            className="closing-band__cta"
            href={createSmartXAppHref("closing_cta")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <small>Trading terminal</small>
              <strong>Open SmartX</strong>
            </span>
            <i aria-hidden="true">
              <ArrowUpRight />
            </i>
          </a>
        </div>
      </section>

      <footer className="trust-footer">
        <div className="trust-footer__main content-frame">
          <div className="trust-footer__brand">
            <Image src="/assets/smartx-logo.svg" alt="SmartX" width={166} height={33} />
            <p>The AI trading terminal built around how you discover, decide, and trade.</p>
          </div>

          <nav className="trust-footer__nav" aria-label="Footer navigation">
            <div>
              <strong>Explore</strong>
              <a
                href={createSmartXAppHref("footer_link")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Terminal
              </a>
              <a href="#updates">Updates</a>
              <a
                href="https://smartx.gitbook.io/smartx.docs.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </a>
            </div>
            <div>
              <strong>Connect</strong>
              {communityLinks.map(({ label, href, Icon }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" key={label}>
                  <Icon aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div className="trust-footer__meta content-frame">
          <span>&copy; SmartX 2026</span>
          <p>Prediction market trading involves risk.</p>
          <a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer">
            Charting by TradingView
          </a>
        </div>
      </footer>
    </div>
  );
}
