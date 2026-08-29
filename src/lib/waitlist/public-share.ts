import "server-only";

import { headers } from "next/headers";

import { isValidInviteCode, normalizeInviteCode, waitlistApi } from "./api";
import { mapCardToOutcome, PERSONAS_BY_CODE } from "./persona";

/** 分享落地页（?invite=xxx）在服务端渲染 OG 元数据用的归一化卡片。文案恒为英文。 */
export type InviterShareCard = {
  invite: string;
  name: string;
  roast: string;
  poles: readonly string[];
  stats: { conviction: number; instinct: number; resilience: number };
  /** 优先本地立绘（站内路径）；API 图仅在没有本地映射时使用。 */
  artSrc: string;
};

export async function loadInviterShareCard(
  rawInvite: string | null | undefined,
): Promise<InviterShareCard | null> {
  const invite = normalizeInviteCode(rawInvite ?? "");
  if (!isValidInviteCode(invite)) return null;

  try {
    const data = await waitlistApi.getPublicResult(invite);
    if (!data || data.hidden || !data.card) return null;
    const outcome = mapCardToOutcome(data.card);
    const localArt =
      PERSONAS_BY_CODE[outcome.persona.mark]?.artSrc ||
      PERSONAS_BY_CODE[outcome.persona.code]?.artSrc ||
      "";
    return {
      invite,
      name: outcome.persona.name,
      roast: outcome.persona.roast,
      poles: outcome.poles,
      stats: outcome.stats,
      artSrc: localArt || outcome.persona.artSrc,
    };
  } catch {
    // 公开结果拉不到时回退默认元数据，分享页本体不受影响。
    return null;
  }
}

/** 当前请求的部署源（preview/生产/本地都指向自身），用于拼 OG 图等绝对地址。 */
export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return "https://smartx.io";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.");
  const proto = h.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");
  return `${proto}://${host}`;
}
