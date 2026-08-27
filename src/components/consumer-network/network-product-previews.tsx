import Image from "next/image";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import type { MessageDescriptor } from "@lingui/core";

import styles from "./consumer-home.module.css";

const PRODUCT_ASSET_ROOT = "/assets/consumer-network/product-ui";

// 产品切片里的 UI 标签走翻译；演示用户名/帖子正文/市场标题是内容数据，保持英文（与真实产品一致）。
const VERIFIED_PROFILE = msg`Verified profile`;

const rankedTraders = [
  {
    id: "quarterty",
    name: "North Index",
    handle: VERIFIED_PROFILE,
    pnl: "+$128.4K",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-quarterty.png`,
  },
  {
    id: "rowdy",
    name: "Clear Signal",
    handle: VERIFIED_PROFILE,
    pnl: "+$219.8K",
    midPnl: "+$164.2K",
    previousPnl: "+$118.6K",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
  },
  {
    id: "smartx",
    name: "Open Ledger",
    handle: VERIFIED_PROFILE,
    pnl: "+$63.5K",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-smartx.png`,
  },
  {
    id: "macro",
    name: "Quiet Market",
    handle: VERIFIED_PROFILE,
    pnl: "+$58.2K",
  },
] as const;

function LeaderboardPreview() {
  const { i18n } = useLingui();

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
              <span className={styles.rankingFallbackAvatar}>QM</span>
            )}
            <span className={styles.rankingIdentity}>
              <strong>{trader.name}</strong>
              <small>{i18n._(trader.handle)}</small>
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
              <small>
                <Trans>30D P&L</Trans>
              </small>
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
  handle: MessageDescriptor;
  body: string;
  socialAvatar: string;
  socialProof: MessageDescriptor;
  asset: Readonly<{
    kind: "prediction" | "token" | "stock";
    image: string;
    title: string;
    averageEntry: MessageDescriptor;
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
  const { i18n } = useLingui();

  return (
    <article className={styles.squarePost}>
      <header>
        <Image src={avatar} alt="" width={30} height={30} sizes="30px" />
        <span>
          <strong>{name}</strong>
          <small>
            <Trans>{i18n._(handle)} · now</Trans>
          </small>
        </span>
        <em>
          <Trans>Opinion</Trans>
        </em>
      </header>
      <p>{body}</p>
      <div className={styles.squarePosition} data-asset={asset.kind}>
        <Image src={asset.image} alt="" width={32} height={32} sizes="32px" />
        <span className={styles.squareAssetCopy}>
          <strong>{asset.title}</strong>
          <small>{i18n._(asset.averageEntry)}</small>
        </span>
        <span className={styles.squarePositionValue}>
          <strong>{asset.value}</strong>
          <small>{asset.pnl}</small>
        </span>
      </div>
      <footer className={styles.squareSocialProof}>
        <span>♡</span>
        <Image src={socialAvatar} alt="" width={16} height={16} sizes="16px" />
        <small>{i18n._(socialProof)}</small>
      </footer>
    </article>
  );
}

const squarePosts = [
  {
    key: "north-index-primary",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-quarterty.png`,
    name: "North Index",
    handle: msg`Demo profile`,
    body: "The committee still has room to wait. I am keeping the No position.",
    socialAvatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
    socialProof: msg`A trader you follow liked this`,
    asset: {
      kind: "prediction",
      image: `${PRODUCT_ASSET_ROOT}/market-fed.png`,
      title: "Will the Fed cut rates in September?",
      averageEntry: msg`No · Avg entry 61¢`,
      value: "$18.4K",
      pnl: "+$2.3K PnL",
    },
  },
  {
    key: "clear-signal",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
    name: "Clear Signal",
    handle: msg`Demo profile`,
    body: "Volume is improving without a matching spike in concentration.",
    socialAvatar: `${PRODUCT_ASSET_ROOT}/avatar-quarterty.png`,
    socialProof: msg`3 traders you follow liked this`,
    asset: {
      kind: "token",
      image: `${PRODUCT_ASSET_ROOT}/token-pump.svg`,
      title: "PUMP token",
      averageEntry: msg`Avg entry · $1.52B MC`,
      value: "$31.9K",
      pnl: "+$4.9K PnL",
    },
  },
  {
    key: "open-ledger-stock",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-smartx.png`,
    name: "Open Ledger",
    handle: msg`Demo profile`,
    body: "Onchain equity volume is holding above the weekly range.",
    socialAvatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
    socialProof: msg`A verified trader liked this`,
    asset: {
      kind: "stock",
      image: `${PRODUCT_ASSET_ROOT}/token-aaplx.svg`,
      title: "AAPLx",
      averageEntry: msg`Avg entry · $228.40`,
      value: "$12.5K",
      pnl: "+$620 PnL",
    },
  },
  {
    key: "north-index-loop",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-quarterty.png`,
    name: "North Index",
    handle: msg`Demo profile`,
    body: "The committee still has room to wait. I am keeping the No position.",
    socialAvatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
    socialProof: msg`A trader you follow liked this`,
    asset: {
      kind: "prediction",
      image: `${PRODUCT_ASSET_ROOT}/market-fed.png`,
      title: "Will the Fed cut rates in September?",
      averageEntry: msg`No · Avg entry 61¢`,
      value: "$18.4K",
      pnl: "+$2.3K PnL",
    },
  },
] as const;

function SquareForYouPreview() {
  return (
    <div className={styles.squarePreview}>
      <header className={styles.squareTopbar}>
        <strong>
          <Trans>Square</Trans>
        </strong>
        <i className={styles.squareFilter}>
          <span />
          <span />
          <span />
        </i>
      </header>
      <div className={styles.squareLanes}>
        <b>
          <Trans>For You</Trans>
        </b>
        <b>
          <Trans>Newest</Trans>
        </b>
        <b>
          <Trans>Friends</Trans>
        </b>
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
  traderMeta: MessageDescriptor;
  traderPnl: string;
  marketImage: string;
  marketTitle: string;
  opinion: string;
  side: MessageDescriptor;
  amount: string;
  positionValue: string;
  entry: string;
  current: string;
  copied: number;
}>;

const tradeSignals: readonly SignalCardData[] = [
  {
    id: "fed",
    trader: "North Index",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-quarterty.png`,
    traderMeta: msg`30d 72% win · 982 trades`,
    traderPnl: "+$220K",
    marketImage: `${PRODUCT_ASSET_ROOT}/market-fed.png`,
    marketTitle: "Fed Decision in September?",
    opinion: "Inflation is cooling too slowly for a cut. I am keeping the base case while labor data stays firm.",
    side: msg`No change`,
    amount: "$435.20",
    positionValue: "$18.4K",
    entry: "61¢",
    current: "64¢",
    copied: 64,
  },
  {
    id: "bitcoin",
    trader: "Clear Signal",
    avatar: `${PRODUCT_ASSET_ROOT}/avatar-rowdy.png`,
    traderMeta: msg`30d 68% win · 282 trades`,
    traderPnl: "+$128.4K",
    marketImage: `${PRODUCT_ASSET_ROOT}/market-bitcoin.svg`,
    marketTitle: "Will Bitcoin reach $150K before 2027?",
    opinion: "The skew still favors a late-cycle breakout while price holds the recent range.",
    side: msg`Yes`,
    amount: "$12.5K",
    positionValue: "$38.8K",
    entry: "34¢",
    current: "38¢",
    copied: 128,
  },
] as const;

function SignalCard({ signal }: { signal: SignalCardData }) {
  const { i18n } = useLingui();

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
          <small>{i18n._(signal.traderMeta)}</small>
        </span>
        <span className={styles.tradeSignalPnl}>
          <strong>{signal.traderPnl}</strong>
          <small>
            <Trans>30D P&L</Trans>
          </small>
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
            <small>{i18n._(signal.side)}</small>
            <strong>{signal.amount}</strong>
          </span>
          <span>
            <small>
              <Trans>Position value</Trans>
            </small>
            <strong>{signal.positionValue}</strong>
          </span>
        </div>
        <footer>
          <small>
            <Trans>Entry</Trans> <strong>{signal.entry}</strong>
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
            <Trans>{signal.copied} copied</Trans>
          </b>
        </footer>
      </div>
    </article>
  );
}

function TradePreview() {
  const { i18n } = useLingui();
  const firstSignal = tradeSignals[0];

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
            <strong>
              <Trans>Copy</Trans>
            </strong>
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
            <strong>
              <Trans>Skip</Trans>
            </strong>
          </span>
        </div>
        {tradeSignals.map((signal) => (
          <div className={styles.tradeQueueCard} data-card={signal.id} key={signal.id}>
            <SignalCard signal={signal} />
          </div>
        ))}
      </div>
      <span className={styles.tradeGesture} />
      <div className={styles.tradeToast} data-toast={firstSignal.id}>
        <i>✓</i>
        <span>
          <strong>
            <Trans>Order submitted</Trans>
          </strong>
          <small>
            <Trans>
              5 USDC · {i18n._(firstSignal.side)} at {firstSignal.current}
            </Trans>
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
