import Image from "next/image";

import styles from "./consumer-home.module.css";

const PRODUCT_ASSET_ROOT = "/assets/consumer-network/product-ui";

const rankedTraders = [
  {
    id: "quarterty",
    name: "Trader 02",
    handle: "Verified profile",
    pnl: "+$128.4K",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-quarterty.png`,
  },
  {
    id: "rowdy",
    name: "Trader 01",
    handle: "Verified profile",
    pnl: "+$219.8K",
    midPnl: "+$164.2K",
    previousPnl: "+$118.6K",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
  },
  {
    id: "smartx",
    name: "Trader 03",
    handle: "Verified profile",
    pnl: "+$63.5K",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-smartx.png`,
  },
  {
    id: "macro",
    name: "Trader 04",
    handle: "Verified profile",
    pnl: "+$58.2K",
  },
] as const;

function LeaderboardPreview() {
  return (
    <div className={styles.leaderboardPreview}>
      <div className={styles.rankingRanks} aria-hidden="true">
        <span>01</span>
        <span>02</span>
        <span>03</span>
        <span>04</span>
      </div>
      <div className={styles.leaderboardStage}>
        {rankedTraders.map((trader) => (
          <article
            className={styles.rankingRow}
            data-trader={trader.id}
            key={trader.name}
          >
            {"avatar" in trader ? (
              <Image src={trader.avatar} alt="" width={38} height={38} sizes="38px" />
            ) : (
              <span className={styles.rankingFallbackAvatar}>T4</span>
            )}
            <span className={styles.rankingIdentity}>
              <strong>{trader.name}</strong>
              <small>{trader.handle}</small>
            </span>
            <span className={styles.rankingPnl}>
              {"previousPnl" in trader ? (
                <span className={styles.rankingPnlValues}>
                  <strong className={styles.rankingPnlBefore}>{trader.previousPnl}</strong>
                  <strong className={styles.rankingPnlMid}>{trader.midPnl}</strong>
                  <strong className={styles.rankingPnlAfter}>{trader.pnl}</strong>
                </span>
              ) : (
                <strong>{trader.pnl}</strong>
              )}
              <small>30D P&amp;L</small>
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}

type SquarePostProps = Readonly<{
  avatar: string;
  name: string;
  handle: string;
  body: string;
  socialAvatar: string;
  socialProof: string;
  asset: Readonly<{
    kind: "prediction" | "token" | "stock";
    image: string;
    title: string;
    averageEntry: string;
    value: string;
    pnl: string;
  }>;
}>;

function SquarePost({
  avatar,
  name,
  handle,
  body,
  socialAvatar,
  socialProof,
  asset,
}: SquarePostProps) {
  return (
    <article className={styles.squarePost}>
      <header>
        <Image src={avatar} alt="" width={30} height={30} sizes="30px" />
        <span>
          <strong>{name}</strong>
          <small>{handle} · now</small>
        </span>
        <em>Opinion</em>
      </header>
      <p>{body}</p>
      <div className={styles.squarePosition} data-asset={asset.kind}>
        <Image src={asset.image} alt="" width={32} height={32} sizes="32px" />
        <span className={styles.squareAssetCopy}>
          <strong>{asset.title}</strong>
          <small>{asset.averageEntry}</small>
        </span>
        <span className={styles.squarePositionValue}>
          <strong>{asset.value}</strong>
          <small>{asset.pnl}</small>
        </span>
      </div>
      <footer className={styles.squareSocialProof}>
        <span>♡</span>
        <Image src={socialAvatar} alt="" width={16} height={16} sizes="16px" />
        <small>{socialProof}</small>
      </footer>
    </article>
  );
}

const squarePosts = [
  {
    key: "rowdy-primary",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
    name: "Trader 01",
    handle: "Demo profile",
    body: "The committee still has room to wait. I am keeping the No position.",
    socialAvatar: `${PRODUCT_ASSET_ROOT}/avatar-quarterty.png`,
    socialProof: "A trader you follow liked this",
    asset: {
      kind: "prediction",
      image: `${PRODUCT_ASSET_ROOT}/market-fed.png`,
      title: "Will the Fed cut rates in September?",
      averageEntry: "No · Avg entry 61¢",
      value: "$18.4K",
      pnl: "+$2.3K PnL",
    },
  },
  {
    key: "quarterty",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-quarterty.png`,
    name: "Trader 02",
    handle: "Demo profile",
    body: "Volume is improving without a matching spike in concentration.",
    socialAvatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
    socialProof: "3 traders you follow liked this",
    asset: {
      kind: "token",
      image: `${PRODUCT_ASSET_ROOT}/token-pump.svg`,
      title: "PUMP token",
      averageEntry: "Avg entry · $1.52B MC",
      value: "$31.9K",
      pnl: "+$4.9K PnL",
    },
  },
  {
    key: "smartx-stock",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-smartx.png`,
    name: "Trader 03",
    handle: "Demo profile",
    body: "Onchain equity volume is holding above the weekly range.",
    socialAvatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
    socialProof: "A verified trader liked this",
    asset: {
      kind: "stock",
      image: `${PRODUCT_ASSET_ROOT}/token-aaplx.svg`,
      title: "AAPLx",
      averageEntry: "Avg entry · $228.40",
      value: "$12.5K",
      pnl: "+$620 PnL",
    },
  },
  {
    key: "rowdy-loop",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
    name: "Trader 01",
    handle: "Demo profile",
    body: "The committee still has room to wait. I am keeping the No position.",
    socialAvatar: `${PRODUCT_ASSET_ROOT}/avatar-quarterty.png`,
    socialProof: "A trader you follow liked this",
    asset: {
      kind: "prediction",
      image: `${PRODUCT_ASSET_ROOT}/market-fed.png`,
      title: "Will the Fed cut rates in September?",
      averageEntry: "No · Avg entry 61¢",
      value: "$18.4K",
      pnl: "+$2.3K PnL",
    },
  },
] as const;

function SquareForYouPreview() {
  return (
    <div className={styles.squarePreview}>
      <header className={styles.squareTopbar}>
        <strong>Square</strong>
        <i className={styles.squareFilter}>
          <span />
          <span />
          <span />
        </i>
      </header>
      <div className={styles.squareLanes}>
        <b>For You</b>
        <b>Newest</b>
        <b>Friends</b>
      </div>
      <div className={styles.squareFeed}>
        <div className={styles.squareFeedTrack}>
          {squarePosts.map((post) => (
            <SquarePost {...post} key={post.key} />
          ))}
        </div>
      </div>
    </div>
  );
}

type SignalCardData = Readonly<{
  id: "fed" | "bitcoin";
  trader: string;
  avatar: string;
  traderMeta: string;
  traderPnl: string;
  marketImage: string;
  marketTitle: string;
  opinion: string;
  side: "Yes" | "No change";
  amount: string;
  positionValue: string;
  entry: string;
  current: string;
  copied: number;
}>;

const tradeSignals: readonly SignalCardData[] = [
  {
    id: "fed",
    trader: "Trader 01",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
    traderMeta: "30d 72% win · 982 trades",
    traderPnl: "+$220K",
    marketImage: `${PRODUCT_ASSET_ROOT}/market-fed.png`,
    marketTitle: "Fed Decision in September?",
    opinion: "Inflation is cooling too slowly for a cut. I am keeping the base case while labor data stays firm.",
    side: "No change",
    amount: "$435.20",
    positionValue: "$18.4K",
    entry: "61¢",
    current: "64¢",
    copied: 64,
  },
  {
    id: "bitcoin",
    trader: "Trader 02",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-quarterty.png`,
    traderMeta: "30d 68% win · 282 trades",
    traderPnl: "+$128.4K",
    marketImage: `${PRODUCT_ASSET_ROOT}/market-bitcoin.svg`,
    marketTitle: "Will Bitcoin reach $150K before 2027?",
    opinion: "The skew still favors a late-cycle breakout while price holds the recent range.",
    side: "Yes",
    amount: "$12.5K",
    positionValue: "$38.8K",
    entry: "34¢",
    current: "38¢",
    copied: 128,
  },
] as const;

function SignalCard({ signal }: { signal: SignalCardData }) {
  return (
    <article className={styles.tradeSignalCard}>
      <header>
        <Image
          src={signal.avatar}
          alt=""
          width={32}
          height={32}
          sizes="32px"
        />
        <span>
          <strong>{signal.trader}</strong>
          <small>{signal.traderMeta}</small>
        </span>
        <span className={styles.tradeSignalPnl}>
          <strong>{signal.traderPnl}</strong>
          <small>30D P&amp;L</small>
        </span>
      </header>
      <div className={styles.tradeSignalMarket}>
        <div className={styles.tradeMarketTitle}>
          <Image
            src={signal.marketImage}
            alt=""
            width={40}
            height={40}
            sizes="40px"
          />
          <strong>{signal.marketTitle}</strong>
        </div>
        <p>{signal.opinion}</p>
        <div className={styles.tradeSignalPosition}>
          <span>
            <small>{signal.side}</small>
            <strong>{signal.amount}</strong>
          </span>
          <span>
            <small>Position value</small>
            <strong>{signal.positionValue}</strong>
          </span>
        </div>
        <footer>
          <small>
            Entry <strong>{signal.entry}</strong>
            <Image
              src={`${PRODUCT_ASSET_ROOT}/signal-chevron-right.svg`}
              alt=""
              width={11}
              height={11}
              sizes="11px"
            />
            <strong>{signal.current}</strong>
          </small>
          <b>
            <Image
              src={`${PRODUCT_ASSET_ROOT}/signal-copy.svg`}
              alt=""
              width={11}
              height={11}
              sizes="11px"
            />
            {signal.copied} copied
          </b>
        </footer>
      </div>
    </article>
  );
}

function TradePreview() {
  return (
    <div className={styles.tradePreview}>
      <div className={styles.tradeDeck}>
        <div className={styles.tradeSwipeUnderlay}>
          {tradeSignals.map((signal) => (
            <div
              className={styles.tradeSwipeGhost}
              data-ghost={signal.id}
              key={`ghost-${signal.id}`}
            >
              <SignalCard signal={signal} />
            </div>
          ))}
          <span className={styles.tradeSwipeCopy}>
            <Image
              src={`${PRODUCT_ASSET_ROOT}/signal-copy-action.svg`}
              alt=""
              width={13}
              height={13}
              sizes="13px"
            />
            <strong>Copy</strong>
            <small>5 USDC</small>
          </span>
          <span className={styles.tradeSwipeSkip}>
            <Image
              src={`${PRODUCT_ASSET_ROOT}/signal-skip-action.svg`}
              alt=""
              width={13}
              height={13}
              sizes="13px"
            />
            <strong>Skip</strong>
          </span>
        </div>
        {tradeSignals.map((signal) => (
          <div className={styles.tradeQueueCard} data-card={signal.id} key={signal.id}>
            <SignalCard signal={signal} />
          </div>
        ))}
      </div>
      <span className={styles.tradeGesture} />
      <div className={styles.tradeToast} data-toast={tradeSignals[0].id}>
        <i>✓</i>
        <span>
          <strong>Order submitted</strong>
          <small>
            5 USDC · {tradeSignals[0].side} at {tradeSignals[0].current}
          </small>
        </span>
      </div>
    </div>
  );
}

export type NetworkPreviewKind = "verified" | "personalized" | "trade";

export function NetworkProductPreview({ kind }: { kind: NetworkPreviewKind }) {
  return (
    <div
      className={`${styles.featureProduct} ${styles.productPreview}`}
      data-preview={kind}
      aria-hidden="true"
    >
      {kind === "verified" ? <LeaderboardPreview /> : null}
      {kind === "personalized" ? <SquareForYouPreview /> : null}
      {kind === "trade" ? <TradePreview /> : null}
    </div>
  );
}
