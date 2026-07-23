import type { BlogPostSource } from "./blog-types";

/**
 * Local editorial source. Route components must consume
 * `blog-repository.ts`, never this collection directly.
 */
export const BLOG_POST_SOURCES = [
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
