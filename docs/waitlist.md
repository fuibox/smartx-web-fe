# SmartX Waitlist · 产品与人格测试决策记录

> 状态：Working draft，供产品/老板确认；未确认的命名不视为冻结
>
> 更新：2026-08-21
>
> 范围：`/waitlist` 的产品意图、测试模型、结果体系、传播闭环与视觉方向。官网 V4 仍以 `docs/website-v4.md` 为唯一权威，本文件不改写 V4。

## 1. 原始方案索引与使用顺序

1. 老板原始方案：[Google Doc · SmartX Waitlist / Trading Spirit Animal](https://docs.google.com/document/d/1WMWelasjt_FaDw1Eq6RyEfoFiATGIotFVrykRmhdQZg/edit?tab=t.0#heading=h.mmfzw89y7pj2)
2. 产品优化说明：[Lark Wiki · Waitlist](https://wjpvbd3lg9kg.jp.larksuite.com/wiki/D6mGwhuBBiGzEtkS0pOjgEQKpmh)
3. 运营新版提案：[Google Doc · SmartX Waitlist 方案修改汇总](https://docs.google.com/document/d/1WTJraroBjYy4XgoXqjVePK7k0EmfM8TB/edit)，包括九种自嘲人格、Landing hook 与两组视觉参考。
4. 讨论截图：只作为命名方向和老板反馈的决策证据，不作为独立需求来源。
5. 本文件：对上述来源、当前实现和 2026-08-20 至 2026-08-21 讨论的综合建议。后续确认的决策继续写回本文件。

冲突处理原则：Google Doc 保留原始产品意图；Lark 负责补充和优化实现细节；若两者与最新明确讨论冲突，以最新确认结论为准，并在本文件留下变更原因。

## 2. Waitlist 必须完整表达的产品意图

Waitlist 不是一个独立的趣味测试。它同时完成四件事：

1. 获取经过邮箱确认的有效早期用户。
2. 用短测试降低进入门槛，并为用户提供值得分享的身份结果。
3. 用分享、一次性邀请码和队列前进形成传播循环。
4. 把答案作为 SmartX 个性化推荐的冷启动输入，并向用户解释「这个结果会怎样改变我的 SmartX」。

因此，任何版本都必须能串起下面的因果链：

```text
我的行为偏好
  → 可解释的三条维度
  → 与维度一致的类型和结果文案
  → SmartX 首次推荐/提醒方式的差异
  → 可分享的结果卡与邀请传播
```

如果结果只好玩、但无法解释产品如何使用这些答案，测试就没有完整表达 SmartX 的产品意图。

## 3. 当前原型的结论

当前 `/waitlist` 已按 2026-08-20 的最新流程决策调整为：邀请码验证、直接完成 6 道题、邮箱绑定与验证码、结果和排名、最后完成社群/X 任务，再分享结果和解锁邀请码。

它适合内部演示，但不能作为生产逻辑直接上线。主要差距如下：

| 优先级 | 当前问题 | 影响 | 建议 |
| --- | --- | --- | --- |
| P0 | 严格 invite-only 尚未接服务端原子锁 | 纯前端无法防止同一码被两个人同时占用 | 按 8.1 的 reservation lease 实现；只有服务端返回 reservation token 才能开始测试 |
| P0 | 邮箱和验证码仍为浏览器模拟 | 无法真正保存答案、激活排名或恢复流程 | 答题后绑定邮箱并持久化结果；Double opt-in 完成后才激活排名 |
| P0 | 排名、验证码、邀请码、分享奖励都只在浏览器内模拟 | 刷新丢失，可重复获奖，无法防刷 | 服务端持久化、幂等、原子兑换和状态恢复 |
| P0 | 分享 URL 没有 `result_id` 和用户 `ref` | 分享出去的 OG 预览不能还原该用户结果，丢失最关键传播细节 | 每次结果生成不可变 `result_id`；分享页按 `result_id` 返回 1200×630 OG 图 |
| P0 | 题目、计分和结果存在结构性矛盾 | 用户可能得到与答案相反的角色，失去信任 | 按第 4–6 节重做计分和类型映射 |
| P1 | 结果只保留一句判词、搭档和天敌 | 缺少共鸣、背景、优点、盲点和产品解释 | 使用 MBTI-like 结果结构，见第 7 节 |
| P1 | 没有明确告诉用户答案会用于个性化 | 冷启动数据采集显得像隐藏目的 | 邮箱附近简短披露，结果页展示具体的 SmartX 个性化预览 |
| P1 | 当前是塔罗、星图、金色、仪式化语言 | 与 V5 的消费级、机构感、Robinhood/Apple 克制方向冲突 | 使用 V5 的纸面/夜航双色、Plex Sans、单一 teal 强调和真实/语义资产 |
| P1 | 无跨设备恢复、埋点、geoblock、反作弊和退订/删除流程 | 漏斗不可诊断，合规与运营不可控 | 按 Lark v1.1 的数据模型和验收要求补齐 |

## 4. 现有计分为何不成立

### 4.1 三道题实际上不影响基础类型

当前每条维度只有两题；当两题一比一平局时，用编号更大的题决定。结果是：

- Risk 最终只由 Q5 决定，Q2 对基础类型无影响。
- Signal 最终只由 Q4 决定，Q1 对基础类型无影响。
- Social 最终只由 Q6 决定，Q3 对基础类型无影响。

也就是说，6 道题中有 3 道只影响属性条和隐藏 Owl，不影响八种基础类型。这不是可靠的双题测量。

### 4.2 隐藏 Owl 会覆盖成相反人格

Owl 当前规则是签名答案命中至少 4/6 就强制覆盖。遍历全部 `4^6 = 4,096` 种答案后：

- 154 种答案会得到 Owl，占 3.76%。
- 其中只有 70 种的基础三维确实是 `SNIPER · DATA · LONE`。
- 84 种，也就是 54.5% 的 Owl 答案，至少有一条基础维度不符合「冷静、数据、独行」叙事。
- Owl 可以覆盖 8 种基础类型中的 7 种，甚至可以覆盖 `DEGEN · GUT · LONE`。

例如 `Q1=D · Q2=D · Q3=B · Q4=C · Q5=C · Q6=B` 命中四个签名答案，但 Q4 是 GUT、Q5 是 DEGEN，仍会得到「Calm while everyone panics」的 Owl。这正是「跟 degen 的人不应被定位成冷静图腾」的问题。

### 4.3 三条属性与类型没有同一测量基础

`Conviction / Instinct / Resilience` 是在同一组选项上任意附加的分值，却不对应三条类型维度：

- DATA 选项会增加 `Instinct`。
- Social 选项会同时增加风险意味很强的 `Conviction`。
- 「睡觉」「不分享」「使用现货」会被混合解释为 `Resilience`。

因此，属性条可能与类型文案互相打架。6 道题不足以同时可靠测量三条类型维度和另外三条独立属性；v1 应只显示从同一计分直接得到的三条维度。

### 4.4 当前稀有度不是算法产生的分布

在随机答案模型下，扣除 Owl 覆盖后，八种基础类型各占约 10.79%–12.50%，并不是页面写的 5%–17%。「Owl 随机命中约 4%」也不能推导成「比 96% 的交易者更稀有」。

上线建议：

- 有足够真实、去重、已验证样本前，不展示 `Rarer than X% of traders`。
- 达到约定样本阈值后，只展示真实 cohort 分布，并标注样本口径和版本。
- 娱乐性的 rare badge 可以存在，但不能伪装成人群统计。

## 5. 推荐测试模型：三条轴、八种类型、六道题

不直接复制 MBTI，也不借用 Harry Potter/Marvel 角色。借用的是用户已经理解的产品语法：

- 稳定的字母型代码；
- 每条轴有清晰的两极；
- 每个类型有一个容易记住的公共语言角色名；
- 结果包含优势、盲点、压力状态和适配建议；
- 用户能拿自己的代码与朋友比较。

### 5.1 三条维度

| 维度 | 正向极 | 反向极 | 只测量什么 | 不混入什么 |
| --- | --- | --- | --- | --- |
| Pace | **B**old 果断 | **M**easured 克制 | 进入速度、仓位姿态、错失容忍 | 数据来源、是否听群友 |
| Lens | **I**nstinct 直觉 | **E**vidence 证据 | 形成判断时依赖模式感还是可验证证据 | 风险大小、是否社交 |
| Network | **C**onnected 共创 | **S**olo 独立 | 观点形成和复盘时是否依赖他人交流 | 是否加仓、是否止损 |

公共展示格式示例：`B · E · S — The Operator`。后台字段可以保留 `pace_pole / lens_pole / network_pole`，不要再使用含义重复的两个 `D`。

### 5.2 无平局计分

每条轴保留两题：一题测身份倾向，一题测压力下行为。

- 身份题四个选项依次记 `+3 / +1 / -1 / -3`。
- 场景题两项属于正向极、两项属于反向极，依次记 `+2 / +2 / -2 / -2`。
- 每条轴总分只可能是 `-5 / -3 / -1 / +1 / +3 / +5`，不会出现 0。
- 正数判定正向极，负数判定反向极；绝对值 1/3/5 分别表示 Lean / Clear / Strong。

这样两道题都会影响结果，也不需要用「后一道题覆盖前一道题」的隐藏规则。

所有结果必须保存：`quiz_version`、原始答案、三轴原始分、三轴极、类型代码和文案版本。前后端使用同一套版本化映射，服务端为最终权威。

## 6. 六道题 v2 草案

文案目标：场景具体、四个答案都像真实选择、没有明显的“正确答案”，且每题只测一条轴。英文上线稿需要再做母语校对和小样本访谈。

### Q1 · Lens identity（I ↔ E）

**What makes a trade idea feel real?**

| 选项 | 文案 | 分数 |
| --- | --- | --- |
| A | I can feel the market's rhythm before I can explain it. | I +3 |
| B | A pattern I have seen before suddenly clicks. | I +1 |
| C | Two independent signals point the same way. | E -1 |
| D | The data gives me a clear entry and invalidation. | E -3 |

### Q2 · Pace scenario（B ↔ M）

**A market runs 35% before you enter. What next?**

| 选项 | 文案 | 分数 |
| --- | --- | --- |
| A | Enter now. Missing the move hurts more than being early. | B +2 |
| B | Start small before the window closes. | B +2 |
| C | Mark my price and wait for the pullback. | M -2 |
| D | Let it go. Another clean setup will come. | M -2 |

### Q3 · Network identity（C ↔ S）

**When a thesis is still forming, what improves it most?**

| 选项 | 文案 | 分数 |
| --- | --- | --- |
| A | An open debate with people who see the market differently. | C +3 |
| B | A small circle whose judgment I trust. | C +1 |
| C | I listen first, then decide after a private review. | S -1 |
| D | Working it out alone, before anyone can frame it for me. | S -3 |

### Q4 · Lens scenario（I ↔ E）

**Two signals conflict right before entry. Which one wins?**

| 选项 | 文案 | 分数 |
| --- | --- | --- |
| A | My first read. It usually noticed the change first. | I +2 |
| B | The live market. I decide from how it feels now. | I +2 |
| C | The signal with the stronger historical record. | E -2 |
| D | Neither, until a measurable confirmation appears. | E -2 |

### Q5 · Pace identity（B ↔ M）

**On a high-conviction setup, your normal position plan is:**

| 选项 | 文案 | 分数 |
| --- | --- | --- |
| A | Exceptional setups deserve exceptional size. | B +3 |
| B | Start meaningful, then add quickly if the thesis holds. | B +1 |
| C | Stage entries inside a fixed risk cap. | M -1 |
| D | Keep one trade small enough that it never changes the plan. | M -3 |

### Q6 · Network scenario（C ↔ S）

**A trade breaks your thesis. Where does the first review happen?**

| 选项 | 文案 | 分数 |
| --- | --- | --- |
| A | With the group that saw the setup with me. | C +2 |
| B | With one trusted trader, comparing notes. | C +2 |
| C | In my own journal, before I discuss it. | S -2 |
| D | Privately. I do not share live positions. | S -2 |

## 7. 推荐结果体系：8 Market Types

这一体系不是新的动物 IP，也不是对影视角色的借用。它采用类似 16Personalities 的「类型代码 + 公共语言角色」结构：角色词本身全球用户能理解，SmartX 只需要经营统一的视觉表达和文案，而不需要先教育一套神兽宇宙。

| 代码 | 英文名 | 中文工作名 | 维度逻辑 | 一句话背景 | 建议图腾/徽记 |
| --- | --- | --- | --- | --- | --- |
| BIC | The Firestarter | 点火者 | 果断·直觉·共创 | 最早感到气氛变化，也最先把全场点燃 | 火花与上升弧线 |
| BIS | The Maverick | 独行客 | 果断·直觉·独立 | 在共识形成前下注，只相信自己的读法 | 偏离主路的罗盘 |
| BEC | The Captain | 领航者 | 果断·证据·共创 | 把分散信号变成明确方向，并带人行动 | 罗盘与信号网格 |
| BES | The Operator | 操盘手 | 果断·证据·独立 | 等证据成形后直接执行，不需要观众 | 控制台与切入线 |
| MIC | The Anchor | 定盘者 | 克制·直觉·共创 | 能感到情绪变化，也能让团队不被波动带走 | 锚点与稳定基线 |
| MIS | The Contrarian | 逆行者 | 克制·直觉·独立 | 安静等待直觉成熟，舒服地站在共识对面 | 逆向箭头与负空间 |
| MEC | The Scout | 侦察手 | 克制·证据·共创 | 先看清地形和信号，再把路径带回团队 | 雷达与等高线 |
| MES | The Sniper | 狙击手 | 克制·证据·独立 | 过滤噪音，等待一个能解释也能执行的时刻 | 光圈与精确落点 |

这些名称是推荐候选，不应仅凭内部偏好冻结。上线前用 10–15 名中英文目标用户做一次命名快测，至少验证：

1. 不看解释能否猜到角色大意。
2. 得到该结果是否愿意接受，而不是感到被羞辱。
3. 能否复述自己的代码和名称。
4. 是否愿意发给朋友比较。
5. 中英文是否同样自然，图形是否容易做得好看。

### 7.1 结果页固定内容结构

每个类型都使用相同模板，避免只给一个动物名：

1. 类型代码 + 角色名 + 一句身份判断。
2. 三条轴的分段位置和 Lean/Clear/Strong。
3. 两个 Strengths。
4. 一个 Blind spot；语气机智，但不羞辱用户。
5. `Under pressure`：解释极端行情下可能发生什么。
6. `How SmartX adapts`：明确告诉用户推荐、提醒和证据呈现会怎样变化。
7. `Works well with / Challenges`：保留原方案的搭档与张力，但不写成收益承诺。
8. 分享卡、排名状态和邀请码。

示例：

```text
B · E · S — The Operator
You wait for proof, then move without an audience.

Strengths        decisive execution · evidence discipline
Blind spot       a clean dashboard can still hide a bad premise
Under pressure   you narrow the frame and act faster
SmartX adapts    fewer alerts, stronger confirmation, explicit invalidation
```

### 7.2 Owl 的新位置

Owl 不再覆盖人格类型，也不再作为第九种“最优秀人格”。推荐两种用法：

- 首选：Owl 是贯穿测试的 SmartX guide 和品牌签名，不参与计分。
- 可选：Owl 成为叠加在基础类型上的 `Night Owl` easter-egg badge，只表达特定行为，不改变三轴和角色名。

如果保留 badge，触发条件必须与 badge 文案同义，并单独展示为「badge」，不能再把一个 BIC/MIS 用户强制改写成冷静的数据型 Owl。邀请码权益也不应依赖一个可被猜题刷出的“优等人格”；若要奖励稀有 badge，需单独做防刷和公平性确认。

### 7.3 运营自嘲版评审（2026-08-21）

运营稿把九种结果改成「送钱者、梭哈仙人、喊单军师、K 线教主、抄底带头大哥、行情老中医、链上侦探、潜伏狙击手、风控大师」。它比原动物名更容易一眼理解，且大部分解释能对应现有 `Risk / Signal / Social` 组合；但不建议直接冻结，原因如下：

1. 九个名称混合了神话、江湖、职业和网络梗，还不是一个像 Hogwarts House 那样可被复述的共同体系。
2. 两组视觉参考都以同一只品牌猫头鹰/猫形角色换道具，品牌一致，但类型辨识和用户投射较弱，也与最新「别都用 Owl」的反馈冲突。
3. 「送钱者、梭完就圆寂、样样亏得明白」适合作为分享卡上的 roast line，不宜独自承担主身份；结果页仍需同时给出可认同的优势与行为解释。
4. `风控大师` 被设置为隐藏且明显更优的第九人格，会重新制造“猜正确答案”的激励，不应覆盖基础三轴类型。
5. `9 种交易人格，你是最特别的哪一种？` 信息完整但偏泛。更精炼的工作稿是：`6 questions. Your trading type.`；中文可用 `6 道题，测出你的交易人格。`。

可取的折中是：保留运营稿中已经验证过的交易梗和解释素材，但把它们归入一个统一的公共语义体系（例如同一套「交易江湖角色」），每种人格使用不同轮廓、道具和徽记；SmartX Owl 只作引导者或签名。视觉资产统一以 1:1 为母版，再裁出结果分享所需的 1200×630 与 1080×1920。

## 8. 目标用户流程

```text
Landing
  → 地区可用性检查
  → 验证一次性邀请码并原子保留名额
  → 6 道题（逐题保存，可返回，可恢复）
  → 绑定邮箱，保存答案并正式消费邀请码
  → Double opt-in
  → 结果 + 激活后的排名 + SmartX 个性化预览
  → Join Community + Follow X（不阻塞测试、结果或排名）
  → Share to X（result_id + ref + 专属 OG 图）
  → 分享奖励 pending/applied
  → 解锁一次性邀请码
  → 好友提交邮箱并完成 Double opt-in
  → 邀请奖励原子结算，排名更新
```

### 8.1 邀请码保留与绑定

不能把「前端验证成功」当成锁定。生产实现应使用短租约，而不是一个从进入页面开始、无条件倒数的 2 分钟计时器：

1. `POST /invite/reserve` 以原子 compare-and-set 将 `unused → reserved`，并返回不可猜的 `reservation_token` 与 `expires_at = now + 2 min`；同一邀请码的第二个请求必须失败。
2. 用户答题时，每次保存答案都把租约续到「当前时间 + 2 分钟」，但设置合理的总上限，例如 10 分钟，避免长期占码。页面上只显示「Invite reserved for this session」，不持续制造倒计时焦虑。
3. 邮箱提交时带上 `reservation_token`，在同一事务中完成 `reserved → claimed_pending_verification`、保存答案和创建 waitlist 记录。验证码阶段不再占用短租约。
4. 页面关闭、长时间无操作或达到总上限后，租约自动过期并回到 `unused`。
5. 如果用户在提交邮箱时租约刚好过期，保留本地答案，优先尝试重新获取原码；失败时只要求换码，不要求重答。
6. 多标签页只有持有 reservation token 的会话能绑定；同一邮箱重复提交必须幂等恢复已有记录，不能重复消费邀请码。

### 8.2 必须定义的状态

- `pending_verification / verified`
- `invite: unused / reserved / claimed_pending_verification / claimed / expired`
- `reservation: active / expired / converted`
- `community_clicked / x_follow_clicked / social_setup_completed`
- `quiz_in_progress / quiz_completed`
- `share_reward: none / pending / applied`
- `invite_code: unused / pending_redemption / redeemed / expired`
- `rank: pending / active`

邀请码在邮箱绑定时正式消费；邮箱确认后激活排名。确认链接打开后必须恢复到用户的结果，不要求重做测试或社交点击。

### 8.3 分享闭环的硬要求

- 结果生成不可变 `result_id`；重测产生新结果，但不重复发奖励。
- 分享 URL 同时带 `result_id` 和 `ref`。
- 1200×630 OG 图由服务端按 `result_id` 返回；X intent 只负责文案和 URL。
- 分享按钮只验证 intent 成功打开，字段不得与测试前的 Follow X 混用。
- 分享奖励、发码、兑换和排名更新全部幂等。
- 邀请码是一次性稀缺名额；普通传播 `ref` 不消耗邀请码，也不直接触发 +500。

## 9. SmartX 个性化承接

结果页必须把测试和产品连接起来。三条轴只能作为冷启动先验，不应被描述为永久人格：

| 维度 | 可影响的初始产品行为 |
| --- | --- |
| Bold / Measured | 提醒紧迫度、信号阈值、风险提示强度、候选市场数量 |
| Instinct / Evidence | 推荐卡先展示市场叙事/动量，还是数据、钱包、历史证据和 invalidation |
| Connected / Solo | 社区共识、Smart Money、可分享 watchlist 的权重，或更私密简洁的工作流 |

结果页使用具体文案，例如：

> Your answers seed your first SmartX feed. We will start with fewer, evidence-heavy alerts and explicit invalidation levels. Your feed will adapt as you use SmartX.

同时提供隐私说明入口，明确答案用于个性化和产品分析；不要用模糊的「AI 正在学习你」替代数据用途说明。

## 10. 视觉方向

Waitlist 跟随 V5 的消费级机构感，不继续当前塔罗网页方向：

- 画布以暖白 `#F5F2EC` 为主，少量品牌夜航 `#0A1020`；teal 只用于 CTA、进度和结果关键强调。
- IBM Plex Sans 承担标题和正文；不使用占星式 serif、金色边框和神秘学装饰。
- 一屏一个任务，一个视觉主角；发丝线和留白建立层级，不用等权卡片墙。
- 图腾改为统一系统的雕塑化徽记或编辑静物，每个类型一个明确符号；详细资产未定时使用标注清楚的占位槽。
- 题目选项中的视觉槽固定为 1:1 母版比例，使当前塔罗图只是临时裁切，不反向限制后续角色/IP 资产。
- 结果卡优先用大字类型代码、角色名、单一徽记和三条维度；确保 1200×630 与 1080×1920 都成立。
- 运动只用于进度推进、结果揭晓、排名 old → new；阅读期间基本静止，并提供 reduced-motion 降级。
- 不伪造实时人数、排名、稀有度或产品 UI。

## 11. 上线前仍需确认

- [x] 首发严格 invite-only；邀请码是进入测试的硬门槛。
- [ ] 八个角色名是否通过中英文目标用户快测。
- [ ] Owl 仅作 guide，还是增加不覆盖人格的 badge。
- [ ] 分享奖励与邀请码数量是否继续采用普通 5 / Owl 10；若 Owl 不再是人格，权益如何分配。
- [ ] 分享后 +500 与每个有效邀请 +500 的排名算法、并发和最低名次处理。
- [ ] 社群/X 最终 URL、首发语言、geoblock 名单和 Double opt-in 服务商。
- [ ] 真实 cohort 达到多少已验证样本后展示类型分布；阈值前不显示百分位。
- [ ] Waitlist 用户和测试数据怎样迁移到正式 SmartX 账户与 Memory Layer。
- [ ] 营销邮件同意、隐私请求、数据删除和活动结束后的邀请码/排名处置。

## 12. 建议实施顺序

1. 先确认三条轴、计分方式、八个名称和 Owl 定位。
2. 用固定测试向量为 8 种类型和边界分数写单元测试，再改 UI。
3. 改结果内容结构和 SmartX 个性化承接。
4. 把 invite、邮箱确认、分享、`result_id`、OG、排名和邀请码接到服务端状态机。
5. 最后按 V5 方向重排视觉和结果卡；详细图腾资产可在版式确认后补齐。
6. 用 1440×900 桌面、移动端、reduced-motion、刷新恢复和分享预览做完整验收。
