# SmartX Waitlist PRD

> 状态：2026-08-21 可评审原型版
> 当前目标：先冻结内容结构、流程和信息层级；人格图片体系暂不冻结，原型统一使用中性 1:1 占位。

## 1. 方案来源与优先级

本 PRD 汇总以下来源。若细节冲突，以本文件的「当前决策」为准：

1. 老板原始方案：[Google Docs · Waitlist 原始方案](https://docs.google.com/document/d/1WMWelasjt_FaDw1Eq6RyEfoFiATGIotFVrykRmhdQZg/edit?tab=t.0#heading=h.mmfzw89y7pj2)
2. 产品补充与问题说明：[Lark · Waitlist 方案索引](https://wjpvbd3lg9kg.jp.larksuite.com/wiki/D6mGwhuBBiGzEtkS0pOjgEQKpmh)
3. 运营改版稿：[Google Docs · 交易人格测试新方案](https://docs.google.com/document/d/1WTJraroBjYy4XgoXqjVePK7k0EmfM8TB/edit)
4. 官网视觉意向：[Figma · 首页方向 21924:2](https://www.figma.com/design/t38RJ52jEzew2IHUY4EwTA/SmartX-%E5%AF%B9%E6%8E%A5%E6%96%87%E6%A1%A3?node-id=21924-2) / [Figma · 产品段 21929:2](https://www.figma.com/design/t38RJ52jEzew2IHUY4EwTA/SmartX-%E5%AF%B9%E6%8E%A5%E6%96%87%E6%A1%A3?node-id=21929-2)
5. 官网实现约束：`docs/website-v4.md`

## 2. 产品意图

Waitlist 不是独立的娱乐测试站，而是官网进入 SmartX 的第一段轻量产品体验。它同时承担四件事：

1. 用低门槛测试让用户产生自我投射和分享动机。
2. 用邀请码保持首发稀缺性和传播链路的可控性。
3. 用邮箱绑定保存结果并激活 waitlist 排名。
4. 用人格结果解释 SmartX 将如何逐步理解用户，而不是只发一张好玩的卡。

完整因果链：

```text
交易习惯 → 人格结果 → 结果卡 → 邮箱与排名 → 分享结果 → 好友通过邀请进入
```

## 3. 当前决策摘要

- 首发严格 invite-only；没有有效邀请码不能答题或绑定邮箱。
- 直接访问和分享访问使用两种 Landing 状态。
- 邀请验证成功后直接答题，不在前置阶段要求邮箱、Telegram 或 X。
- 6 道题完成后绑定邮箱；邮箱验证成功后生成并激活排名。
- Join Telegram / Follow X 放在结果页，均不阻塞结果或排名。
- 分享结果后前进 500 名并解锁一次性邀请链接；具体奖励规则上线前仍需后端确认。
- 当前 9 种结果沿用现有答案到结果的对应关系，本轮只替换人格名称和解释，不重新审计算法。
- 采用运营提出的自嘲人格方向；不再使用动物名作为公开主身份。
- 不建设统一神兽世界观，也不借用 Harry Potter、Marvel 等受版权约束的角色体系。
- 人格英文名采用“可理解的交易梗”，不逐字直译中文。
- 当前 Owl / 像素插图方案不冻结。所有结果图和题目图先保留 1:1 占位，待官网和品牌资产方向确认后再替换。
- 原塔罗资产只归档，不进入当前页面或构建引用。

## 4. 用户流程

### 4.1 直接入口

```text
/waitlist
  → Landing：解释测试价值
  → 输入邀请码
  → 服务端验证并短期保留邀请码
  → 6 道题
  → 绑定邮箱
  → Double opt-in
  → 人格结果 + 激活后的排名
  → 可选加入 Telegram / Follow X
  → 分享结果并解锁邀请
```

直接 Landing 工作文案：

- Kicker: `THE SMARTX TRADER TYPE TEST`
- H1: `What kind of trader are you—really?`
- Lede: `Six questions. Nine trading personas. One result your group chat may already know.`
- CTA: `Reveal my type`

### 4.2 分享入口

```text
/waitlist?result={persona_code}&invite={invite_code}
  → 展示分享者的人格结果卡
  → CTA：Find my trader type
  → 使用 URL 中的邀请码开始答题
```

分享入口必须先展示朋友结果，不能因 URL 中已有有效邀请码而直接跳到第一题。这个页面的主要传播张力是：

> 朋友得到这个结果，你是否也是这样？

若邀请码已经失效：

1. 仍可看到朋友结果。
2. 点击 CTA 后明确提示邀请已失效。
3. 保留页面，不丢失上下文；切换为输入另一个邀请码。

### 4.3 答题

- 每屏只显示一道问题和四个选项。
- 不显示 `Invite / Test / Result` 顶部步骤导航。
- 不显示 `SIGNAL · 4 OF 6` 一类内部维度标签。
- 只保留低存在感的返回按钮和六段进度线。
- 问题标题需要明确的行距，标题与选项至少留出一个完整视觉段落。
- 每个选项保留固定 1:1 图片位；当前只显示中性占位，不以临时图片反向决定未来资产比例。
- 选择答案后自动进入下一题；允许返回上一题并覆盖答案。

### 4.4 邮箱与验证

完成答题后只说明一件事：绑定邮箱才能保存结果并激活排名。

不再展示以下解释性清单：

- `Your answers / Saved with your result`
- `Your position / Created after verification`
- `Community tasks / Optional until the end`

邮箱页面工作文案：

- Kicker: `YOUR RESULT IS READY`
- H1: `Keep it.`
- Lede: `Bind an email to save your result and activate your waitlist position.`

### 4.5 结果、社群和分享

结果页采用两栏：

- 左侧：人格海报、人格解释、roast line、下载入口。
- 右侧：排名、可选社群动作、分享 CTA；分享后原位切换为邀请链接。

结果一出现就展示激活后的排名。Telegram 和 X 是可选后续动作，不再作为查看结果、生成排名或分享结果的前置条件。

## 5. 邀请码短租约

“锁定 2 分钟”不能只用前端倒计时实现。生产方案使用可续约短租约：

1. `POST /invite/reserve` 用原子 compare-and-set 把 `unused → reserved`。
2. 返回不可猜的 `reservation_token` 和 `expires_at = now + 2 min`。
3. 同一个邀请码只有一个有效 reservation；第二个并发请求必须失败。
4. 用户答题期间，每次保存答案把租约续到「当前时间 + 2 分钟」。
5. 设置总持有上限，例如 10 分钟，避免邀请码被无限占用。
6. 邮箱提交时，在一个事务内保存答案并完成 `reserved → claimed_pending_verification`；验证码阶段不再依赖短租约。
7. 页面关闭或租约过期后自动释放为 `unused`。
8. 邮箱提交瞬间若租约刚过期，保留本地答案，先尝试重新获取原码；失败时只换邀请码，不要求重答。
9. 多标签页只有持有 reservation token 的会话可以消费邀请码。
10. 同一邮箱重复提交必须幂等恢复已有记录。

前端不显示持续倒数，只显示：

> Your invite is reserved for this session.

## 6. 分享链接与状态契约

生产分享 URL 需要把公开结果和一次性邀请码分开：

```text
/waitlist?result={immutable_result_id}&invite={one_time_invite}
```

当前纯前端原型暂用人格代码代替 `result_id`：

```text
/waitlist?result=CND&invite=SMARTX-CND-7X2K
```

上线要求：

- 每次完成测试生成不可变 `result_id`。
- 分享页根据 `result_id` 恢复人格、文案版本和 OG 图。
- 重测生成新结果，不覆盖旧分享链接。
- 邀请码一次性消费；普通传播 `ref` 不消耗邀请码。
- 分享奖励、邀请兑换和排名变化全部幂等。
- X intent 只证明分享窗口成功打开，不能证明帖子实际发布。

必须持久化的状态：

- `quiz_in_progress / quiz_completed`
- `reservation: active / expired / converted`
- `invite: unused / reserved / claimed_pending_verification / claimed / expired`
- `email: pending_verification / verified`
- `rank: pending / active`
- `community_clicked / x_follow_clicked`
- `share_reward: none / pending / applied`

## 7. 九种交易人格

当前对照关系保持不变：

| 原结果 | 兼容旧代码 | 公开代码 | 中文人格 | 英文人格 | 三维组合 |
| --- | --- | --- | --- | --- | --- |
| Degen Ape | APE | LQD | 送钱者 | **The Liquidity Donor** | DEGEN · GUT · PACK |
| Moon Wolf | WOLF | AIM | 梭哈仙人 | **The All-In Mystic** | DEGEN · GUT · LONE |
| Echo Parrot | PARROT | SIG | 喊单军师 | **The Signal General** | DEGEN · DATA · PACK |
| Chart Fox | FOX | CND | K线教主 | **The Candle Prophet** | DEGEN · DATA · LONE |
| Diamond Turtle | TURTLE | DIP | 抄底带头大哥 | **The Dip Ringleader** | SNIPER · GUT · PACK |
| Hibernating Bear | BEAR | DOC | 行情老中医 | **The Market Doctor** | SNIPER · GUT · LONE |
| Whale Whisperer | WHALE | CHN | 链上侦探 | **The Onchain Detective** | SNIPER · DATA · PACK |
| Shadow Cat | CAT | LMT | 潜伏狙击手 | **The Limit Sniper** | SNIPER · DATA · LONE |
| The Owl | OWL | RSK | 风控大师 | **The Risk Monk** | 隐藏签名规则暂不变 |

### 7.1 The Liquidity Donor / 送钱者

> You chase heat, trust the vibe, and usually bring the group chat with you. Wherever the market needs liquidity, your wallet arrives first.

Roast: `You’re not trading. You’re funding the ecosystem.`

### 7.2 The All-In Mystic / 梭哈仙人

> You do not need a poll or a spreadsheet. You have a feeling—and right before every all-in, it feels like enlightenment.

Roast: `Every all-in starts with enlightenment and ends with reincarnation.`

### 7.3 The Signal General / 喊单军师

> Charts checked. Wallets tracked. Three hours of analysis later, the strategy still comes down to two words: send it. Naturally, everyone must hear about it.

Roast: `Three hours of research. Two-word thesis: send it.`

### 7.4 The Candle Prophet / K线教主

> You trust candles, structure, and support levels more than people. Your system explains almost everything—except, occasionally, your position size.

Roast: `You can chart every line except the one marking enough exposure.`

### 7.5 The Dip Ringleader / 抄底带头大哥

> You do not chase; you wait for the pullback. Once your gut calls the bottom, the whole group chat gets recruited to buy it with you.

Roast: `You’re not buying the dip. You’re giving the downtrend a demo.`

### 7.6 The Market Doctor / 行情老中医

> You do not rush and you do not need the crowd. Other traders read indicators; you take the market’s pulse and decide whether its complexion looks healthy.

Roast: `Every symptom diagnosed. Every loss professionally explained.`

### 7.7 The Onchain Detective / 链上侦探

> Charts, flows, smart wallets—you inspect everything. You know who moved, what they bought, and where the money went before the group chat asks.

Roast: `You know everyone’s position except, occasionally, your own.`

### 7.8 The Limit Sniper / 潜伏狙击手

> The thesis is ready and the entry is precise. You will wait as long as it takes—even when the market has no intention of coming back for you.

Roast: `The limit order was perfect. Shame you two never met again.`

### 7.9 The Risk Monk / 风控大师

> Low leverage. Clean exits. Profits taken without ceremony. While everyone hunts the next 10×, you make sure there is a next trade.

Roast: `They study how to double once. You study how to stay in the game.`

## 8. 人格命名与翻译原则

英文不是逐字翻译，而是需要同时满足：

1. 不看中文也能大致猜出行为特征。
2. 是英语交易社群会自然使用的词，不像机器直译。
3. 有自嘲感，但不能让用户觉得结果在单纯羞辱自己。
4. 名称适合放在图片上，长度尽量控制在 2–4 个词。
5. 结果解释先描述真实行为，再给一句 roast；不能只剩梗。

上线前建议用 10–15 名中英文目标用户做命名快测：可理解度、接受度、复述率和分享意愿。

## 9. 视觉与资产规则

### 9.1 当前可执行部分

Waitlist 与官网保持同一品牌家族，但不复制官网长页面的章节动效：

- 使用官网 navy / teal / warm-white 色系。
- 阅读文本使用 Inter，数据和邀请码使用 JetBrains Mono。
- 低圆角或无圆角、1px 边线、teal 4px 强调边。
- 一屏一个任务；答题页只保留题目、选项、返回和低存在感进度。
- 动效只用于页面进入、答题推进、排名变化和邀请卡切换。
- 支持 `prefers-reduced-motion`。

### 9.2 暂不冻结部分

- 人格插图不再默认采用 Owl、像素、塔罗、3D 或任何具体媒介。
- 题目和结果统一使用 1:1 母版槽位；最终资产从母版裁切 1080×1920 与 1200×630。
- 占位图必须明确是 `Artwork direction TBD`，不能伪装为最终资产。
- 官网视觉更新后，再决定 waitlist 是共用品牌主资产、单独人格系列，还是二者的混合。

### 9.3 旧资产

原塔罗题目图、动物结果图和星图背景归档到：

```text
archive/waitlist-tarot-v1/
```

当前页面和分享卡不得继续引用该目录。

## 10. 题目与结果一致性

本轮按产品决策不重新审查答案到人格的映射，因此原型继续沿用当前三维组合和隐藏人格规则。

但上线前仍需单独完成一次计分审计，至少验证：

1. 每道题确实影响它声称测量的维度。
2. 结果解释与最终三维组合不矛盾。
3. 隐藏人格不会覆盖与其文案相反的行为，例如明显 degen 的答案得到“极度冷静”的结果。
4. 页面不展示无法从真实样本推导的稀有度百分比。
5. 问题、答案、计分、人格和文案都带版本号，前后端使用同一映射。

当前原型已经移除伪造的 `Rarer than X%` 和独立属性条，避免在算法未确认时继续制造额外矛盾。

## 11. SmartX 产品承接

测试结果不能永远停留在娱乐标签。后续生产结果页应补一段简短但具体的个性化说明，例如：

> Your answers seed your first SmartX feed. We will start with fewer, evidence-heavy alerts and explicit invalidation levels. Your feed will adapt as you use SmartX.

三条维度可以作为冷启动先验：

| 维度 | 可影响的初始产品行为 |
| --- | --- |
| Degen / Sniper | 提醒紧迫度、信号阈值、风险提示强度、候选数量 |
| Gut / Data | 先展示叙事与动量，还是数据、钱包、历史证据与 invalidation |
| Pack / Lone | 社区共识和 Smart Money 权重，或更私密简洁的工作流 |

必须明确：人格只是初始偏好，不是永久定型；SmartX 会根据真实使用继续调整。

## 12. 原型与生产边界

当前原型允许：

- 测试邀请码 `123456`。
- 测试验证码 `824193`。
- 浏览器内模拟排名、分享奖励、社群点击和邀请卡切换。
- 用人格代码模拟公开 `result_id`。

生产环境必须补齐：

- 服务端邀请码 reservation 和消费。
- 邮箱发送、Double opt-in、状态恢复和跨设备继续。
- 结果、排名、邀请码、奖励与事件持久化。
- 反作弊、geoblock、隐私披露、退订与删除流程。
- 1200×630 动态 OG 图和稳定的分享抓取。
- 漏斗埋点：Landing 类型、邀请码验证、每题完成、邮箱提交、验证、结果、社群、分享、邀请兑换。

## 13. 本轮验收清单

- [x] 直接 Landing 使用新的简洁落地语。
- [x] 分享链接能进入“朋友结果卡”第二 Landing。
- [x] 分享 URL 同时包含人格和邀请码。
- [x] 答题页移除顶部三阶段导航和维度文案。
- [x] 题目、选项间距和 1:1 图片槽固定。
- [x] 邮箱页面删除冗余说明清单。
- [x] 结果页改为左侧人格海报、右侧排名和动作。
- [x] 下载入口位于左侧海报底部。
- [x] Telegram / X 位于最后且不阻塞结果或排名。
- [x] 九种公开人格使用新的中英文名和解释。
- [x] 当前图片只占位，视觉方向标记为 TBD。
- [ ] 服务端锁、邮件、真实排名和动态 OG 图接入。
- [ ] 九种英文名完成目标用户快测。
- [ ] 题目与人格映射完成独立计分审计。
