import Image from "next/image";
import Script from "next/script";
import { ArrowRight, ExternalLink, Terminal } from "lucide-react";

import { ExperienceMotion } from "@/components/experience-motion";
import { MemoryLoop } from "@/components/memory-loop";
import { OriginalHero } from "@/components/original-hero";
import { TradingStory } from "@/components/trading-story";

const communityLinks = [
  { label: "X", href: "https://x.com/SmartXTerminal" },
  { label: "Telegram", href: "https://t.me/+CTeuBkpOxSNkN2Y0" },
  { label: "Discord", href: "https://discord.gg/MBcRHp9c9t" },
  { label: "Medium", href: "https://medium.com/@smartxofficial" },
];

const updates = [
  { category: "Product", date: "Jul 14, 2026", datetime: "2026-07-14", title: "Building the AI Trading Terminal Around You" },
  { category: "Intelligence", date: "Jul 09, 2026", datetime: "2026-07-09", title: "From Signal Discovery to Trade Action" },
  { category: "Company", date: "Jul 02, 2026", datetime: "2026-07-02", title: "What We Are Building Next" },
];

function Thesis() {
  return (
    <section className="signal-thesis" aria-label="SmartX decision loop" data-reveal-section>
      <div className="signal-thesis__split" aria-hidden="true"><span /><span /></div>
      <div className="signal-thesis__spine" aria-hidden="true" />
      <div className="signal-thesis__statements">
        <p>See the <strong>move.</strong></p>
        <p>Know the <strong>why.</strong></p>
        <p>Make the <strong>trade.</strong></p>
      </div>
    </section>
  );
}

function Updates() {
  return (
    <section className="updates-section content-frame" id="updates" aria-labelledby="updates-title" data-reveal-section>
      <header className="updates-header">
        <div><span className="section-index">Updates</span><h2 id="updates-title">Latest from SmartX</h2></div>
        <a href="https://medium.com/@smartxofficial" target="_blank" rel="noopener noreferrer">
          View all <ExternalLink aria-hidden="true" />
        </a>
      </header>
      <div className="updates-list">
        <a className="update-row update-row--featured" href="https://medium.com/@smartxofficial" target="_blank" rel="noopener noreferrer">
          <Image className="update-row__image" src="/assets/updates/decision-loop.png" alt="A SmartX signal path moving through a market chart" width={720} height={420} sizes="(max-width: 760px) 100vw, 340px" />
          <div className="update-row__meta"><span>{updates[0].category}</span><time dateTime={updates[0].datetime}>{updates[0].date}</time></div>
          <h3>{updates[0].title}</h3><ArrowRight aria-hidden="true" />
        </a>
        {updates.slice(1).map((update) => (
          <a className="update-row" href="https://medium.com/@smartxofficial" target="_blank" rel="noopener noreferrer" key={update.title}>
            <div className="update-row__meta"><span>{update.category}</span><time dateTime={update.datetime}>{update.date}</time></div>
            <h3>{update.title}</h3><ArrowRight aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <>
      <section className="final-cta content-frame" aria-label="Open SmartX" data-reveal-section>
        <Terminal aria-hidden="true" /><p>Trade smarter. Built around you.</p>
        <a href="https://app.smartx.io" target="_blank" rel="noopener noreferrer">Enter app <ArrowRight aria-hidden="true" /></a>
      </section>
      <footer className="site-footer content-frame">
        <div className="footer-brand">
          <Image src="/assets/smartx-logo.svg" alt="SmartX" width={142} height={28} priority />
          <p>The AI trading terminal built around you.</p><span>&copy; SmartX 2026</span>
        </div>
        <div className="footer-column"><strong>Product</strong><span>Markets</span><span>Signals</span><span>Smart Money</span><span>Watchlist</span></div>
        <div className="footer-column"><strong>Resources</strong><a href="#updates">Updates</a><a href="https://smartx.gitbook.io/smartx.docs.io" target="_blank" rel="noopener noreferrer">Docs</a><a href="https://medium.com/@smartxofficial" target="_blank" rel="noopener noreferrer">Medium</a><a href="https://www.tradingview.com" target="_blank" rel="noopener noreferrer">Charting by TradingView</a></div>
        <div className="footer-column"><strong>Community</strong>{communityLinks.slice(0, 3).map(({ label, href }) => <a href={href} target="_blank" rel="noopener noreferrer" key={label}>{label}</a>)}</div>
        <div className="footer-column footer-column--legal"><strong>Legal</strong><span>Terms</span><span>Privacy</span><span>Risk disclosure</span></div>
        <div className="footer-status"><strong>System status</strong><span><i aria-hidden="true" />All systems operational</span></div>
      </footer>
    </>
  );
}

export function OriginalHome() {
  return (
    <main id="main-content">
      <OriginalHero />
      <ExperienceMotion />
      <div className="experience-shell">
        <Thesis /><TradingStory /><MemoryLoop /><Updates /><Footer />
      </div>
      <Script src="/smartx-main.js" strategy="afterInteractive" />
    </main>
  );
}
