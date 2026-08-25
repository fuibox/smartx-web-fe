# SmartX Waitlist PRD

> 状态：活动流程和首版产品规则待确认。题目加点、人格中英文文案和关系配置保留调整空间；人格插画方向已确定为拟人化 SmartX Owl 交易梗插画。

## 1. 活动是什么

Waitlist 是用户从官网进入 SmartX 的第一段轻量产品体验，不是独立的娱乐测试站。

活动要完成四件事：

1. 用六道真实交易场景题，让用户获得一个容易理解和分享的交易人格。
2. 通过 invite-only 控制首发规模和传播链路。
3. 获取经过验证的邮箱，形成真实 waitlist。
4. 用结果分享、排名和一次性邀请形成传播闭环。

完整玩法只有一条主线：

~~~text
邀请码进入 → 完成六道题 → 验证邮箱
→ 完成 Telegram 和 X 社群动作 → 揭示结果、排名和邀请码
→ 可选分享 → 排名优先值提升
→ 好友完成邮箱验证 → 邀请人排名再次提升
~~~

活动遵循以下原则：

- 一屏只完成一个主要任务。
- 邮箱和社群动作不前置到答题前。
- 结果先让用户觉得“像我”，再让用户觉得“好笑”。
- 题目结果只表达交易偏好，不包装成心理诊断或真实交易能力。
- 排名、奖励和邀请码数量必须真实，不展示随机或虚构数据。

## 2. 用户怎么玩

### 2.1 从邀请码进入

~~~text
输入邀请码
→ 完成六道题
→ 输入邮箱并完成验证码验证
→ Join Telegram 并 Follow SmartX on X
→ 查看人格、三项属性、搭档、天敌、waitlist 排名和 5 或 10 个邀请码
→ 可选分享并获得排名奖励
~~~

没有有效邀请码，不能开始答题。六道题完成后才要求邮箱；邮箱验证成功代表正式加入 waitlist。

### 2.2 从朋友分享进入

进入后先展示朋友的真实结果，再邀请访问者测试。

~~~text
朋友的人格海报与三项属性
→ Best Match / Natural Rival
→ Find my trader type
→ 使用朋友分享的邀请码开始答题
~~~

- 查看朋友结果不会占用邀请码。
- 邀请码有效时，点击按钮后直接开始答题。
- 邀请码无效、已使用或过期时，朋友结果仍然可见，访问者可以输入其他邀请码。
- 用户可以只分享结果，也可以在结果链接中附带一个邀请码。

### 2.3 从答题到结果

- 每屏一道题、一张主图、四条纵向选项。
- 只显示低存在感的返回按钮和六个进度点。
- 选择答案后进入下一题；返回时可以覆盖上一题答案。
- 邮箱验证后进入社群解锁页。
- Telegram 和 X 两项都完成后，才揭示完整结果和排名。
- 当前以点击并打开对应渠道作为完成，不校验是否真的入群或关注。

## 3. 核心规则

### 3.1 准入、邮箱与唯一结果

- 邀请码验证成功后，为当前答题保留 2 分钟。
- 用户持续答题时自动延长，答题阶段最长保留 10 分钟。
- 用户提交邮箱后，邀请码保留到当前验证码过期。
- 邀请码中途失效时保留已经完成的答案，用户更换邀请码后继续，不要求重答。
- 验证码为 6 位数字，10 分钟有效，60 秒后可以重新发送。
- 同一个验证码最多尝试 5 次；新验证码发出后，旧验证码失效。
- 同一邮箱只能完成一次测试。结果生成后不允许重测；再次验证该邮箱时直接返回原结果。

### 3.2 结果如何生成

六个答案同时产生两层结果：

1. 三个判型维度共同决定用户的人格。
2. 每个答案分别影响信仰、嗅觉和复原力。

#### 人格

六道题测量三个判型维度，每个维度由两道题决定。

| 判型维度 | 一端 | 另一端 | 表达的差异 |
| --- | --- | --- | --- |
| Risk posture | Sniper | Degen | 等待计划内机会，还是主动追逐高波动机会 |
| Decision basis | Gut | Data | 更依赖直觉与叙事，还是证据、图表与链上数据 |
| Trading mode | Lone | Pack | 独立判断，还是主动参考并影响群体 |

每个答案在对应维度上分为四档倾向：

~~~text
-2 / -1 / +1 / +2
~~~

两题相加后决定该维度更靠近哪一端。若分数恰好为 0，使用该维度第二道题的答案方向决定结果。三个维度的组合决定八种常规人格。

#### 信仰、嗅觉与复原力

这三项属性与人格分开计算，因此同一种人格也可以得到不同的属性结果。

| 属性 | 英文 | 表达的倾向 |
| --- | --- | --- |
| 信仰 | Conviction | 对自己判断的坚持和行动意愿 |
| 嗅觉 | Instinct | 发现机会、读取信号和判断时机的敏感度 |
| 复原力 | Resilience | 面对亏损、止损和波动时的应对倾向 |

每个选项都可以分别影响三项属性。某个答案没有真实反映某项属性时，该项不加也不减，不为了拉开数值强行加分。

~~~text
属性结果 = 30 + 六个答案对应的属性加点
最终结果限制在 5–99
~~~

附录 B 是后端首版配置，后续可以继续校准，但已经生成的结果不随配置变化。

#### 隐藏款 Risk Monk

用户在两道风险题中都选择最克制的答案，并且另外两个维度都没有走到最极端时，常规人格会被隐藏款 Risk Monk 覆盖。

- Risk Monk 生成结果时获得 10 个邀请码，其他人格获得 5 个。
- Risk Monk 的排名奖励与其他人格相同。
- 精确触发条件见附录 C。

### 3.3 结果如何揭示

- 邮箱验证成功后生成并保存结果，同时激活用户的真实 waitlist 排名。
- 结果生成后先进入社群解锁页；Telegram 和 X 两项都完成，才向用户展示结果和排名。
- 如果用户尚未完成两项社群动作，再次进入时回到社群解锁页；已经完成则直接返回原结果。
- 社群动作本身不增加排名或额外邀请码；完成结果揭示后按人格发放邀请码。

### 3.4 分享、邀请码与排名

- 用户完成结果揭示后立即获得邀请码，不以分享作为解锁条件。
- 普通人格获得 5 个邀请码，Risk Monk 获得 10 个。
- 用户第一次点击分享按钮并打开分享页面，即视为完成分享任务并增加 500 优先值。活动不校验用户是否实际发帖。
- 每位好友使用邀请码完成邮箱验证后，邀请人再增加 500 优先值。
- 重复分享、换渠道分享或下载结果卡，不会重复获得排名奖励或额外邀请码。
- 排名按用户获得的优先值和加入时间重新计算。
- 页面展示实际排名和实际变化，不承诺固定前进 500 名。
- 其他用户获得奖励后，当前排名可能发生变化。
- 不使用随机初始排名或虚构 waitlist 人数。

### 3.5 失败和特殊情况

- 邀请码无效、已使用、暂时被占用或已过期时，给出对应提示。
- 邀请码失效不会清空用户已经完成的答案。
- 好友分享的邀请码失效时，朋友的结果仍然可以查看。
- 好友没有完成邮箱验证，不产生邀请奖励。
- 已完成测试的邮箱再次进入时，始终返回原结果，不允许重测。

具体提示文案见附录 A。

## 4. 页面与内容要求

本节列出用户会直接看到的首版暂定文案，供运营集中审核。运营可以调整具体措辞，但页面顺序、按钮作用和奖励规则不随文案调整。题目和选项见附录 B，人格判词见附录 C，异常提示见附录 A，邮件见附录 F。

运营文案交付优先级：

1. P0：直接入口与好友分享入口的 Kicker、H1、Lede 和 CTA。
2. P0：人格中英文名和唯一一句自嘲判词。
3. P1：Best Match / Natural Rival 的关系解释，以及结果页排名、分享和邀请码说明。
4. P1：邮箱、验证码、社群动作、错误提示和邮件通知。

邀请码保留时间、奖励数值和系统状态不得被改写成营销承诺；例如“增加 500 优先值”不能写成“前进 500 名”。

### 4.1 入口页

入口分为两种状态：直接打开活动链接，以及从朋友分享链接进入。

#### 4.1.1 直接入口

用户直接打开活动链接时，没有预带朋友结果或邀请码，先看到活动介绍和邀请码输入框。

首版英文文案：

- Kicker：THE SMARTX TRADER TYPE TEST
- H1：How do you trade when it gets real?
- Lede：Six decisions reveal your risk, signal, and social instincts.
- 输入框：Invite code
- 主按钮：Begin
- 输入框下方：Strictly invite-only. Your code is reserved when the test begins.

#### 4.1.2 好友分享入口

用户从朋友分享链接进入时，先看到朋友的真实结果，再决定是否开始自己的测试。

- Kicker：A RESULT WAS SHARED WITH YOU
- H1：A friend trades like {persona_name}.
- Lede：Same type, different score—or something else entirely? Take the test to find yours.
- 主按钮：Find my trader type
- 次按钮：Use another invite

朋友的邀请码不可用时，朋友结果继续显示，并允许用户输入其他邀请码。

### 4.2 答题页

- 每屏展示一道题、一张主图和四个选项。
- 固定文案只有 `Back` 和 `Question {current} of 6`；题目与选项由附录 B 提供。
- 用户选择后进入下一题，返回时可以修改上一题答案。

### 4.3 邮箱与验证码

六道题完成后进入邮箱页，不提前打断答题。

#### 4.3.1 邮箱页

- Kicker：YOUR RESULT IS READY
- H1：Save your result.
- Lede：Bind an email to save your result and join the waitlist.
- 输入框：Email address
- 主按钮：Continue

#### 4.3.2 验证码页

- Kicker：CHECK YOUR INBOX
- H1：Enter the 6-digit code.
- Lede：We sent a verification code to {email}.
- 输入框：Verification code
- 主按钮：Continue
- 重发：Resend code
- 修改邮箱：Change email

### 4.4 社群解锁页

- Kicker：ONE LAST STEP
- H1：Unlock your result.
- Lede：Join the SmartX community and follow product updates before your trader type is revealed.
- 任务一：Join Telegram · Enter the SmartX community
- 任务二：Follow SmartX on X · Follow product updates
- 主按钮：Reveal my result
- 按钮下方：Both steps are required to continue.

### 4.5 结果页

结果页按以下顺序展示：

1. 人格名和三个判型标签。
2. 信仰、嗅觉、复原力。
3. 附录 C 中对应的唯一一句自嘲判词。
4. Best Match / Natural Rival。
5. 真实 waitlist 排名与奖励规则。
6. 分享结果操作。
7. 已经生成的一次性邀请码。
8. 结果卡下载。

桌面端采用左右两栏：左侧承载人格、插画、属性、判词、关系和下载；右侧在同一首屏内承载排名、奖励说明、分享操作和五张窄竖向邀请码卡。邀请码不追加为结果页下方的第二段内容。

固定文案：

- 排名标题：Waitlist rank
- 首次分享奖励：First result share · +500 priority
- 邀请奖励：Each verified friend · +500 priority
- 规则说明：Priority improves your score; rank updates against the live waitlist.
- 关系标签：Best match / Natural rival
- 分享按钮：Share result
- 下载结果卡：Download result

页面展示分享后的真实排名变化，不写成“前进 500 名”。结果链接需要恢复人格、三项属性、搭档和天敌；公开结果不显示邮箱、原始邀请码或其他身份信息。

### 4.6 邀请码与结果卡

邀请码区域暂定文案，需运营确认：

- 标题：Invite friends
- 说明：Each link can be claimed once.
- 已使用状态：Used

- 每屏横向展示 5 张竖向卡片。
- 邀请码在结果生成后立即出现，不要求用户先分享。
- 桌面端邀请码位于结果页右栏，不在页面下方另起一个区域。
- 普通人格只有一屏；Risk Monk 的 10 个邀请码分为两屏，通过前后箭头切换。
- 可用邀请码排在前面，已使用邀请码统一移动到列表末尾。
- 可用卡片不显示 `Available`，正常亮度即代表可用；整张卡片点击后复制邀请链接，并短暂显示 `Copied`。
- 邀请码短码只作为卡片底部的小型识别信息，不作为卡片视觉主角。
- 已使用卡片保留作为记录，但不能再次复制或发送。
- 结果页和结果卡复用附录 C 的同一句自嘲判词，不另配卡片解释或第二套文案。

结果卡的内容范围见附录 F；视觉边界见附录 G。

## 5. 数据观察与隐私

活动重点观察以下转化：

~~~text
进入活动 → 邀请码通过 → 开始答题 → 完成六题
→ 提交邮箱 → 邮箱验证 → 完成 Telegram 和 X
→ 查看结果与邀请码 → 复制邀请码或可选分享 → 好友完成验证
~~~

核心埋点及其“用人话说明监测什么”见附录 E。

- 邮箱提交前说明用途：保存结果、管理 waitlist、发送准入和邀请通知。
- 如果测试答案未来用于 SmartX 个性化，需要在收集时明确说明。
- 营销邮件订阅与 waitlist 必需通知分开。
- 提供退订、隐藏公开结果和删除数据的入口。
- 结果仅表达娱乐化交易偏好，不代表收益能力或投资建议。
- 地区限制沿用主产品当前规则。
- 对明显重复邮箱、异常请求和自我邀请进行基础防刷。

## 6. 上线验收

- [ ] 没有有效邀请码不能开始答题；邀请码中途失效时不清空已完成答案。
- [ ] 六题完成前不要求邮箱；同一邮箱只保留一个结果且不允许重测。
- [ ] 邮箱验证后必须完成 Telegram 和 X，未完成时不能查看结果和排名。
- [ ] 好友分享入口先展示朋友结果；邀请码失效不影响结果查看。
- [ ] 所有答案组合都能得到一种有效人格和三项有效属性。
- [ ] Risk Monk 只按隐藏规则产生，并获得 10 个邀请码；其他人格获得 5 个。
- [ ] 邀请码在结果生成后立即可用，不依赖分享；分享只影响排名优先值。
- [ ] 首次分享与好友完成验证分别增加 500 优先值，重复分享不重复奖励。
- [ ] 页面只展示真实排名和实际变化。
- [ ] 邀请码每屏展示 5 张竖卡，Risk Monk 可以切换两屏，已使用卡片统一后置。
- [ ] 公开结果不暴露邮箱、原始邀请码或其他身份信息。
- [ ] 用户可以隐藏公开结果、退订营销邮件和删除数据。

# 附录

附录保存后端首版需要的具体参数和内容配置。正文规则不变时，附录内容可以继续校准；已经生成的用户结果始终按生成时的配置展示。

## 附录 A：活动配置与异常提示

### A.1 活动参数

| 配置项 | 首版值 |
| --- | --- |
| 是否 invite-only | 是 |
| 是否允许重测 | 否 |
| 题目数量 | 6 |
| 选项数量 | 每题 4 个 |
| 是否打乱题目 | 否 |
| 是否打乱选项 | 是 |
| 属性基础分 | 30 |
| 属性最低分 | 5 |
| 属性最高分 | 99 |
| 邀请码初始保留 | 2 分钟 |
| 答题阶段最长保留 | 10 分钟 |
| 验证码有效期 | 10 分钟 |
| 验证码重发等待 | 60 秒 |
| 单个验证码最多尝试 | 5 次 |
| 普通人格邀请码 | 5 个 |
| Risk Monk 邀请码 | 10 个 |
| 结果揭示条件 | 邮箱验证 + Join Telegram + Follow X |
| 邀请码发放条件 | 结果生成并完成揭示 |
| 邀请码每屏展示 | 5 张竖卡 |
| 首次分享奖励 | +500 优先值 |
| 好友完成验证奖励 | 每人 +500 优先值 |
| 地区限制 | 沿用主产品当前规则 |

### A.2 邀请码异常提示

| 情况 | 提示 |
| --- | --- |
| 无效 | Invite code not recognized. Check the code and try again. |
| 已使用 | This invite has already been claimed. Ask for another one. |
| 暂时被占用 | This invite is being used in another session. Try again shortly. |
| 已过期 | This invite has expired. Ask for another one. |

答题期间不显示倒计时，只提示：Your invite is reserved for this session.

### A.3 分享链接

首版使用以下链接形式：

~~~text
/waitlist/?result={result_id}
/waitlist/?result={result_id}&invite={one_time_invite}
~~~

只展示结果时使用第一种；同时附带邀请码时使用第二种。更短的结果链接不在本期范围。

### A.4 结果保存范围

每个结果固定保存：

- 题目配置和六个答案。
- 三个判型维度结果。
- 信仰、嗅觉、复原力。
- 用户人格。
- Best Match / Natural Rival。
- 人格文案和结果卡配置。
- Telegram 和 X 社群动作的完成状态。

题目、关系或文案更新后，旧结果仍按生成时的配置展示。

## 附录 B：题目配置

### B.1 配置说明

每道题包含：

- question_id
- dimension
- prompt
- artwork_key
- 四个 options

每个选项包含：

- option_id
- label
- axis_weight
- conviction
- instinct
- resilience

下表属性加点是后端首版种子配置，不是最终冻结值。每次调整都要确保答案表达与加点方向一致，并检查所有答案组合都能得到有效结果。

### B.2 Risk posture

#### R1 · A coin you do not own is up 40%. What do you do?

| option_id | 选项 | 判型权重 | 信仰 | 嗅觉 | 复原力 |
| --- | --- | ---: | ---: | ---: | ---: |
| R1_A | Buy now. Momentum rarely waits. | +2 | +15 | 0 | 0 |
| R1_B | Start small now and add if it holds. | +1 | +10 | +5 | 0 |
| R1_C | Set my entry and wait. | -1 | 0 | +10 | 0 |
| R1_D | Pass. No setup, no trade. | -2 | 0 | +5 | +10 |

#### R2 · Your position moves 20% against you. What happens next?

| option_id | 选项 | 判型权重 | 信仰 | 嗅觉 | 复原力 |
| --- | --- | ---: | ---: | ---: | ---: |
| R2_A | Add immediately. The market is improving my entry. | +2 | +15 | 0 | 0 |
| R2_B | Give it more room before deciding. | +1 | +10 | 0 | +5 |
| R2_C | Reduce the position according to plan. | -1 | 0 | +5 | +10 |
| R2_D | Exit at invalidation. No debate. | -2 | 0 | 0 | +15 |

### B.3 Decision basis

#### D1 · Before entering a trade, what convinces you most?

| option_id | 选项 | 判型权重 | 信仰 | 嗅觉 | 复原力 |
| --- | --- | ---: | ---: | ---: | ---: |
| D1_A | Wallet flows, data, and a clear invalidation level. | +2 | 0 | +15 | 0 |
| D1_B | Chart structure and price confirmation. | +1 | 0 | +10 | +5 |
| D1_C | The market’s mood and momentum. | -1 | +5 | +5 | 0 |
| D1_D | A strong thesis that simply feels early. | -2 | +10 | +5 | 0 |

#### D2 · A trader you trust posts a high-conviction call. What do you do?

| option_id | 选项 | 判型权重 | 信仰 | 嗅觉 | 复原力 |
| --- | --- | ---: | ---: | ---: | ---: |
| D2_A | Verify it with onchain data and market structure. | +2 | 0 | +15 | 0 |
| D2_B | Check the chart before taking a position. | +1 | 0 | +10 | +5 |
| D2_C | Open a small starter because I trust the source. | -1 | +5 | +5 | 0 |
| D2_D | Follow immediately. Conviction is contagious. | -2 | +10 | 0 | 0 |

### B.4 Trading mode

#### S1 · You catch a 10×. Who hears first?

| option_id | 选项 | 判型权重 | 信仰 | 嗅觉 | 复原力 |
| --- | --- | ---: | ---: | ---: | ---: |
| S1_A | Screenshot, group chat, X. | +2 | +10 | 0 | 0 |
| S1_B | My close trading group. | +1 | +5 | 0 | +5 |
| S1_C | One trusted friend, maybe. | -1 | 0 | +5 | +5 |
| S1_D | No one. I take profit and keep moving. | -2 | 0 | +5 | +10 |

#### S2 · Your group chat strongly disagrees with your trade. What do you do?

| option_id | 选项 | 判型权重 | 信仰 | 嗅觉 | 复原力 |
| --- | --- | ---: | ---: | ---: | ---: |
| S2_A | Debate it with the group and adjust if they have a point. | +2 | 0 | +5 | +5 |
| S2_B | Listen first, then decide. | +1 | 0 | +10 | +5 |
| S2_C | Note the feedback but keep my plan. | -1 | +5 | 0 | +10 |
| S2_D | Ignore the noise and execute alone. | -2 | +10 | 0 | +5 |

## 附录 C：人格配置

人格名称和判词来自[运营原始资料](https://docs.google.com/document/d/1WTJraroBjYy4XgoXqjVePK7k0EmfM8TB/edit)。结果页只展示一句判词；中英文需要共同审核，不再维护长解释、卡片解释和多套版本。

| persona_id | 中文人格 | 英文人格（待运营确认） | 三维组合 | 隐藏款 | 邀请码 |
| --- | --- | --- | --- | --- | ---: |
| LQD | 送钱者 | The Liquidity Donor | DEGEN · GUT · PACK | 否 | 5 |
| AIM | 梭哈仙人 | The All-In Mystic | DEGEN · GUT · LONE | 否 | 5 |
| SIG | 喊单军师 | The Signal General | DEGEN · DATA · PACK | 否 | 5 |
| CND | K线教主 | The Candle Prophet | DEGEN · DATA · LONE | 否 | 5 |
| DIP | 抄底带头大哥 | The Dip Ringleader | SNIPER · GUT · PACK | 否 | 5 |
| DOC | 行情老中医 | The Market Doctor | SNIPER · GUT · LONE | 否 | 5 |
| CHN | 链上侦探 | The Onchain Detective | SNIPER · DATA · PACK | 否 | 5 |
| LMT | 潜伏狙击手 | The Limit Sniper | SNIPER · DATA · LONE | 否 | 5 |
| RSK | 风控大师 | The Risk Monk | 隐藏规则覆盖 | 是 | 10 |

### C.1 唯一判词

| persona_id | 中文 | English |
| --- | --- | --- |
| LQD | 你不是在交易，你是在给市场做慈善。 | You’re not trading. You’re funding the ecosystem. |
| AIM | 每次梭之前都觉得自己悟了，梭完就圆寂。 | Every all-in starts with enlightenment and ends with reincarnation. |
| SIG | 分析了三小时，结论两个字：开冲。 | Three hours of research. Two-word thesis: send it. |
| CND | 什么线都会画，就是画不出自己的仓位该多大。 | You can chart every line except the one marking enough exposure. |
| DIP | 你不是在抄底，你是在给下跌打样。 | You’re not buying the dip. You’re giving the downtrend a demo. |
| DOC | 每个症状都看懂了，每笔亏损也解释得明明白白。 | Every symptom diagnosed. Every loss professionally explained. |
| CHN | 全世界的仓位你都门儿清，就自己那单偶尔看不明白。 | You know everyone’s position except, occasionally, your own. |
| LMT | 你的限价单很完美，可惜你和它再也没见过。 | The limit order was perfect. Shame you two never met again. |
| RSK | 别人研究怎么一把翻倍，你研究怎么还有下一把。 | They study how to double once. You study how to stay in the game. |

Risk Monk 的精确触发条件：

1. Risk posture 两道题都选择最克制的答案，合计为 -4。
2. Decision basis 和 Trading mode 均未达到任一端的绝对极值。

每个人格还需配置：

- 中英文名称。
- 本节中的唯一一句中英文判词。
- 结果图。

结果页和结果卡统一复用这句判词，不另外维护卡片解释或第二套文案。

## 附录 D：搭档与天敌

| persona_id | Best Match | Natural Rival |
| --- | --- | --- |
| LQD | DIP | LMT |
| AIM | DOC | CHN |
| SIG | CHN | DOC |
| CND | LMT | DIP |
| DIP | LQD | CND |
| DOC | AIM | SIG |
| CHN | SIG | AIM |
| LMT | CND | LQD |
| RSK | CHN | LQD |

首版只展示关系标签与人格名称，不增加第二段关系解释。关系调整后，只影响新生成的结果，历史结果不变化。

## 附录 E：核心埋点

| 事件 | 用人话说明监测什么 | 关键属性 |
| --- | --- | --- |
| waitlist_landing_view | 有多少人进入活动，来自官网还是朋友分享 | entry_type、result_present、invite_present |
| referral_result_view | 分享人的结果有没有被打开，哪类人格带来访问 | result_id、persona_id |
| invite_submit | 用户看到邀请码门槛后是否尝试进入 | entry_type |
| invite_reserve_success | 有多少人持有效邀请码通过入口 | entry_type |
| invite_reserve_failed | 用户被挡在入口的原因 | reason |
| quiz_started | 通过入口的人有多少开始测试 | quiz_version、entry_type |
| quiz_answered | 每题选择分布、耗时和流失位置 | question_id、option_id、elapsed_ms |
| quiz_completed | 有多少人完成六道题 | quiz_version |
| email_submitted | 完成测试后有多少人愿意绑定邮箱 | entry_type |
| email_verified | 有多少人正式加入 waitlist | entry_type |
| community_clicked | Telegram 或 X 分别有多少人点击 | channel |
| community_requirement_completed | 有多少人完成结果揭示前的两个社群动作 | telegram_complete、x_complete |
| result_unlocked | 有多少人在完成社群动作后成功揭示结果 | result_id、persona_id |
| result_viewed | 结果揭示后是否被正常看到 | result_id、persona_id |
| share_clicked | 有多少人发起分享，以及选择了哪个渠道 | result_id、channel |
| result_shared | 在渠道能够确认时，有多少人真正完成分享 | result_id、channel |
| invite_grant_created | 有多少人在结果生成后获得 5 或 10 个邀请码 | result_id、persona_id、quota |
| invite_link_copied | 获得邀请码后，有多少人复制了邀请链接 | result_id |
| invite_redeemed | 邀请链接带来了多少完成邮箱验证的好友 | source_result_id |
| rank_reward_applied | 分享和好友邀请带来的排名奖励是否正常发放 | reward_type、priority_delta |
| result_card_downloaded | 哪种尺寸的结果卡更常被下载 | result_id、format |

埋点不得包含邮箱、完整邀请码、验证码或自由输入文本。

## 附录 F：结果卡与邮件

### F.1 结果卡

两种尺寸：

- 1080×1920：Story、手机保存。
- 1200×630：X / OG。

结果卡包含：

- SmartX logo。
- 人格名称和三个判型标签。
- 信仰、嗅觉、复原力。
- 与结果页相同的唯一一句自嘲判词。
- Best Match / Natural Rival。
- Waitlist 入口。
- For entertainment only. Not financial advice.

### F.2 必需邮件

| 邮件 | 触发 |
| --- | --- |
| 邮箱验证码 | 用户提交或重发验证码 |
| Result saved / waitlist active | 首次完成邮箱验证 |
| Invite redeemed | 好友完成验证后通知邀请人 |
| You joined through an invite | 受邀好友完成验证 |
| Alpha access | 后续 Alpha 发放时使用，不在本期范围 |

## 附录 G：视觉边界

当前已经确认：

- 不使用旧像素 Owl、塔罗或旧神兽资产；人格图改用拟人化 SmartX Owl 交易梗插画。
- 人格插画采用黑色 hoodie、teal Owl、粗线条 2D editorial meme illustration；每张图只表达一个清晰的交易行为笑点，不在图片内生成标题或长文案。
- 九张人格图保持角色比例、线条、配色和黑底一致，但通过动作、行情和道具区分人格，不要求沿用旧猫头鹰侦探造型。
- 每题只使用一张主图，不为每个选项分别配图。
- 桌面端图片与答题区左右排列；移动端图片在上、选项在下。
- 视觉基准继承官网 `codex/consumer-network-stage-20260825`：黑色画布 `#010101`、SmartX teal `#08DFB5`、白色主文字、灰色辅助文字和近黑产品表面。
- 使用官网新版 Owl 图标与 Lexend `SmartX` 字标，不再使用旧像素字标。
- Playfair Display 只用于入口主标题、好友分享标题和人格名称；题目、选项、表单、解锁任务与结果信息使用 IBM Plex Sans。
- 题目图片不使用明显外框，通过遮罩和背景渐隐融入页面；当前图片仍是可替换占位资产。
- 入口可以使用官网 Hero 影像作为低对比环境承接，但 Waitlist 不复制官网的长滚动营销结构。
- 人格插画使用与页面一致的近黑背景无缝融入结果页，不单独放进明显图片容器；只有好友分享结果卡和可下载结果图保留明确卡片边界。
- 一次性邀请码保持每屏五张窄竖卡，使用官网产品切片的近黑表面、细边线和圆角；桌面端直接放入结果页右栏，不向下扩展为第二屏。
- 大屏只扩展背景，核心内容保持 `1280–1360px` 最大阅读宽度；字体不做整页等比例放大。
- 不复制官网长页面结构和整套像素动效。
- 动效只解释答题推进、结果揭示、排名变化和邀请码发放。

仍待确认：

- 问题图的最终媒介与九张人格图的逐张运营审定。
- 结果卡动效。

视觉未冻结不影响活动规则和后端开发。

## 附录 H：参考来源

- Google Docs · 老板原始方案：https://docs.google.com/document/d/1WMWelasjt_FaDw1Eq6RyEfoFiATGIotFVrykRmhdQZg/edit
- Lark · 产品补充与方案索引：https://wjpvbd3lg9kg.jp.larksuite.com/wiki/D6mGwhuBBiGzEtkS0pOjgEQKpmh
- Google Docs · 运营交易人格方案：https://docs.google.com/document/d/1WTJraroBjYy4XgoXqjVePK7k0EmfM8TB/edit
- 官网 V4 权威方案：docs/website-v4.md
