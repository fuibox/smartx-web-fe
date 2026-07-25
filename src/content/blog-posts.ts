import type { BlogPostSource } from "./blog-types";

/**
 * Local editorial source. Route components must consume
 * `blog-repository.ts`, never this collection directly.
 */
export const BLOG_POST_SOURCES = [
  {
    slug: "best-polymarket-analytics-tools-in-2026-ranked-and-reviewed",
    status: "published",
    category: "Guide",
    publishedAt: "2026-07-24",
    title: "Best Polymarket Analytics Tools in 2026 — Ranked and Reviewed",
    excerpt:
      "An honest breakdown of the analytics stack around Polymarket—and what each tool is actually useful for.",
    cover: {
      src: "/assets/updates/polymarket-analytics-tools.webp",
      alt: "Best Polymarket Analytics Tools in 2026 ranked and reviewed",
    },
    sourceUrl:
      "https://medium.com/@smartxofficial/best-polymarket-analytics-tools-in-2026-ranked-and-reviewed-bb4bb53e155f",
    sections: [
      {
        id: "native-leaderboard",
        heading: "Polymarket’s native leaderboard",
        blocks: [
          {
            type: "paragraph",
            text: "Polymarket has grown into the largest prediction market by volume, but its native interface gives you almost nothing to work with analytically. You get a list of markets, an order book, and a basic leaderboard. There’s no built-in breakdown of which categories you’re winning or losing in, no wallet behavior analysis, no way to filter by market type or trader profile. If you’re trying to get better at trading prediction markets, you’re mostly flying blind with the default tools.",
          },
          {
            type: "paragraph",
            text: "The good news is the ecosystem has grown. A set of third-party tools now sits on top of Polymarket’s on-chain data, giving traders different angles on the market. Here’s an honest breakdown of what’s available in 2026 and what each tool actually does.",
          },
          {
            type: "paragraph",
            text: "The built-in leaderboard ranks traders by total PnL. It tells you who’s up the most money in a given period. That’s the beginning and end of what it does. It doesn’t break down strategy, category performance, win rate context, or bet frequency. Two traders with identical profit numbers might have completely opposite approaches, and the native leaderboard won’t help you tell the difference. Useful for a quick scan of who’s making money; useless for understanding how.",
          },
        ],
      },
      {
        id: "manifold",
        heading: "Manifold and alternative prediction markets",
        blocks: [
          {
            type: "paragraph",
            text: "Manifold is a play-money prediction market that some traders use to test strategies and build track records without financial risk. It’s useful for learning the mechanics of prediction markets and practicing position sizing. Because it uses play money, the behavioral dynamics differ meaningfully from real-money markets—incentive structures change when there’s no actual capital at stake. Worth using as a training ground, but not directly transferable to Polymarket strategy.",
          },
        ],
      },
      {
        id: "onchain-explorers",
        heading: "On-chain explorers",
        blocks: [
          {
            type: "paragraph",
            text: "Since Polymarket runs on Polygon, every trade is publicly verifiable. You can manually pull wallet history from a blockchain explorer and reconstruct a trader’s bet record. This technically works but it’s a significant time investment: you’re reading raw transaction data, not categorized bet history. For a one-time deep research project, viable. For making decisions in real time, not practical.",
          },
        ],
      },
      {
        id: "dune",
        heading: "Dune Analytics dashboards",
        blocks: [
          {
            type: "paragraph",
            text: "Dune has several community-built dashboards that aggregate Polymarket data into readable charts: market volume by category, trader activity over time, and top wallet performance. These are more useful than raw block explorers, and some are well-built. The limitation is that most Dune dashboards are static or slow to update, and they’re designed for market-level analysis rather than wallet-level behavioral intelligence. You can see that sports markets had high volume this week; you can’t easily see which specific wallets are consistently profitable in sports and what they’re betting on right now.",
          },
        ],
      },
      {
        id: "arkham",
        heading: "Arkham Intelligence",
        blocks: [
          {
            type: "paragraph",
            text: "Arkham focuses on wallet identity and fund flows across chains. For Polymarket specifically, it’s more useful for understanding who a wallet might belong to than for analyzing trading behavior. If you want to know whether a large wallet is associated with a known fund or individual, Arkham is the tool. If you want to know whether that wallet has a genuine edge in political markets, it doesn’t help much.",
          },
        ],
      },
      {
        id: "smartx",
        heading: "SmartX",
        blocks: [
          {
            type: "paragraph",
            text: "SmartX is purpose-built for behavioral analysis on Polymarket. Rather than showing market-level stats, it focuses on wallet-level behavioral fingerprinting: what type of trader a wallet is, which categories it actually wins in, how frequently it trades, and whether it’s a high-frequency market maker or a conviction-based player.",
          },
          {
            type: "paragraph",
            text: "Every wallet on Polymarket gets auto-tagged based on actual trading behavior—Market Maker, Short-term, Consistent Winner, Whale—and category-specific win indicators. When you open a wallet in SmartX, you can immediately see the behavioral profile: bet frequency, average size, win rate, and category breakdown, without having to reconstruct it manually from transaction data.",
          },
          {
            type: "paragraph",
            text: "The practical use case: filter for wallets that are consistently profitable in the categories you trade, see what they’re currently positioned in, and use that behavioral signal as context for your own decisions. This is the closest thing to a Polymarket smart money tracker that exists in 2026.",
          },
        ],
      },
      {
        id: "choose-by-use-case",
        heading: "How to choose based on your use case",
        blocks: [
          {
            type: "unordered-list",
            items: [
              "If you want a quick overview of who’s making money: Polymarket leaderboard.",
              "If you want to understand market volume trends and category activity: Dune dashboards.",
              "If you want to research a specific wallet’s identity and fund flows: Arkham.",
              "If you want to learn prediction market mechanics without risking capital: Manifold.",
              "If you want to understand which wallets have genuine behavioral edges, what categories they win in, and where they’re currently placing bets: SmartX.",
            ],
          },
          {
            type: "paragraph",
            text: "Most serious traders end up using a combination, but the wallet behavioral layer is the hardest to get from any other source and most directly useful for improving your own decision-making.",
          },
        ],
      },
      {
        id: "actionable-intelligence",
        heading: "The information that actually moves your trading",
        blocks: [
          {
            type: "paragraph",
            text: "The most actionable intelligence on Polymarket isn’t which markets have the most volume. It’s which wallets with demonstrable track records are currently positioning in markets you care about, and what their behavior pattern suggests about conviction level.",
          },
          {
            type: "paragraph",
            text: "SmartX makes the behavioral data behind Polymarket’s top wallets readable while the market is still moving.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-smart-money-moves-on-polymarket-and-how-to-follow-it",
    status: "published",
    category: "Intelligence",
    publishedAt: "2026-07-24",
    title: "How Smart Money Moves on Polymarket — and How to Follow It",
    excerpt:
      "Follow the behavior behind a winning wallet—not just the PnL number at the top of a leaderboard.",
    cover: {
      src: "/assets/updates/smart-money-polymarket.webp",
      alt: "How smart money moves on Polymarket through connected wallet behavior",
    },
    sourceUrl:
      "https://medium.com/@smartxofficial/how-smart-money-moves-on-polymarket-and-how-to-follow-it-0336ae92331d",
    sections: [
      {
        id: "two-archetypes",
        heading: "The two archetypes worth tracking",
        blocks: [
          {
            type: "paragraph",
            text: "Most people who lose money on Polymarket don’t lose because they picked wrong. They lose because they have no idea who’s actually winning—and more importantly, how they’re winning. The leaderboard shows you a number: who’s up the most in profit. It doesn’t tell you whether that profit came from 8,000 micro-bets or 9 large ones. It doesn’t tell you if the wallet specializes in sports, crypto, or politics. It doesn’t tell you if the win rate is 50% or 75%. Two wallets with identical profit numbers can be doing completely different things, and blindly copying either one without understanding the difference is a fast way to lose.",
          },
          {
            type: "paragraph",
            text: "The gap between consistent winners and everyone else on Polymarket isn’t luck. Research published in 2024 found a small group of traders pulled roughly $40 million in guaranteed arbitrage from Polymarket in a single year. The top individual earner made over $2 million through systematic execution. These people aren’t better at predicting outcomes. They have structural advantages: better data reads, faster execution, and behavioral discipline that’s invisible on a basic leaderboard.",
          },
          {
            type: "heading",
            level: 3,
            id: "high-frequency-market-maker",
            text: "The high-frequency market maker",
          },
          {
            type: "paragraph",
            text: "These wallets place hundreds or thousands of bets per week, usually small-sized, often in sports markets. Their win rate is often near 50%—because they’re not trying to be right more often than chance. They’re harvesting tiny edges repeatedly. A wallet with a 50.3% win rate and $4M in profit isn’t lucky—that’s thousands of iterations of a thin mathematical edge compounding.",
          },
          {
            type: "paragraph",
            text: "You can’t follow this style manually. It requires automation and capital efficiency that individual retail traders can’t replicate.",
          },
          {
            type: "heading",
            level: 3,
            id: "conviction-player",
            text: "The conviction player",
          },
          {
            type: "paragraph",
            text: "These wallets place a handful of bets per week, sized large, with high selectivity. A wallet making 9 bets in a week, hitting 6 of them, and averaging $28,000 per bet is playing a different game entirely. These traders wait for high-conviction setups and size up when they’re confident.",
          },
          {
            type: "paragraph",
            text: "Their flip rate—early exits—is often zero: they research a position and hold it. This is a style a retail trader can actually study and adapt.",
          },
        ],
      },
      {
        id: "behavior-over-profit",
        heading: "Why behavior matters more than profit",
        blocks: [
          {
            type: "paragraph",
            text: "The problem with most Polymarket analytics is they stop at PnL. A profit number doesn’t tell you the strategy, the risk tolerance, or whether the results are repeatable. A market maker’s edge doesn’t transfer to a conviction player’s approach. A sports specialist’s edge doesn’t transfer to political markets.",
          },
          {
            type: "paragraph",
            text: "What you actually need to know when tracking smart money is:",
          },
          {
            type: "unordered-list",
            items: [
              "What category does this wallet win in—sports, crypto, politics, or current events?",
              "How many bets per week does it place, and at what average size?",
              "Is its win rate above 55%, suggesting genuine predictive skill, or near 50%, suggesting a structural edge?",
              "Does it hold positions or exit early?",
            ],
          },
          {
            type: "paragraph",
            text: "These behavioral signals are all in on-chain data. They’re just not readable from a standard leaderboard.",
          },
        ],
      },
      {
        id: "use-a-tracker",
        heading: "How to use a smart-money tracker",
        blocks: [
          {
            type: "paragraph",
            text: "A smart money tracker worth using doesn’t just show you who’s up. It shows you the behavioral fingerprint behind the profit: what style of trader this is, what markets they actually win in, and whether their approach is something you can realistically follow.",
          },
          {
            type: "paragraph",
            text: "SmartX builds exactly this behavioral layer on top of Polymarket data. Every wallet gets auto-tagged based on how it actually trades—Market Maker, Consistent Winner, Short-term, Whale—and which categories it wins in. When you open a wallet, you can see within seconds whether it’s a high-frequency machine or a conviction sniper, and whether its edge is in sports, crypto, or political markets.",
          },
          {
            type: "paragraph",
            text: "The practical use case: find wallets that trade the same categories you trade, with a win rate that suggests real skill, at position sizes you can realistically mirror. Watch where they’re moving capital before a market moves. That’s the behavioral edge that doesn’t require a PhD in optimization theory.",
          },
        ],
      },
      {
        id: "copying-mistake",
        heading: "The mistake most traders make",
        blocks: [
          {
            type: "paragraph",
            text: "The most common mistake is copying a wallet’s bets without understanding the wallet’s strategy. A retail trader who sees a market maker’s high-profit wallet and tries to mirror individual bets is playing a game designed for automated systems. A trader who copies a conviction player’s single massive bet without the same research context is following someone else’s conviction blindly.",
          },
          {
            type: "paragraph",
            text: "Smart money tracking isn’t about copying positions. It’s about pattern recognition: learning what types of wallets win in which categories, what signals they act on, and using that behavioral data to make better-informed decisions about your own trades.",
          },
        ],
      },
      {
        id: "wallets-that-matter",
        heading: "Track the wallets that matter",
        blocks: [
          {
            type: "paragraph",
            text: "The data is all on-chain. The question is whether you have a tool that translates it into something readable in real time.",
          },
          {
            type: "paragraph",
            text: "SmartX shows which wallets are consistently winning in your markets, what they’re betting on right now, and how their strategy compares to yours.",
          },
        ],
      },
    ],
  },
  {
    slug: "smartx-boost-trade-alongside-the-smart-money",
    status: "published",
    category: "Campaign",
    publishedAt: "2026-07-17",
    title: "SmartX Boost: Trade Alongside the Smart Money",
    excerpt:
      "SmartX’s first trading leaderboard rewards the earliest traders who fund, trade, and connect their X account.",
    cover: {
      src: "/assets/updates/smartx-boost.webp",
      alt: "SmartX Boost trading leaderboard campaign",
    },
    sourceUrl:
      "https://medium.com/@smartxofficial/smartx-boost-trade-alongside-the-smart-money-c59f856c97a5",
    sections: [
      {
        id: "the-board",
        heading: "The board is open",
        paragraphs: [
          "On every prediction market, the money that wins over time tends to move first—and quietly. SmartX was built to make that movement readable: whale entries, wallet behavior, and positions taken before the odds catch up.",
          "SmartX Boost turns watching into participating. It is our first trading leaderboard, built around a simple question: can you trade alongside the smart money and get there first?",
        ],
        quote:
          "The board ranks by who completes every requirement first. Earlier completion means a higher seat.",
      },
      {
        id: "how-it-works",
        heading: "Three steps to qualify",
        blocks: [
          {
            type: "paragraph",
            text: "Complete all three requirements during the event window. There is no separate registration, and every qualifying action is counted automatically.",
          },
          {
            type: "ordered-list",
            items: [
              "Fund your account with at least $5 in net deposits using USDC, USDT, or another supported stablecoin.",
              "Trade at least $50 in volume. Buys and sells count; unfilled orders do not.",
              "Connect your X account through the SmartX points system.",
            ],
          },
        ],
      },
      {
        id: "rewards",
        heading: "First mover, best seat",
        paragraphs: [
          "The first 100 traders to complete all three steps receive 5 USDC. Completion time determines rank.",
          "Milestone seats add an extra reward: rank 50 receives an additional 10 USDC, rank 100 an additional 20 USDC, rank 200 receives 50 USDC, and rank 500 receives 100 USDC.",
          "Rewards settle to the SmartX account address. A withdrawable balance of at least $5 is required at settlement; otherwise the seat passes to the next qualified trader.",
        ],
      },
      {
        id: "why-now",
        heading: "Why now",
        paragraphs: [
          "Prediction markets settle real questions with real money every day—across elections, sports, rates, and crypto. In each market, the crowd reacts loudly while a smaller group trades on structure and edge.",
          "SmartX Boost rewards traders who are learning to read that second group. The window lasts seven days, starting July 17. When the board fills, it fills.",
        ],
      },
    ],
    note:
      "SmartX is in alpha. Markets are never a guarantee; trade only what you can afford to lose.",
  },
  {
    slug: "introducing-smart-points-get-rewarded-for-being-early",
    status: "published",
    category: "Product",
    publishedAt: "2026-07-16",
    title: "Introducing Smart Points: Get Rewarded for Being Early",
    excerpt:
      "Every trade, deposit, and funded invite now earns points automatically across daily, weekly, and milestone tracks.",
    cover: {
      src: "/assets/updates/smartx-points.webp",
      alt: "Smart Points activity across daily, weekly, and milestone tracks",
    },
    sourceUrl:
      "https://medium.com/@smartxofficial/introducing-smart-points-get-rewarded-for-being-early-fdef0388fc74",
    sections: [
      {
        id: "points-are-live",
        heading: "Smart Points are live",
        paragraphs: [
          "Starting now, every qualified trade, deposit, and funded invite can earn Smart Points. Credit arrives automatically when the requirement is met, so progress is visible without a separate claim flow.",
          "Open Rewards inside SmartX and select Points to see the three ways activity is recorded.",
        ],
      },
      {
        id: "three-tracks",
        heading: "Three tracks, one activity record",
        bullets: [
          "Daily: check in, complete a qualified trade, and reach the daily volume threshold.",
          "Weekly: pass the weekly volume milestone and trade consistently throughout the week.",
          "Milestones: reach deposit thresholds and invite friends who fund their accounts.",
        ],
        quote:
          "A task is only useful if progress is legible. Every completed requirement appears in Points Activity.",
      },
      {
        id: "automatic",
        heading: "No claiming. No waiting.",
        paragraphs: [
          "Check-in takes one click; the remaining activity is recorded automatically. Once a threshold is reached, the corresponding points appear in the balance and activity history.",
          "Funded invites are the meaningful unit. A signup without a funded account does not advance an invite milestone.",
        ],
      },
      {
        id: "points-and-rebates",
        heading: "Points and rebates remain separate",
        paragraphs: [
          "Referral rebates continue to work as before and remain visible in the Referral tab. Smart Points form a separate layer on top of those earnings.",
          "The same invite can therefore contribute in two distinct ways: referral activity continues to earn rebates, while a funded invite advances the Smart Points milestone.",
        ],
      },
      {
        id: "fair-play",
        heading: "Built for real activity",
        paragraphs: [
          "Smart Points reward genuine product use. Wash trading, self-matching, and disposable-account farming do not count, and abusive activity may be removed from the program.",
          "Points record contribution to SmartX and may unlock future platform benefits as the program evolves.",
        ],
      },
    ],
    note:
      "Smart Points have no monetary value, are not transferable, and do not represent ownership or a guaranteed right to future rewards.",
  },
  {
    slug: "smart-money-decoded-what-top-prediction-market-traders-actually-read",
    status: "published",
    category: "Intelligence",
    publishedAt: "2026-07-13",
    title:
      "Smart Money Decoded: What Top Prediction-Market Traders Actually Read",
    excerpt:
      "Why PnL alone hides how top prediction-market traders actually win—and what their trading behavior reveals.",
    dek:
      "Why PnL alone hides how top prediction-market traders actually win—and what their trading behavior reveals.",
    cover: {
      src: "/assets/updates/decision-loop.webp",
      alt: "A market path crossing the SmartX intelligence layer",
    },
    sourceUrl:
      "https://medium.com/@smartxofficial/smart-money-decoded-what-the-top-1-of-prediction-market-traders-actually-read-10258f52e46d",
    sections: [
      {
        id: "leaderboard",
        heading: "The leaderboard hides the method",
        blocks: [
          {
            type: "paragraph",
            text: "Most prediction-market leaderboards rank wallets by profit. That tells you who won, but not how the result was produced.",
          },
          {
            type: "heading",
            level: 3,
            id: "what-pnl-leaves-out",
            text: "What PnL leaves out",
          },
          {
            type: "paragraph",
            text: "PnL flattens every strategy into one number. Frequency, sizing, conviction, preferred markets, and holding behavior disappear—even though those dimensions determine whether a wallet is worth studying.",
          },
          {
            type: "quote",
            text: "PnL is the result, not the method. The useful signal lives in how the result was produced.",
          },
        ],
      },
      {
        id: "machine",
        heading: "The machine",
        paragraphs: [
          "One leading wallet recorded almost 8,000 bets in a week, close to $100 million in volume, and a win rate near a coin flip. Most positions were turned over quickly, with the majority of activity concentrated in sports.",
          "The edge was not being right more often. It came from repeating a narrow structural advantage at machine scale. This is profitable behavior, but not behavior a manual trader can simply copy.",
        ],
      },
      {
        id: "sniper",
        heading: "The sniper",
        paragraphs: [
          "Another profitable wallet took the opposite path: nine trades in the same period, much larger average sizing, and no early exits.",
          "One wallet sprays volume; the other waits, sizes up, and holds. A leaderboard places both beside the same green number, even though following them requires completely different decisions.",
        ],
        quote:
          "The edge is not simply following smart money. It is knowing which kind of smart money you are looking at.",
      },
      {
        id: "real-gap",
        heading: "The real information gap",
        paragraphs: [
          "Trading style, conviction, category expertise, holding behavior, and repeatability already exist in the underlying activity. The problem is that rebuilding a wallet’s behavioral fingerprint by hand takes too long.",
          "That is the layer SmartX makes readable. Representative labels describe expertise, trading style, track record, and behavior so a trader can understand why a wallet matters—not just what it earned.",
        ],
      },
      {
        id: "decision",
        heading: "From raw activity to a decision",
        paragraphs: [
          "SmartX filters wallets by the markets a user actually follows, identifies the behavior behind the result, and carries that evidence into the signal and trade.",
          "The opportunity was never hidden. The hard part was reading the structure in time.",
        ],
      },
    ],
  },
  {
    slug: "smartx-ambassador-program",
    status: "published",
    category: "Community",
    publishedAt: "2026-07-09",
    title: "SmartX Ambassador Program",
    excerpt:
      "A program for active traders who publish useful, trader-native content—not referral farming without output.",
    cover: {
      src: "/assets/updates/smartx-ambassador.webp",
      alt: "SmartX Ambassador Program with three SmartX owl characters",
    },
    sourceUrl:
      "https://medium.com/@smartxofficial/smartx-ambassador-program-c58a83674fff",
    sections: [
      {
        id: "traders-who-ship",
        heading: "For traders who ship",
        paragraphs: [
          "SmartX is looking for active traders with a real audience and a habit of publishing useful, trader-native content.",
          "The program is not designed for shill accounts, giveaway farming, or profiles filled with generic AI trading claims. It is for people with their own market opinions who can explain them clearly.",
        ],
        quote:
          "We are not looking for affiliates. We are looking for traders who ship content.",
      },
      {
        id: "who-it-is-for",
        heading: "Who it is for",
        bullets: [
          "Active traders across prediction markets, perpetuals, memes, or BNB Chain assets.",
          "Creators who publish consistently on X, Telegram, YouTube, TikTok, or Medium.",
          "People who can speak in trader language and bring an informed point of view.",
        ],
      },
      {
        id: "valid-referral",
        heading: "What makes a referral valid",
        paragraphs: [
          "A referral counts after the invited user registers through the tracked link, completes activation, and makes a real trade or signal interaction within seven days.",
          "Anti-abuse checks exclude same-device batches and other artificial registrations. Inactive accounts do not advance rebates or tier promotion.",
        ],
      },
      {
        id: "weekly-bar",
        heading: "The weekly bar",
        bullets: [
          "Publish at least two original pieces. Pure reposts do not count.",
          "Keep the work trader-native, specific, and data-led.",
          "Maintain a visible referral path and contribute meaningfully inside the SmartX community.",
        ],
        quote:
          "Consistency matters more than one-off reach. Missing the weekly bar triggers a downgrade warning.",
      },
      {
        id: "apply",
        heading: "Apply and start",
        paragraphs: [
          "Approved applicants enter a seven-day probation with access to the brand kit, reusable content formats, and a weekly memo of new angles.",
          "Clearing the weekly criteria and accumulating ten valid referrals during probation promotes the applicant to full Ambassador.",
        ],
      },
      {
        id: "red-lines",
        heading: "The red lines",
        paragraphs: [
          "Fake activations, referral collusion, leaked beta information, unauthorized price calls, competitor attacks, and content that refuses the SmartX brand standard can result in removal.",
          "The goal is straightforward: help more traders understand the product through useful work, without turning the program into a referral farm.",
        ],
      },
    ],
  },
  {
    slug: "smartx-signal-bot-guide",
    status: "published",
    category: "Guide",
    publishedAt: "2026-06-02",
    title: "SmartX Signal Bot Guide",
    excerpt:
      "Receive prediction-market signals on Telegram, tune what reaches you, and respond before the move becomes obvious.",
    cover: {
      src: "/assets/updates/smartx-signal-bot.webp",
      alt: "SmartX Signal Bot live announcement",
    },
    sourceUrl:
      "https://medium.com/@smartxofficial/smartx-signal-bot-guide-040f36d9e5ed",
    sections: [
      {
        id: "signals-in-pocket",
        heading: "Signals in your pocket",
        paragraphs: [
          "The SmartX Signal Bot pushes prediction-market signals directly to Telegram, removing the need to refresh a dashboard or search for the move after everyone else has seen it.",
          "Each signal combines the market, the detected smart-money behavior, and concise context about why the movement matters.",
        ],
      },
      {
        id: "scheduled-signals",
        heading: "Get scheduled signals",
        paragraphs: [
          "The default feed delivers curated signals every two hours across politics, crypto, and sports.",
          "Signal cards can include whale entries, wallet clusters, sharp flow, AI-powered context, and a direction users can back.",
        ],
        quote:
          "Markets move quickly. Scheduled delivery keeps the setup visible while the window is still open.",
      },
      {
        id: "personalize-feed",
        heading: "Personalize the feed",
        bullets: [
          "Choose the categories you actually trade.",
          "Set a cadence from every 30 minutes to once a day.",
          "Filter out the rest so the bot reflects your market focus.",
        ],
      },
      {
        id: "vote-and-learn",
        heading: "Vote on the signal",
        paragraphs: [
          "When a curated signal arrives, users can back the direction they believe in. The market outcome closes the loop between reading a signal and testing a view.",
          "Participation is also reflected in the bot’s points system, alongside recurring activity and qualified referrals.",
        ],
      },
      {
        id: "invite",
        heading: "Bring in another reader",
        paragraphs: [
          "Every user receives a unique invite link. A qualified invite is recorded after the new user subscribes and casts a first vote.",
          "The important part is not the referral count alone—it is bringing another active participant into the signal loop.",
        ],
      },
    ],
  },
] satisfies readonly BlogPostSource[];
