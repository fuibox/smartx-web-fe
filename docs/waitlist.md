# SmartX Waitlist PRD

> 状态：2026-08-21 产品规则收敛版
> 当前目标：冻结入口、答题、计分、结果与传播规则；图片和最终视觉体系在方向稿选定后再冻结。

## 1. 产品目标与原则

Waitlist 是官网进入 SmartX 的第一段轻量产品体验，不是独立的娱乐测试站。

它承担四个任务：

1. 用六道交易场景题让用户快速获得可自我投射的结果。
2. 通过严格 invite-only 保持首发稀缺性和传播链路可控。
3. 在答题后用邮箱保存结果并激活 waitlist 排名。
4. 用可分享的人格、属性和关系结果吸引好友继续测试。

核心链路：

```text
邀请码 → 六道题 → 邮箱验证 → 人格与属性 → 排名 → 分享结果 → 好友使用邀请进入
```

产品原则：

- 一屏只完成一个主要任务。
- 邀请码是准入门槛，邮箱、Telegram 和 X 不前置。
- 人格、属性、搭档和天敌必须来自同一套计分结果，不能互相矛盾。
- 结果允许自嘲，但先让用户觉得“像我”，再让用户觉得“好笑”。
- Waitlist 与官网共享品牌和产品承接，不复制官网的长页面结构与像素语法。

## 2. 用户流程

### 2.1 直接入口

```text
/waitlist
  → 输入并验证邀请码
  → 六道题
  → 绑定邮箱并验证
  → 人格、三项属性、搭档/天敌和排名
  → 可选加入 Telegram / Follow X
  → 分享结果并获得一次性邀请
```

Landing 工作文案：

- Kicker: `THE SMARTX TRADER TYPE TEST`
- H1: `How do you trade when it gets real?`
- Lede: `Six decisions reveal your risk, signal, and social instincts.`
- CTA: `Begin`

### 2.2 好友分享入口

生产链接：

```text
/waitlist/r/{result_id}?invite={one_time_invite}
```

进入后先展示朋友的真实结果，再邀请访问者测试。不得因为 URL 已带邀请码而直接跳题。

页面顺序：

```text
朋友的结果海报与属性
  → Best Match / Natural Rival
  → Find my trader type
  → 使用链接中的一次性邀请码开始答题
```

若邀请码已失效，朋友结果仍然可见；CTA 切换为输入其他邀请码，不丢失当前页面。

### 2.3 答题、邮箱与结果

- 每屏一道题、一张主图、四条纵向文本选项。
- 桌面端建议图片与答题区左右排列；移动端图片在上、选项在下。
- 只保留低存在感的返回按钮和六个进度点，不显示维度名或 `4 OF 6`。
- 选择答案后进入下一题；返回时可以覆盖答案。
- 六题完成后才要求邮箱；邮箱验证成功后生成并激活排名。
- Telegram 和 X 始终为可选动作，不影响查看结果或排名。

邮箱页只说明一件事：

- Kicker: `YOUR RESULT IS READY`
- H1: `Save your result.`
- Lede: `Bind an email to keep it and create your waitlist position.`

## 3. 测试与计分

### 3.1 双层计分模型

测试同时产出两组不同的数据，不能混为一谈：

1. **人格判型轴**决定用户属于哪一种人格。
2. **结果展示属性**形成结果卡上的信仰、嗅觉和复原力数值。

#### 人格判型轴

| 判型轴 | 低端 | 高端 | 表达的行为差异 |
| --- | --- | --- | --- |
| Risk posture | Sniper | Degen | 等待计划内机会，还是主动追逐高波动机会 |
| Decision basis | Gut | Data | 更依赖直觉与叙事，还是证据、图表与链上数据 |
| Trading mode | Lone | Pack | 独立决策，还是主动参考并影响社群 |

每条判型轴由两道题测量。每道题的四个选项只测量一个主轴，并分别赋予 `axis_weight`：

```text
-2 / -1 / +1 / +2
```

两题相加后，每条判型轴可获得 `-4` 到 `+4` 的九档结果。三条轴的方向组合决定八种常规人格；判型轴在结果页只作为 `DEGEN · DATA · PACK` 一类解释标签，不作为结果卡的三条属性条。

若某条轴恰好为 `0`，使用该轴第二道题的答案方向打破平局；规则固定且随 `quiz_version` 保存。

#### 结果展示属性

| 展示属性 | 英文 | 表达的行为差异 |
| --- | --- | --- |
| 信仰 | Conviction | 敢押、敢扛，以及对自己判断的坚持程度 |
| 嗅觉 | Instinct | 发现机会、读取信号和判断时机的敏感度 |
| 复原力 | Resilience | 面对亏损、止损和波动后继续留在场内的能力 |

每个答案除 `axis_weight` 外，还可以为一到两项展示属性写入 `stat_delta`。展示属性从 30 分起算，最终限制在 `5–99`：

```text
stat_score = clamp(5, 99, 30 + sum(stat_delta))
```

人格只由判型轴决定，展示属性只由属性加点决定。两位用户可以得到同一人格，但拥有不同的信仰、嗅觉和复原力。结果页可以显示整数，但不使用小数，也不把六道题包装成心理测量学结论。

### 3.2 六道题的建议结构

以下是逻辑基准，英文语气可以继续润色，但选项顺序在前端随机展示时必须保留权重映射。

#### Risk posture

**R1 · A coin you do not own is up 40%. What do you do?**

| 选项方向 | `axis_weight` | `stat_delta` |
| --- | ---: | --- |
| Buy now. Momentum rarely waits. | +2 | Conviction +15 |
| Start small now and add if it holds. | +1 | Conviction +10 · Instinct +5 |
| Set my entry and wait. | -1 | Instinct +10 |
| Pass. No setup, no trade. | -2 | Resilience +10 · Instinct +5 |

**R2 · Your position moves 20% against you. What happens next?**

| 选项方向 | `axis_weight` | `stat_delta` |
| --- | ---: | --- |
| Add immediately. The market is improving my entry. | +2 | Conviction +15 |
| Give it more room before deciding. | +1 | Conviction +10 · Resilience +5 |
| Reduce the position according to plan. | -1 | Resilience +10 · Instinct +5 |
| Exit at invalidation. No debate. | -2 | Resilience +15 |

#### Decision basis

**D1 · Before entering a trade, what convinces you most?**

| 选项方向 | `axis_weight` | `stat_delta` |
| --- | ---: | --- |
| Wallet flows, data, and a clear invalidation level. | +2 | Instinct +15 |
| Chart structure and price confirmation. | +1 | Instinct +10 · Resilience +5 |
| The market’s mood and momentum. | -1 | Conviction +5 · Instinct +5 |
| A strong thesis that simply feels early. | -2 | Conviction +10 · Instinct +5 |

**D2 · A trader you trust posts a high-conviction call. What do you do?**

| 选项方向 | `axis_weight` | `stat_delta` |
| --- | ---: | --- |
| Verify it with onchain data and market structure. | +2 | Instinct +15 |
| Check the chart before taking a position. | +1 | Instinct +10 · Resilience +5 |
| Open a small starter because I trust the source. | -1 | Conviction +5 · Instinct +5 |
| Follow immediately. Conviction is contagious. | -2 | Conviction +10 |

#### Trading mode

**S1 · You catch a 10×. Who hears first?**

| 选项方向 | `axis_weight` | `stat_delta` |
| --- | ---: | --- |
| Screenshot, group chat, X. | +2 | Conviction +10 |
| My close trading group. | +1 | Conviction +5 · Resilience +5 |
| One trusted friend, maybe. | -1 | Resilience +5 · Instinct +5 |
| No one. I take profit and keep moving. | -2 | Resilience +10 · Instinct +5 |

**S2 · Your group chat strongly disagrees with your trade. What do you do?**

| 选项方向 | `axis_weight` | `stat_delta` |
| --- | ---: | --- |
| Debate it with the group and adjust if they have a point. | +2 | Resilience +5 · Instinct +5 |
| Listen first, then decide. | +1 | Instinct +10 · Resilience +5 |
| Note the feedback but keep my plan. | -1 | Conviction +5 · Resilience +10 |
| Ignore the noise and execute alone. | -2 | Conviction +10 · Resilience +5 |

### 3.3 九种人格

八种常规人格来自三条轴的八种方向组合：

| 代码 | 中文人格 | 英文人格 | 三维组合 |
| --- | --- | --- | --- |
| LQD | 送钱者 | The Liquidity Donor | DEGEN · GUT · PACK |
| AIM | 梭哈仙人 | The All-In Mystic | DEGEN · GUT · LONE |
| SIG | 喊单军师 | The Signal General | DEGEN · DATA · PACK |
| CND | K线教主 | The Candle Prophet | DEGEN · DATA · LONE |
| DIP | 抄底带头大哥 | The Dip Ringleader | SNIPER · GUT · PACK |
| DOC | 行情老中医 | The Market Doctor | SNIPER · GUT · LONE |
| CHN | 链上侦探 | The Onchain Detective | SNIPER · DATA · PACK |
| LMT | 潜伏狙击手 | The Limit Sniper | SNIPER · DATA · LONE |

第九种 `RSK · The Risk Monk / 风控大师` 是克制型签名结果，仅在以下条件同时成立时覆盖常规人格：

1. Risk posture 原始分为 `-4`，即两道风险题都选择最克制答案。
2. Decision basis 与 Trading mode 均未达到绝对极值 `4`。

这保证“风控大师”不会由明显 degen 的回答生成，也不会覆盖极端鲜明的 Data/Gut 或 Pack/Lone 行为。

每个人格必须包含：中文名、英文名、行为解释、roast line、视觉代码和内容版本。详细文案以代码内容源为准，PRD 不重复维护九段长文。

### 3.4 搭档与天敌

第一版采用人格级固定关系，保证文案稳定且可解释：

| 人格 | Best Match | Natural Rival |
| --- | --- | --- |
| Liquidity Donor | Dip Ringleader | Limit Sniper |
| All-In Mystic | Market Doctor | Onchain Detective |
| Signal General | Onchain Detective | Market Doctor |
| Candle Prophet | Limit Sniper | Dip Ringleader |
| Dip Ringleader | Liquidity Donor | Candle Prophet |
| Market Doctor | All-In Mystic | Signal General |
| Onchain Detective | Signal General | All-In Mystic |
| Limit Sniper | Candle Prophet | Liquidity Donor |
| Risk Monk | Onchain Detective | Liquidity Donor |

Best Match 通常共享 Decision basis 与 Trading mode，但在 Risk posture 上互补；Natural Rival 通常位于三个方向的对面。每组关系需要一条不超过两行的解释。

## 4. 邀请、结果、排名与分享

### 4.1 邀请码保留

- 首发严格 invite-only。
- 邀请码验证成功后原子保留 2 分钟，同一时间只能被一个会话持有。
- 用户持续答题时续期，最长持有 10 分钟。
- 邮箱提交后邀请码进入待验证状态，不再依赖短租约。
- 页面关闭或保留过期后自动释放。
- 若邀请码过期或被占用，用户已经完成的答案必须保留，只需更换邀请码，不得要求重答。
- 前端不显示倒计时，只提示：`Your invite is reserved for this session.`
- 入口错误必须区分并给出下一步：
  - 无效：`Invite code not recognized. Check the code and try again.`
  - 已使用：`This invite has already been claimed. Ask for another one.`
  - 被其他会话暂时锁定：`This invite is being used in another session. Try again in 2 minutes.`
- 原型保留 `123456`，`Use prototype code` 在本地一键直接进入第一题；生产环境移除该入口。

### 4.2 结果快照

每次完成测试生成新的、不可枚举的 `result_id`。重测不会覆盖旧结果。

结果快照冻结：

- `quiz_version`
- 六道答案、三条判型轴原始分和三项展示属性分
- `persona_id`
- `best_match_id` 与 `natural_rival_id`
- `copy_version` 与 `card_version`

公开结果不包含邮箱、原始邀请码或其他用户身份信息。

### 4.3 结果页层级

1. 人格名、判型标签、信仰/嗅觉/复原力和一句 roast。
2. Best Match / Natural Rival 及简短解释。
3. Waitlist 排名和一个主要分享 CTA。
4. 可选 Telegram / X。
5. 下载入口位于结果海报底部。

结果分享支持 1200×630 和 1080×1920 两种卡片。动态 OG 图必须按 `result_id` 恢复该用户的真实属性，而不是只显示人格模板。

分享奖励、邀请兑换和排名变化必须幂等。打开 X 分享窗口只能记录 `share_clicked`，不能伪装成已经成功发帖。

## 5. 视觉边界

当前冻结：

- 不使用像素 Owl、动物拟人、塔罗或旧神兽资产。
- 每道题只使用一张主图，不为每个选项分别配图。
- 图片使用 1:1 母版，桌面可以按构图裁成 4:5；移动端优先保留完整主体。
- 问题标题使用展示型 Serif，正文和控件使用 Sans Serif；全页最多两套字体。
- 允许较大圆角、开放式排版与克制的 Glassmorphism，不使用整页方框、卡片套卡片或无语义渐变。
- Waitlist 与官网共享 navy、teal、正式 logo 和产品承接，但不沿用官网像素字体、切角容器和长页面动效。
- 动效只解释状态变化：答题推进、结果揭示、排名变化和邀请解锁。

待冻结：

- 明暗主题、最终字体和玻璃材质强度。
- 问题图与人格图采用 3D、摄影、抽象图形或混合媒介。
- 结果卡的最终插图与动效体系。

旧塔罗与动物资产继续保存在 `archive/waitlist-tarot-v1/`，不得被当前页面引用。

## 6. 埋点、隐私与验收

### 6.1 核心埋点

| 事件 | 用人话说明监测什么 | 关键属性 |
| --- | --- | --- |
| `waitlist_landing_view` | 有多少人进入活动，以及来自官网直达还是朋友分享 | `entry_type: direct/referral`, `result_id_present`, `invite_present` |
| `referral_result_view` | 朋友分享的真实结果有没有被打开，哪类人格最能带来访问 | `result_id`, `persona_id` |
| `invite_submit` | 用户看到邀请码门槛后，是否愿意尝试进入 | `entry_type` |
| `invite_reserve_success` | 有多少人持有效邀请码并真正通过入口 | `entry_type` |
| `invite_reserve_failed` | 用户被挡在入口的主要原因是无效、已使用、被占用还是过期 | `reason` |
| `quiz_started` | 通过邀请码的人里，有多少真正开始测试 | `quiz_version`, `entry_type` |
| `quiz_answered` | 每道题的选择分布、作答耗时，以及用户最容易在哪一题流失 | `question_id`, `option_id`, `elapsed_ms` |
| `quiz_completed` | 测试完成率、人格分布是否失衡，以及两套分数是否按预期产出 | `result_id`, `persona_id`, `risk_score`, `basis_score`, `mode_score`, `conviction_score`, `instinct_score`, `resilience_score` |
| `email_submitted` | 看完“结果已生成”的提示后，有多少人愿意用邮箱换取保存和排名 | `result_id` |
| `email_verified` | 有多少人完成真实邮箱验证并正式激活 waitlist 资格 | `result_id` |
| `result_viewed` | 验证成功后，结果是否顺利揭示并被用户看到 | `result_id`, `persona_id` |
| `community_clicked` | 用户对 Telegram 或 X 哪个后续承接渠道更感兴趣 | `channel` |
| `share_clicked` | 用户是否产生分享意愿，以及选择了哪个渠道；只打开 X 分享窗口也记录在这里 | `result_id`, `channel` |
| `result_shared` | 仅在渠道能够确认完成时，监测结果是否真的完成分享；X intent 不以此记成功 | `result_id`, `channel`, `confirmation_type` |
| `invite_link_copied` | 用户是否把一次性邀请链接复制出去，代表更强的邀请意图 | `result_id` |
| `invite_redeemed` | 复制或发送出去的邀请最终有没有带来一位完成准入的新用户 | `source_result_id` |
| `rank_reward_applied` | 分享或有效邀请对应的排名奖励有没有正确且只发放一次 | `result_id`, `reward_type` |

埋点不得上传邮箱、完整邀请码、验证码或自由输入文本。

### 6.2 最小隐私与风险规则

- 分享 URL、OG 图和公开接口不得暴露邮箱。
- 结果仅作为娱乐化交易偏好表达，不宣称心理诊断、收益能力或投资建议。
- 邮箱提交前说明用途，并提供退订与删除入口。
- 邀请占用、领取、分享奖励和排名更新都必须原子且幂等。

### 6.3 本轮验收

- [ ] 直接入口与好友分享入口均按本 PRD 工作。
- [ ] 分享链接使用真实 `result_id`，能恢复人格、属性、搭档和天敌。
- [ ] 六题全部使用四档判型权重，题目与选项只测量声明的主轴，并独立写入展示属性加点。
- [ ] 结果卡展示信仰、嗅觉和复原力；判型轴只用于人格判定与标签解释。
- [ ] 同一人格能够产生不同的信仰、嗅觉和复原力。
- [ ] Risk Monk 只能由极度克制的风险答案生成。
- [ ] 答题页为一张主图和四条纵向选项。
- [ ] 邮箱、Telegram 和 X 不前置到答题前。
- [ ] 结果页包含排名、分享、搭档/天敌和下载入口。
- [ ] 核心漏斗事件可在分析平台中串成完整用户路径。
- [ ] 最终视觉方向与官网新资产并排检查，确认属于同一品牌家族。

## 参考来源

- [Google Docs · 老板原始方案](https://docs.google.com/document/d/1WMWelasjt_FaDw1Eq6RyEfoFiATGIotFVrykRmhdQZg/edit?tab=t.0#heading=h.mmfzw89y7pj2)
- [Lark · 产品补充与方案索引](https://wjpvbd3lg9kg.jp.larksuite.com/wiki/D6mGwhuBBiGzEtkS0pOjgEQKpmh)
- [Google Docs · 运营交易人格方案](https://docs.google.com/document/d/1WTJraroBjYy4XgoXqjVePK7k0EmfM8TB/edit)
- `docs/website-v4.md`
