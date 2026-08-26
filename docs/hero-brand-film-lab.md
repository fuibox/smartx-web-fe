# SmartX Hero Brand Film Lab

> 状态：探索中，非定稿，非 V4 权威方案  
> 建立日期：2026-08-25  
> 目标：用可追溯的小步实验，找到 SmartX 官网首屏 10 秒品牌视频的最佳故事、关键帧与运动表达。  
> 边界：本文件不会自动改变已冻结的 V4 Hero；只有明确评审通过后，候选方案才可进入正式页面。

> **Current production contract:** [`Shooting Script V0.2`](../output/hero-brand-film-lab/shooting-script-v0.2.md). It supersedes the earlier SB-C `Shared Trace`／水面／脚步方案 for the first Seedance prototype. Older sections below remain as decision history.

## 1. 现在到底在验证什么

目前的六个 Shot 只是 **Storyboard Hypothesis A**，不是已经确认的分镜；现有六张图只是 **Keyframe Hypothesis K1**，也不是定稿关键帧。

实验要分别回答四个问题：

1. **Story**：10 秒里到底要讲哪六件事，顺序是否成立？
2. **Frame**：每一幕的空间、人物、构图和视觉隐喻是否正确？
3. **Motion**：静帧被 Seedance 动起来后，因果关系是否仍然清楚？
4. **Edit**：六段素材剪成 10 秒以后，节奏、转场和循环是否成立？

因此，某张关键帧即使能生成很漂亮的视频，也不代表这个 Shot 的故事是对的；反过来，故事成立但生成结果不好，也可能只是关键帧或提示词不对。

## 2. 我们采用的“贪婪迭代”规则

每个 Shot 都有一个 `Current Best`，新候选只和当前最佳版本比较。

1. Round 0 使用现有 K1 关键帧和 P0.1 提示词，先判断这个方向“动起来有没有潜力”。
2. 同一提示词先生成 3 次，区分提示词问题和随机生成问题。
3. 从 Round 1 开始，每轮只改变一个变量，例如：机位、人物动作、信号行为、空间密度、光线或节奏。
4. 新候选明显更好时，只替换 `Current Best` 指针；旧文件不覆盖、不删除。
5. 如果连续两轮都无法解决同一个核心问题，停止修 Prompt，回到 Keyframe 或 Story 层换假设。
6. 未通过的素材同样保留，因为它记录了哪些表达会失败。

### 版本层级

| 层级 | 示例编号 | 可以被替换的内容 |
| --- | --- | --- |
| Storyboard | `SB-A`、`SB-B` | Shot 的含义、数量、顺序、时长 |
| Keyframe | `S02-K1`、`S02-K2` | 构图、人物、空间、信号形态 |
| Prompt | `S02-P0.1`、`S02-P0.2` | 对运动、镜头、限制条件的描述 |
| Video | `S02-R00-C01` | Seedance 的一次实际输出 |
| Edit | `E01`、`E02` | 六个 Shot 的剪辑、节奏、声音与循环 |

### 晋级规则

候选总分 100 分：

| 维度 | 分值 | 判断问题 |
| --- | ---: | --- |
| 概念可读性 | 25 | 不看解释，能否感知这一幕发生了什么？ |
| SmartX 品牌区隔 | 20 | 是否属于 SmartX，而非 Robinhood cosplay 或泛 AI 广告？ |
| 人物与世界一致性 | 15 | 人物、服装、建筑、色彩是否稳定？ |
| Hero 文案安全区 | 15 | 中央标题区是否稳定、干净、可读？ |
| 镜头与运动质量 | 15 | 动作是否自然，运动是否有因果和明确终点？ |
| 可剪辑与可循环性 | 10 | 能否从 5 秒素材中截取 1–2 秒有效动作？ |

出现以下任一情况，直接判定为 Hard Fail：

- 擅自生成可读文字、数字、Logo、交易 UI 或假的 App 页面；
- 人物身份、服装或空间发生明显漂移；
- 画面中心出现高亮主体，导致 Hero headline 无法阅读；
- 用随机霓虹、无语义粒子、圆形光晕代替信号因果；
- Share → Action → Value 的传播方向不可辨认；
- 主要印象变成“一个酷的人拿手机走路”，明显接近 Robinhood 的母题。

建议晋级阈值：新候选比 `Current Best` 高至少 5 分，或解决一个 Hard Fail 且没有制造新的 Hard Fail。

## 3. 当前 Storyboard Hypothesis A

最终成片目标约 10 秒；Seedance 首轮每个 Shot 先生成 5 秒素材，再在剪辑里截取最有效的 1–2 秒。生成时不要强迫模型直接完成最终短时长。

| Shot | 成片时间 | 当前叙事假设 | 当前关键帧 | 状态 | Current Best |
| --- | --- | --- | --- | --- | --- |
| S01 Activation | 0.0–1.3s | 人进入市场，信号苏醒 | [`S01-K1`](../output/hero-brand-film-keyframes-v1/shot-01-activation.png) | 未验证；可能仍太像“拿手机” | — |
| S02 It Finds You | 1.3–2.8s | 市场噪音围绕这个人重新组织 | [`S02-K1`](../output/hero-brand-film-keyframes-v1/shot-02-it-finds-you.png) | 建议作为首个校准 Shot | — |
| S03 Proven Edge | 2.8–4.2s | 轨迹显示谁的判断真正改变市场 | [`S03-K1`](../output/hero-brand-film-keyframes-v1/shot-03-proven-edge.png) | 未验证；需避免变成普通 K 线 | — |
| S04 Decision | 4.2–5.6s | 被识别的信号变成一次行动 | [`S04-K1`](../output/hero-brand-film-keyframes-v1/shot-04-decision.png) | 未验证；手机不应暴露假 UI | — |
| S05 Share to Value | 5.6–7.5s | 分享引发他人行动，价值回流创作者 | [`S05-K1`](../output/hero-brand-film-keyframes-v1/shot-05-share-to-value.png) | 重点争议；目前“分享变现”可能不够可读 | — |
| S06 SmartX Network | 7.5–10.0s | 市场、人物、交易汇成一个系统 | [`S06-K1`](../output/hero-brand-film-keyframes-v1/shot-06-smartx-network.png) | 未验证；精确 Logo 留给后期合成 | — |

当前六张关键帧和原始生成提示词统一保存在：[`output/hero-brand-film-keyframes-v1`](../output/hero-brand-film-keyframes-v1/)。

### K1 关键帧审查结论

| Shot | K1 判断 | K2 必须解决的问题 |
| --- | --- | --- |
| S01 | 不直接采用 | 与 S04 都是“人物在右侧拿手机”，过早落入 Robinhood 的人物母题。K2 改为人物刚进入空间，手机不出现；市场噪音才是视觉主角。 |
| S02 | 可作为 K2 基础 | 当前是六帧里最能建立世界的一帧。保留中庭与人物尺度，减少背景人群，让噪音向主角重组的方向更明确。 |
| S03 | 可作为 K2 基础 | 微距抽象镜头能打断连续的“人物走路”。但当前轨迹太像普通增长曲线，K2 要出现第二个行动者留下的可验证痕迹。 |
| S04 | 需要重构 | 与 S01 构图重复。K2 改为更近的手部／手机边缘镜头，只表现信号被锁定并发出，手机屏幕仍为黑色。 |
| S05 | 必须重做 | 当前只能看出连接网络，看不出分享或价值回流。K2 必须在一个画面里明确起点、下游两人和返回路径。 |
| S06 | 可作为 K2 基础 | 适合终局拉远，但与 S05 的广角网络太相似。S06 才使用全景网络；Logo 仍在后期精确合成。 |

### Storyboard Hypothesis B：15 秒概念验证版

> **Status: SUPERSEDED BY SB-C · 2026-08-25**  

这不是最终官网时长，而是此前给一次性 Seedance 生成使用的“母版”。SB-C 建立后，本表只作历史记录，不再直接制作 K2 或长 Prompt。

| 时间 | Shot | 唯一主要变化 | 关键帧职责 |
| --- | --- | --- | --- |
| 0.0–2.0s | S01 Market Wakes | 人刚进入，环境噪音苏醒 | 建立人物、空间、方形噪音；不出现手机 |
| 2.0–4.5s | S02 It Finds You | 噪音消退，一个信号主动跟随 | 建立 SmartX 的核心母题 `Signal follows you` |
| 4.5–6.5s | S03 Proven Edge | 信号轨迹显露另一个人的真实行动痕迹 | 从“市场信息”进入“谁有 edge” |
| 6.5–8.5s | S04 Decision | 信号被锁定，变成一次行动脉冲 | 全片唯一接近产品行为的镜头 |
| 8.5–12.0s | S05 Share to Value | 判断向外分享，两人行动，价值沿原路返回 | 给分享变现完整的 3.5 秒因果时间 |
| 12.0–15.0s | S06 SmartX Network | 镜头拉远，所有路径汇成系统 | 形成结尾与回到 S01 的循环接口 |

### Storyboard Hypothesis C：Follow-Camera Baseline

> **Status: SUPERSEDED BY SHOOTING SCRIPT V0.2 · 2026-08-25**
> This section remains as historical reasoning. The current S04 uses a SmartX Opinion Card rail and S05 is its deterministic focus／zoom continuation.

SB-C 暂时借用 Robinhood 的注意力控制方法：多数镜头靠近人物，观众始终有一个可以 follow 的视觉对象；SmartX 的差异不靠大远景或炫技摄影，而靠每段清楚发生的品牌因果。

#### 镜头尺度与角度原则

1. 六段中至少四段使用人物／手／手机的近景或中近景；人物通常占画面高度约 35%–80%。
2. 全片只允许一个强调空间纵深的环境镜头。它不必固定为背后仰拍建筑，但必须同时看见近处的人物起点与远处的明确标志物，建立一条可被 follow 的起点—终点轴线；人物仍留在近景或前景作为视觉锚点。
3. 全片只允许一个完全没有人物的镜头：标的与 K 线／价格轨迹的微距抽象镜头，用来换气并明确“这是市场”。
4. 当前版本不使用航拍、全景网络、地球尺度或人物缩成小点的大远景。S04／S05 的 social intelligence 暂时通过人物尺度内的 `shared trace` 实验，不使用横向产品 rail、多人主体切换或网络总览。
5. 人物镜头默认侧面、侧后三分之四或背后跟拍；禁止正面站定、职业肖像、英雄仰视和时装走秀式步态。
6. 人物镜头默认 35–50mm 的自然观察感；手／手机／曲线使用更紧的特写。具体焦段到首尾帧阶段再锁定。
7. 主运动方向暂定由左向右；跨镜头继续沿同一方向，减少观众重新定位的成本。
8. 每段只发生一个主要变化。相机以稳定跟拍、轻推或固定机位为主，不使用大幅环绕、快速变焦或持续拉远。
9. Hero 标题所在的中央区域保持低对比；暗色人物轮廓可以短暂经过，但脸、手机高光和关键信号不得与标题争夺注意力。
10. 产品结构级 UI 只在 S03 出现一次：一个标的与一条 K 线／价格轨迹。S04／S05 当前不加入可读 opinion 或产品组件；S06 可以后期加入一次极简奖励提示，但不是完整产品界面。全片不展示 App 页面、排行榜、交易卡、Rewards Dashboard 或 Creator Dashboard。
11. 每个镜头只有一个明确的注意力主体。镜头可以包含多人或环境变化，但不能在同一镜头里要求观众先追一个人、再切换到另一个人；如果主体必须改变，就通过明确切镜完成。Robinhood 在这里借用的是 attention discipline，而不是具体人物、建筑或产品意象。
12. 手机只在 S01 与 S06 出现：S01 负责“拿起／打开 SmartX”，S06 负责“奖励／Logo 收尾”。S02–S05 手机完全不入镜，人物行走时双手自然摆动且不插兜。肩包只能作为松弛的生活方式锚点，必须轻、软、随意搭在身体侧后方，不得拉低肩膀、阻挡手臂或改变步态。

#### Camera Angle Bible V0.1

人物是被摄影机 follow 的移动视点，不是品牌发言人或肖像主体。全片暂停正面与侧前 3/4 人物构图，只使用纯侧面、侧后 3/4 和后肩／背面。六段机位、景别、焦段倾向与实际所需的四张人物视角资产记录在 [`camera-angle-bible-v0.1.md`](../output/hero-brand-film-lab/camera-angle-bible-v0.1.md)。在该表通过前，不继续生成 S01／S06 手机动作图。

#### 六段内容骨架

以下时间只是 10 秒母版的节奏草案，不是首尾帧合同：

| 时间 | Segment | 这一段只讲什么 | 借用的镜头语法 | 交给下一段的实体 |
| --- | --- | --- | --- | --- |
| 0.0–1.3s | S01 Open SmartX | 20 出头的主人公在自然行走中拿起手机；周围原本略微失序的信息仍存在。只建立“打开 SmartX”这个触发，不急着解释功能。 | 侧面／侧前三分之四中近景，人物和手机都不正对镜头 | 手机抬起后的视线方向 |
| 1.3–2.7s | S02 The World Sorts | 人物双手空着在近处继续前进，远处出现一个清楚但不过度抢眼的标志物。原本隐藏在建筑边缘、地面接缝、反射与光线中的方向被逐步抽取出来，形成从人物起点通向标志物的连续路径。手机已经通过明确切镜退出，不展示收起动作。 | 可用后肩、侧后或略低机位，但不固定复制 Robinhood；核心是同帧建立 `人物 → 路径 → 标志物` 的纵深关系 | 被抽取出来的 route axis |
| 2.7–4.3s | S03 See the Market | 镜头贴近 S02 的 route axis；真实空间的路径逐渐脱离建筑材质，match cut 成一个标的和一条 K 线／价格轨迹。这是全片唯一明显带 UI 感的镜头，只负责让观众确认“这条路其实是市场”。 | 借用 Robinhood 的数据换气逻辑，但必须由上一段的真实路径自然转化而来，不能突然切到一张独立图表 | 本镜可在 K 线稳定后完整结束；不向 S04 强交接 |
| 4.3–5.8s | S04 Person × Environment（PARTIAL） | 确定主人公双手空着继续轻松行走，摄影机只 follow 他；环境中的一个局部媒介因他的经过产生可见关系或痕迹。具体媒介还未锁定，可以是浅反射水面、抛光湿地面、玻璃雾气或其他现实材质，但不能同时出现多个需要解读的 opinion 主体。 | 侧面／侧后三分之四中近景稳定跟拍；人物始终是唯一注意力主体，环境只做回应 | 一处被人物经过后留下状态变化的 shared trace（候选，不是定稿） |
| 5.8–8.0s | S05 Social Proof（OPEN） | 这一段只证明“许多人曾经接触／经过／使用过同一个东西”，具体表达尚未锁定。当前实验族 `Shared Trace E1`：镜头固定观察 S04 留下的环境媒介，许多不同脚步依次进入并留下涟漪或痕迹；摄影机始终 follow 同一处环境，而不是切换到不同人物。 | 低机位或局部特写；环境痕迹是唯一视觉主体，人物只以脚步、影子或局部经过作为事件证据 | 多人参与已经发生这一事实；奖励结果留给 S06 |
| 8.0–10.0s | S06 Reward → SmartX（PARTIAL） | 已确定回到主人公与手机，并把“获得奖励”和品牌落版合并在这里。手机先出现一条后期合成的极简奖励提示，再切换／收束为 SmartX Logo；精确金额、文案、时长和手机角度尚未锁定。 | 手机与手的极近景；手机是唯一注意力主体，Reward → Logo 是同一主体的状态变化 | 黑场与手机抬起动作，可循环回 S01 |

S03 与 S04 之间不做物体变形或材质接力。两段可以是一次明确的 editorial cut：同一个人物、相近的前进方向、统一的色彩和声音节奏已经足够维持连续性。全片只在真正有叙事收益时使用 shared element；不为了“转场高级”强行让每个镜头都由上一镜的实体变形而来。

#### 品牌片与 UI 的边界

这不是产品 Demo，也不以当前移动端纯 Demo 的页面、字段和完成状态限制品牌叙事。移动端 Demo 只可以在后续需要极少量图形细节时，提供 SmartX 的颜色、排版、线条、卡片边缘和动效节奏参考。

品牌片中的功能关系全部采用 cinematic motion identity 表达：

```text
noise becomes direction
→ direction becomes a market curve
→ the person leaves a visible relationship with the environment
→ repeated traces prove that others participated
→ reward returns to you
→ SmartX closes the loop
```

唯一明确的市场 UI-like moment 是 S03 的“一个标的 + 一条 K 线／价格轨迹”。S04 与 S05 暂时停止用多个 opinion 或多人面孔直接解释社交，优先测试 `主人公与一个环境媒介发生关系 → 同一个环境媒介积累许多人经过的证据`。奖励结果统一延后到 S06 的手机近景，不再要求 S05 同时完成传播和价值回流。

#### S02 → S03 的核心共享实体

当前优先锁定的转场不是某个具体建筑机位，而是这条连续关系：

```text
人物所在的位置（起点）
→ 远处可辨认的标志物（终点）
→ 建筑／地面中被抽取出来的路径
→ 脱离现实材质的线
→ K 线／价格轨迹
```

标志物可以是建筑开口、独特的光面、结构性立柱或其他现实空间中的方向锚点；暂时不使用 Logo、屏幕、悬浮图标或发光箭头。路径必须像原本就存在于空间中、只是被 SmartX 识别出来，而不是突然生成的游戏导航线。

#### 六段状态合同 V0.5

这张表只规定每段“发生什么”，不是关键帧构图，也不锁定具体建筑、标的、焦段或人物站位。

| Segment | 起始状态 | 唯一主要变化 | 结束状态 | 交给下一段的实体 |
| --- | --- | --- | --- | --- |
| S01 Open SmartX | 近黑环境中，主人公以自然步态进入／经过画面；手机低垂在身侧，周围只有低对比、无法聚焦的现实信息噪音。 | 主人公在行走中自然拿起手机，同时视线从周围转向前方；这一段不让空间开始重组。 | 手机停在舒适但不遮脸的位置；主人公已经看向某个前方方向，环境仍处于变化前。 | 主人公的视线方向与手机抬起动作 |
| S02 The World Sorts | 切到侧后／后肩方向。主人公双手空着在近处继续行走，手机不入镜；远处标志物可辨认但尚未形成清楚路线，地面、建筑、反射和光线的方向彼此错开。 | 随着人物继续前进，原有现实结构通过视差和对齐逐步显露一条从起点通向标志物的连续轴线；不是新增发光导航。 | 起点、路径和标志物形成清楚纵深关系；主人公沿路线迈出下一步，镜头贴近路径中的一条真实接缝／边缘。 | route axis 的同一条接缝／边缘 |
| S03 See the Market | 极近景延续 S02 的同一条接缝，保留相同方向、色彩和运动速度，开始时仍能看出真实材质。 | 建筑／地面材质逐渐退去，接缝脱离现实表面并转化为一个标的与一条 K 线／价格轨迹；曲线只完成一次明确绘制。 | 单一标的和曲线稳定，不出现其他产品界面。镜头可以在这里完整结束。 | 无强制交接；下一镜依靠人物、色彩与剪辑节奏重新建立连续性 |
| S04 Person × Environment（PARTIAL） | 新的现实空间中，主人公双手空着、肩包松弛地落在身体侧后方，以自然步态从左向右行走；环境中只有一处局部媒介具备响应可能，其他元素保持安静。 | 人物经过这处媒介时只发生一种物理关系，例如踩过浅反射面形成一次涟漪，或经过玻璃留下短暂雾痕。摄影机与观众的注意力始终跟随主人公。 | 主人公继续前进；环境媒介中留下一个可被下一镜单独观察的状态变化。 | shared trace 的媒介与初始痕迹；具体材质仍未锁定 |
| S05 Social Proof（OPEN） | 镜头切到 shared trace 的局部特写；主人公不再是主体，环境媒介成为唯一注意力锚点。 | 不同人物只以脚、影子或局部轮廓依次经过，痕迹／涟漪逐步叠加，让观众看出许多人曾经接触同一处媒介。镜头不追踪任何一个后来者。 | 环境留下累积后的多人参与证据；不显示人数、交易数字或回流脉冲。 | “多人参与已经发生”这一结果；S06 独立显示奖励 |
| S06 Reward → SmartX（PARTIAL） | 主人公处于安静、近黑的终点／过渡空间，手机仍低垂；不要求接住 S05 的图形实体。 | 他自然拿起手机。后期先加入一条极简奖励提示，短暂停留后收束／切换为精确 SmartX Symbol；相机只做轻微靠近。 | SmartX Logo 稳定短暂停留；近黑渐变与 S01 开头的黑场和手机抬起前状态相接。 | 近黑渐变与手机的下一次抬起动作 |

#### S05 传播机制候选

S05 继续保持 Open。当前不需要证明它的最终隐喻，只记录一个符合“单镜头单注意力主体”原则的实验族：

1. **Shared Trace E1 · Reflective Surface**：S04 里主人公经过一处浅反射水面／抛光湿地面，人物仍是唯一主体；S05 切到该表面的固定局部镜头，不同脚步依次进入并产生叠加涟漪或痕迹。观众始终看同一处表面，脚步只是证明“很多人经过”的事件。
2. **Shared Trace E2 · Glass / Condensation**：主人公经过一块玻璃并留下一个局部状态变化；S05 固定观察同一块玻璃，越来越多经过者的影子或痕迹叠加。比水面更建筑化，但容易变成纯艺术隐喻。
3. **Shared Trace E3 · Architectural Seam**：主人公经过一条真实地面／墙面接缝；S05 固定观察接缝被连续脚步激活。更干净、更接近 SmartX 的线性语言，但需要避免重新变成发光导航线。

水洼本身暂不定稿。普通街边水洼容易产生雨天、脏污、鞋类广告或沉重情绪；若测试水的方向，优先使用现代建筑中的浅反射层或克制的湿润表面。这个建议只约束材质气质，不改变用户提出的“固定观察环境证据”的核心思路。

上一版 `Same Take, Different People` 被撤回：虽然它避免了人物追赶，但仍要求观众在极短时间内连续更换人物主体，不符合当前 attention discipline。

不采用“插旗”：旗帜更接近占领、闯关或个人成就，容易把品牌重新拉回艰难征服的山地隐喻，也没有直接解释别人如何看见并使用这个人的观点。

#### 状态合同 Hard Fails

- S01 提前开始空间重组，导致“拿起手机”与“世界变清楚”没有两个可辨认阶段。
- S02 生成霓虹箭头、悬浮路线、游戏导航或凭空出现的道路，而不是从真实空间结构中抽取方向。
- S03 变成完整交易页面、多标的 Dashboard、蜡烛图墙或大量数字。
- S04 在同一镜头里同时要求观众跟随人物、opinion 和多个环境响应；当前只允许人物是主体、环境发生一次局部回应。
- S05 拉成网络全景、地球视角、社交卡片墙，让人物在同一条路上前后追赶，或通过 match cut 连续更换人物主体；也不使用插旗、奖杯或登顶来表达影响力。
- S06 让生成模型绘制奖励文字、金额或近似 Logo。奖励提示、精确数字、SmartX Symbol 与字标全部后期合成；Seedance 只生成干净手机与表演。

#### 暂时故意不决定的内容

- 远处标志物的具体形态；
- S02 的最终机位和镜头高度；
- S03 的具体标的、曲线数据与后期文字；
- S04／S05 的 shared trace 最终使用浅反射水面、玻璃、建筑接缝还是其他现实媒介；
- S05 是否真的需要展示多人，还是由 S06 的奖励提示独立证明传播结果；
- S06 奖励提示的精确文案、数字和停留时长；
- SmartX Symbol 如何与最后黑场精确衔接。

这些内容进入下一阶段的首尾帧设计后，每轮仍只改变一个变量。

#### Lock Matrix V0.5

`Locked` 表示可以开始制作依赖资产，不表示以后永远不能替换；只有新方案明显更好时才按本文件的贪婪规则替换。

| 层级／段落 | 状态 | 现在可以做什么 | 仍然不做什么 |
| --- | --- | --- | --- |
| 人物 C4 brief | LOCKED FOR ANCHOR | 生成同一位 21–24 岁东亚男性的脸部身份锚点与全身行走锚点，固定发型、服装、软质肩包和松弛表演 | 不直接生成成片镜头，不在不同 Shot 重选人物 |
| 全局注意力规则 | LOCKED | 每镜只设一个 attention anchor；固定近景／中近景优先、中央 Hero 安全区、近黑开合、少 UI | 不在同镜切换人物主体，不做网络远景或地球尺度 |
| 空间语言 | ROUND R01 REVIEWING · A RECOMMENDED | A 已解决走廊拓扑，作为开放式 undercroft 的当前贪婪最优；B 只保留庭院人尺度参考。用户选择 A 后，下一轮只调整 A 的色温与体感尺度 | 尚不把 A／B 当作最终 Seedance 空间图；暂不锁定 S04／S05 的 shared trace 材质 |
| S01 Open SmartX | CONTENT LOCKED | 在人物与空间锚点通过后制作首帧／尾帧；只验证拿起手机与前方视线 | 不加入空间重组、意见、K 线或奖励 |
| S02 The World Sorts | CONTENT LOCKED | 制作人物近处、远方标志物与中间路径的首帧／尾帧 | 不生成游戏导航、霓虹箭头或多人社交 |
| S03 See the Market | CONTENT LOCKED | 制作单一标的与单一 K 线的干净数据镜头；所有文字后期合成 | 不承接 S04，不制作完整产品 UI |
| S04 Person × Environment | PARTIAL | 只做低成本构图／材质实验，不进入最终关键帧队列 | 不锁定水面、玻璃或接缝，不写最终 Seedance Prompt |
| S05 Social Proof | OPEN | 并行讨论与制作灰度／低保真 `Shared Trace` 测试 | 不生成正式成片资产，不让它阻塞 S01–S03 |
| S06 Reward → SmartX | PARTIAL | 可以先生成干净的主人公＋黑屏手机 plate；奖励文案和 Logo 后期单独制作 | 不让生成模型绘制文字、金额或 Logo |

#### 并行生产流程

1. **Wave A · 全局锚点**：先生成 `C4_FACE_ANCHOR`、`C4_BODY_WALK_ANCHOR` 与一张无信息叠加的 `SPACE_ANCHOR`。这三项一旦通过，后面所有 Shot 都引用它们，不再各自发明人物和空间。
2. **Wave B · 已锁镜头静帧**：制作 S01、S02、S03 的首帧／尾帧。先生成静帧，不急着生成视频；每对只检查一个状态变化。
3. **Wave C · 可提前做的收尾 plate**：生成 S06 的手、手机与近黑环境干净镜头。奖励提示和 Logo 暂时用后期占位，不写进 ComfyUI／Seedance 画面。
4. **Experiment Track · 不阻塞主线**：在 Wave A–C 渲染期间，继续讨论 S04／S05；只用灰度分镜、简单合成或低成本图测试 `Shared Trace`。只有注意力路径成立后才升级为正式关键帧。
5. **Assembly Gate**：S01–S03、S06 plate 与 S04／S05 方案全部通过后，再组成完整 storyboard board，检查人物一致、中心安全、黑场开合和节奏。
6. **Motion Gate**：最后才写 15 秒 Seedance 2.0 mini 总 Prompt 并使用一次限免；生成结果用于验证整体，再剪成约 10 秒官网版本。生成模型只负责真人、空间、相机和物理变化，K 线文字、opinion、奖励提示与 SmartX Logo统一后期合成。

### Opening Trigger Exploration V1

> **Decision: REJECTED · 2026-08-25**  
> Reject the underlying visual hypothesis, not just the rendering. Floating square signals remain too abstract: viewers cannot identify what the noise is, what became clearer, or what SmartX revealed. Do not use these frames as Seedance references.

在继续完整 Storyboard 之前，先验证一个更基础的因果：**手机抬起以后，观众应该看见什么变化？**

两组实验共用同一个 Before，避免人物、机位和空间差异干扰判断：

| Frame | Asset | 假设 | 当前观察 |
| --- | --- | --- | --- |
| Shared Before | [`shared-before.png`](../output/hero-brand-film-lab/opening-trigger-v1/shared-before.png) | 手机仍在身体下方，市场噪音模糊无序 | 起始状态足够黑，但噪音可能还需要在后期增加层次 |
| A Trigger | [`option-a-trigger.png`](../output/hero-brand-film-lab/opening-trigger-v1/option-a-trigger.png) | 手机抬起，环境冷光与信息层同时开始回应 | 更电影化，但触发变化偏弱 |
| A After | [`option-a-after.png`](../output/hero-brand-film-lab/opening-trigger-v1/option-a-after.png) | 现实空间轻微变清晰，相关信号留下 | 克制，但静帧中 SmartX 的作用不够明显 |
| B Trigger | [`option-b-trigger.png`](../output/hero-brand-film-lab/opening-trigger-v1/option-b-trigger.png) | 环境完全不变，噪音开始按相关性消退 | 因果更直接，方形信号略显图标化 |
| B After | [`option-b-after.png`](../output/hero-brand-film-lab/opening-trigger-v1/option-b-after.png) | 只剩三个清晰信号，其中一个主动靠近人物 | 更容易读出“打开 SmartX 后，市场变清晰” |

完整生成提示词记录在 [`opening-trigger-v1/generation-prompts.md`](../output/hero-brand-film-lab/opening-trigger-v1/generation-prompts.md)。

当前不晋级任何一组，也不组合 A/B。下一轮停止用无语义方块表达“市场信息”，先明确手机抬起后出现的具体、可识别内容，例如真实标的、事件概率、价格轨迹或 Trader 行动。

### Mountain Treatment V1 · Anchor Test

> **Decision: REJECTED AS TONE · 2026-08-25**  
> Core hypothesis: a user lost in fragmented market terrain sees a verified route through SmartX, completes it, and eventually becomes the origin of a route others can follow.

The route metaphor remains useful, but the mountain treatment is no longer an active visual direction. Climbing, fragmented terrain and summit-scale achievement make the market feel difficult, dangerous and effortful. The desired SmartX tone is the opposite: complexity is quietly organized, an easy route appears, and participation feels light, interesting and rewarding. Keep these images as a record of the rejected tone; do not use them as Seedance references.

这轮只验证三个世界状态，不把它们当作正式 Shot：

| Anchor | Asset | Meaning | Review question |
| --- | --- | --- | --- |
| 01 Lost | [`anchor-01-lost.png`](../output/hero-brand-film-lab/mountain-treatment-v1/anchor-01-lost.png) | 黑色山地／建筑碎片彼此断开，主人公没有方向 | 是否能读出“迷路与市场复杂”，还是更像灾难片？ |
| 02 Path Appears | [`anchor-02-path-appears.png`](../output/hero-brand-film-lab/mountain-treatment-v1/anchor-02-path-appears.png) | 手机抬起后，有限碎片拼成真实可行走路线；路线带有市场曲线特征 | 路线是否清晰，还是太像游戏导航／Tron？ |
| 03 Become the Path | [`anchor-03-become-path.png`](../output/hero-brand-film-lab/mountain-treatment-v1/anchor-03-become-path.png) | 他完成一条路线，并从高处开辟新路，影响力扩展到巨大地形 | 是否能读出“从跟随到开路”，以及尺度是否足够？ |

视觉转换的工作语法：

```text
断裂地形
→ 为他形成的路线
→ K线 / 概率曲线
→ Verified track record
→ 其他人的跟随路径
→ Reputation / Influence / Income
```

完整生成提示词记录在 [`mountain-treatment-v1/generation-prompts.md`](../output/hero-brand-film-lab/mountain-treatment-v1/generation-prompts.md)。三张 Anchor 只保留为失败记录，不进入 Storyboard、角色锚点或 Seedance 长 Prompt。

### Tone Pivot · Effortless Discovery

The active emotional direction is now:

```text
slightly disordered world
→ SmartX quietly makes it legible
→ an easy route appears
→ the user follows with curiosity
→ their action creates a route for others
```

Working rules:

- Keep the narrative idea of `lost → find a route → create a route`, but remove hardship, climbing and conquest.
- The environment adapts to the person; it does not test the person.
- Movement is an unhurried walk with curiosity, not a march, sprint or heroic ascent.
- Dark architecture may remain for Hero contrast, but the destination light and body language must feel open, fresh and inviting.
- Reward 在前五段先表现为轻松参与、判断被他人采用和影响力；如果需要明确金额，只在 S06 的最终手机提示中出现一次。

### Protagonist Identity Candidates

#### Character C1 · East Asian / Knit Polo

> **Status: REVIEWING · 2026-08-25**  
> Goal: ordinary and credible, relaxed light business, no long coat, no fashion-model or CEO styling.

[`character-c1-east-asian-knit-polo.png`](../output/hero-brand-film-lab/characters/character-c1-east-asian-knit-polo.png)

Working definition:

- East Asian male, age 29–33, average height and build.
- Natural, approachable face; short black hair; calm, not heroic or stylized.
- Deep slate-blue long-sleeve knit polo, charcoal relaxed pleated trousers, understated black leather sneakers.
- Plain black phone and simple black watch only.
- No coat, blazer, tie, formal shirt, outdoor gear or visible branding.

Review questions:

- Is the person ordinary and approachable enough, or still too much like a casting model?
- Does the outfit feel relaxed light business, or too office-like because of the pleated trousers and black shoes?
- Should the next version become younger and looser, or keep this restrained maturity?

Prompt record: [`characters/generation-prompts.md`](../output/hero-brand-film-lab/characters/generation-prompts.md). C1 does not replace the temporary mountain protagonist until explicitly approved.

#### Character C2 · Younger East Asian / Relaxed Knit

> **Status: REVIEWING · 2026-08-25**  
> Goal: reduce the apparent age to 24–27 and align with the visual taste of a younger Meme-first audience without stereotyping them.

[`character-c2-young-east-asian-relaxed-knit.png`](../output/hero-brand-film-lab/characters/character-c2-young-east-asian-relaxed-knit.png)

Changes from C1:

- Younger, more open face and softer short hairstyle.
- Knit Polo remains, but is lighter, looser and worn untucked.
- Traditional pleated trousers become softer straight-leg casual trousers.
- Formal-looking black shoes become understated charcoal sneakers.
- Still avoids Hoodie, streetwear costume, luxury styling and Crypto Bro signals.

Review question: does C2 feel young and contemporary enough while remaining an ordinary credible person, or should the styling move one more step toward casual?

#### Character C3 · Motion and Lifestyle Test

> **Decision: REJECTED AS CASTING DIRECTION · 2026-08-25**  
> Goal: keep C2's identity while testing the missing lifestyle cues, asymmetric silhouette and relaxed movement before rebuilding a formal character anchor.

| Candidate | Asset | Only variable | Current observation |
| --- | --- | --- | --- |
| C3-A | [`c3-a-dark-promenade.png`](../output/hero-brand-film-lab/characters/c3-motion-test/c3-a-dark-promenade.png) | Put C2 into motion; add a soft unstructured charcoal shoulder tote and slightly looser drape | Character continuity and bag work, but the static corporate corridor remains too serious and does not show the world making an easier route. |
| C3-B | [`c3-b-effortless-route.png`](../output/hero-brand-film-lab/characters/c3-motion-test/c3-b-effortless-route.png) | Change only the environment and destination light | More open and welcoming, while preserving the dark Hero-safe field; superseded by C3-C because the performance still feels posed and guarded. |
| C3-C | [`c3-c-relaxed-performance.png`](../output/hero-brand-film-lab/characters/c3-motion-test/c3-c-relaxed-performance.png) | Change only facial expression, gaze, shoulders, arms and walking gesture | The performance is looser, but the perceived age, knit polo, technical trousers and overall polish still read too mature and elite. Do not keep refining this identity. |

What the bag is doing:

- It is a lifestyle anchor, not a fashion statement or product feature.
- Soft fabric breaks the overly symmetrical casting silhouette and creates natural motion against hard architecture.
- Use one medium unstructured charcoal nylon shoulder tote or crescent bag with no branding.
- Avoid backpack, briefcase, luxury leather tote, chest sling and oversized travel bag.

Prompt record: [`characters/generation-prompts.md`](../output/hero-brand-film-lab/characters/generation-prompts.md). C3 remains as a failed casting record and must not become the Seedance `character-anchor`.

#### Character C4 · Early-Twenties Reset Brief

> **Status: C04 FACE + BODY + A／B CAMERA VIEWS PROMOTED · 2026-08-25**
> Goal: perceived age 21–24, ideally around 22–23; ordinary, contemporary and relaxed without becoming a student costume or streetwear caricature.

Working definition:

- East Asian male, perceived age 21–24, lean-average everyday build, softer jaw and younger open face, natural short hair with imperfect texture.
- Curious and easygoing rather than composed, successful, authoritative or aspirationally elite.
- Replace the knit polo and technical-wool trousers with a washed deep-navy open-collar overshirt over a plain dark crew-neck tee, relaxed charcoal cotton trousers and slightly worn everyday sneakers.
- Keep one lightweight soft charcoal crescent／shoulder bag as the lifestyle anchor. It hangs casually toward the side-back and never changes shoulder level, arm swing, torso rotation or gait.
- Remove the watch, pleats, leather shoes, tailored crease and any luxury-looking accessory.
- Performance is caught mid-action and unaware of the camera; no fixed gaze, commercial smile, hands-in-pocket pose or upright executive posture. The neutral walking anchor has two empty hands; phone performance is created separately for S01 and S06 only.

The user promoted C04 from Face Round 00, approved R02-C02 as the body-performance anchor, and then promoted the revised side／rear camera views. Stable references: [`face`](../output/hero-brand-film-lab/characters/c4-face-anchor/C4_FACE_ANCHOR_SELECTED_C04.png) · [`body`](../output/hero-brand-film-lab/characters/c4-body-walk-anchor/C4_BODY_WALK_ANCHOR_SELECTED.png) · [`side A`](../output/hero-brand-film-lab/characters/c4-camera-view-anchors/C4_VIEW_A_SIDE_PHONE_FREE_SELECTED.png) · [`rear B`](../output/hero-brand-film-lab/characters/c4-camera-view-anchors/C4_VIEW_B_REAR_3Q_PHONE_FREE_SELECTED.png). These lock identity, age, wardrobe, bag behavior, relaxed movement and legal camera territory; they do not lock exact crop or stride phase. Final person frames follow [`Camera Angle Bible V0.1`](../output/hero-brand-film-lab/camera-angle-bible-v0.1.md). Reviews: [`face`](../output/hero-brand-film-lab/characters/c4-face-anchor/review.md) · [`body`](../output/hero-brand-film-lab/characters/c4-body-walk-anchor/review.md) · [`camera views`](../output/hero-brand-film-lab/characters/c4-camera-view-anchors/review.md) · [`phone camera tests`](../output/hero-brand-film-lab/characters/c4-phone-performance-anchor/review.md).

### 外部策略参考

Robinhood 截图仅用于分析“10 秒、少 UI、真人与抽象图形交接”的策略，不直接作为 Seedance 视觉参考输入，以免生成结果向其人物和建筑语言收敛：

- `/Users/wuxiuchen/Downloads/同步空间/SmartX/剪辑/robinhood_1.png`
- `/Users/wuxiuchen/Downloads/同步空间/SmartX/剪辑/robinhood_2.png`
- `/Users/wuxiuchen/Downloads/同步空间/SmartX/剪辑/robinhood_3.png`
- `/Users/wuxiuchen/Downloads/同步空间/SmartX/剪辑/robinhood_4.png`
- `/Users/wuxiuchen/Downloads/同步空间/SmartX/剪辑/robinhood_5.png`
- `/Users/wuxiuchen/Downloads/同步空间/SmartX/剪辑/robinhood_6.png`
- `/Users/wuxiuchen/Downloads/同步空间/SmartX/剪辑/robinhood_7.png`

## 4. 当前执行策略：最小参考包 → 一次 10 秒全片测试

由于当前只有一次即梦 Seedance 2.0 mini 限免，继续暂停所有视频生成。执行顺序改为：

1. ✅ [`Shooting Script V0.2`](../output/hero-brand-film-lab/shooting-script-v0.2.md) 已接受为当前六段内容与摄影调度基线。
2. ✅ C04 face、body R02-C02、Camera View A R01 与 B R02 均已由用户晋级。
3. ✅ 制作边界已锁定：Seedance 只生成真人、建筑、手机 clean plate 和抽象数据空间；规则标记场、K 线／数字、Opinion Rail、弱选择、奖励与 Logo 全部确定性后期合成。
4. ✅ `3840×2160` 六格 shooting-script review board 已由用户确认：[`PNG`](../output/hero-brand-film-lab/boards/SHOOTING_SCRIPT_BOARD_V02.png) · [`SVG`](../output/hero-brand-film-lab/boards/SHOOTING_SCRIPT_BOARD_V02.svg)。
5. ✅ 已从评审板派生实际投喂用 [`Clean-Plate Board`](../output/hero-brand-film-lab/boards/SEEDANCE_CLEAN_PLATE_BOARD_V01.png)：删除所有后期图形，并将 S04／S05 合并为一段连续生成底片。
6. 🟢 [`Seedance Run Package V0.2`](../output/hero-brand-film-lab/seedance-run-package-v0.2.md) 已包含四张上传素材的顺序、即梦设置、可直接粘贴的 10 秒总 Prompt、生成前检查和原始输出命名规则。下一步是用户在即梦终检后触发唯一一次限免。

SB-B 的 K2、九图投喂包和长 Prompt 骨架全部暂停，不直接复用。

### 建议设置

- 模型：即梦 Seedance 2.0 mini
- 模式：全能参考，不使用首尾帧模式
- 比例：16:9
- 时长：15 秒；如果当前入口的限免只能选 10 秒，则按比例压缩时间表，不删 Shot
- 分辨率：720P
- 声音：无对白、无旁白、无歌词；只允许克制的低频环境声和少量信号音，官网使用时默认静音
- 输出目的：判断完整叙事、镜头交接和品牌气质，不把这一次结果当最终可上线素材
- 不上传 Robinhood 视频或截图作为参考

### 暂停使用的 SB-B 投喂包：最多 9 张图

| 引用 | 素材 | 用途 |
| --- | --- | --- |
| `@图片1` | `SB-B-board.png` | 3×2 无官网文案分镜板，规定六幕顺序、景别与整体节奏 |
| `@图片2` | `character-anchor.png` | 同一主角的正面、侧面和背面身份锚点，只约束人物一致性 |
| `@图片3` | `signal-language.png` | 方形点 → 细线 → 定向脉冲 → 网络的视觉语法，约束信号不变成圆形光球 |
| `@图片4` | `S01-K2.png` | S01 构图参考 |
| `@图片5` | `S02-K2.png` | S02 构图参考 |
| `@图片6` | `S03-K2.png` | S03 构图参考 |
| `@图片7` | `S04-K2.png` | S04 构图参考 |
| `@图片8` | `S05-K2.png` | S05 构图与传播方向参考 |
| `@图片9` | `S06-K2.png` | S06 终局构图参考 |

不需要另传 Logo。模型生成的 Logo 不可靠，最后由网页或剪辑软件精确叠加。

### 暂停使用的 SB-B 15 秒总 Prompt 结构

下面只保留为历史骨架。SB-C 首尾帧通过前，不补写 `FULL-P0.1`，也不把此段投给 Seedance。

```text
参考@图片1的六格分镜顺序、景别和镜头节奏；全片主角严格参考@图片2；所有信号的形状、材质和运动严格参考@图片3。@图片4至@图片9分别只作为对应六个镜头的构图和空间参考，不要把六张图片混合在同一画面。

生成一条完整、连续、电影感的15秒品牌概念片，16:9，近黑现代建筑空间，低饱和teal作为唯一信号色。六个镜头清晰切换，但人物身份、服装、建筑材质、光线方向和视觉语言保持一致。画面中央约70%的Hero标题区始终低对比、稳定、干净。

0.0–2.0秒：镜头1……
2.0–4.5秒：镜头2……
4.5–6.5秒：镜头3……
6.5–8.5秒：镜头4……
8.5–12.0秒：镜头5……
12.0–15.0秒：镜头6……

无对白、无旁白、无歌词、无可读文字、无数字、无Logo、无假App UI、无交易卡、无ticker、无紫色霓虹、无随机粒子、无圆形光晕。不要把重点变成一个人拿着手机在建筑里行走。精确SmartX Logo后期添加。
```

## 5. Prompt 的写法

每条 Prompt 都按同一顺序写：

`参考保真 → 单镜头与时长 → 相机 → 人物动作 → 信号因果 → 最终状态 → 构图安全区 → 禁止项`

Prompt 不负责解释品牌战略，只描述镜头里可以被看见的变化。一个 Shot 只允许一个主要变化。

## 6. 单 Shot 备用 Prompt

以下六条属于已暂停的 SB-B，只保留用于追溯，不再作为当前第一次生成计划，也不用于制作 SB-C 首尾帧。

### S01-P0.1 · Activation

```text
@图片1作为视频第一帧与唯一视觉参考。严格保持图中同一个人物的身份、短发、炭灰色长外套、黑色现代建筑空间、材质、光线、近黑与低饱和 teal 配色，以及原始 16:9 构图。

生成一个单一连续的 5 秒电影镜头，无切镜、无转场。相机几乎固定，只做非常轻微、平稳的慢速推进。人物先保持自然静止，然后缓慢抬起手机，动作克制真实；手机屏幕始终纯黑。画面边缘原本存在的一个 teal 方形信号从微弱变清晰，只发出一次短促、收敛的亮度脉冲，随后人物自然向前迈出一步。不要让信号爆炸或变成光晕。

画面中央约 70% 的 Hero 标题区域必须保持黑暗、稳定、低对比，不让人物、手机或亮信号进入中心文字区。不要新增人物、物体、可读文字、数字、Logo、手机 UI、交易卡、K 线、ticker、紫色霓虹、随机粒子、圆形光晕或新的产品元素。动作自然，人物外观和服装全程不漂移。
```

### S02-P0.1 · It Finds You（建议第一个测试）

```text
@图片1作为视频第一帧与唯一视觉参考。严格保持图中同一个人物的身份、短发、炭灰色长外套、黑色多层现代中庭、其他人物剪影、材质、光线、近黑与低饱和 teal 配色，以及原始 16:9 构图。

生成一个单一连续的 5 秒电影镜头，无切镜、无转场。使用 35mm 电影感镜头，相机在人物侧后方做极慢、平稳的横向跟拍。主角自然向前走两步，远处人物只做很小的真实移动。空间里原有的暗灰小方点逐渐减弱、减少；只保留图片中已经存在的一个 teal 方形信号。这个 teal 方形沿一条很细、克制、可追踪的路径移动，平滑调整方向并跟随主角的运动轨迹，最终稳定停在主角侧后方。变化要像市场空间主动围绕这个人重新组织，而不是人物在追逐一个图标。

画面中央约 70% 的 Hero 标题区域必须保持黑暗、稳定、低对比；不要让人物、信号或高亮路径穿过中心文字区。不要新增人物、可读文字、数字、Logo、手机 UI、交易卡、K 线面板、ticker、更多 teal 路径、紫色霓虹、随机粒子、圆形光晕或新的产品元素。动作自然，人物身份、服装和建筑结构全程不漂移。
```

### S03-P0.1 · Proven Edge

```text
@图片1作为视频第一帧与唯一视觉参考。严格保持图片中的黑色立体材质、方形节点、细线结构、teal 信号、近黑配色、微弱层次光和原始 16:9 构图，不新增人物或现实场景。

生成一个单一连续的 5 秒微距电影镜头，无切镜、无转场。相机只做非常缓慢、平稳的向前推进。现有的 teal 方形信号沿画面下方已有的细线向前移动；它经过的暗灰方点依次被校准并排列成一条精确但抽象的概率轨迹。轨迹不是普通金融 K 线，而是由离散判断留下的连续路径。主 teal 信号经过后，一个更小、更暗的来源节点只闪现一次，表明这条轨迹来自某个真实行动者；最后所有运动收敛并保持稳定。

画面中央 Hero 标题区域保持黑暗、稳定、低对比。不要生成坐标轴、图表网格、价格、百分比、头像、Profile Card、可读文字、数字、Logo、手机 UI、交易卡、ticker、蜡烛图、紫色霓虹、随机粒子、圆形光晕或新的产品元素。所有节点必须保持方形视觉语言，不要变成圆球。
```

### S04-P0.1 · Decision

```text
@图片1作为视频第一帧与唯一视觉参考。严格保持图中同一个人物的身份、短发、炭灰色长外套、侧后方机位、黑色现代空间、手机位置、材质、光线、近黑与低饱和 teal 配色，以及原始 16:9 构图。

生成一个单一连续的 5 秒电影镜头，无切镜、无转场。相机从人物侧后方做极慢、稳定的推进。人物手指只做一个很小、真实的确认动作，手机屏幕全程纯黑，不显示任何界面。图片中已有的 teal 方形信号沿现有细线靠近手机边缘，短暂停顿，然后从略微游移的状态迅速校准为一条笔直、被锁定的细线；确认完成后，只向空间外发出一次窄而克制的 teal 脉冲。这个动作表达“信号变成决定”，而不是展示 App 操作。

画面中央 Hero 标题区域必须保持黑暗、稳定、低对比。不要新增文字、数字、Logo、手机 UI、按钮、YES/NO、价格、交易卡、K 线、ticker、紫色霓虹、随机粒子、圆形光晕或新的产品元素。人物身份、手指数量、手机形状、服装和空间全程不漂移。
```

### S05-P0.1 · Share → Action → Value

```text
@图片1作为视频第一帧与唯一视觉参考。严格保持图片中的同一组人物、俯视黑色建筑空间、方形节点、细线路径、材质、光线、近黑与低饱和 teal 配色，以及原始 16:9 构图。右下方的主角节点是唯一的传播起点。

生成一个单一连续的 5 秒高位广角电影镜头，无切镜、无转场。相机只做极慢、平稳的向上拉远，人物和空间位置保持稳定。0–1.5 秒：右下方主角节点把一条 teal 判断信号沿已有路径向外发送，信号只分成三条清晰支路，表达一次分享。1.5–3.2 秒：三条支路分别到达三个下游人物节点，其中两个节点以一次短促的方形亮度变化回应，表示他们据此采取行动。3.2–5 秒：两条更细、更克制的 teal 价值脉冲沿原路径反向回到右下方起点，在起点旁依次形成三根极短的方形竖条，然后全部稳定。传播方向必须清楚可追踪：从一个人向外分享，其他人行动，价值再回到原点。

不要新增路线或增加网络密度，不要使用圆形 ripple。画面中央 Hero 标题区域必须保持黑暗、稳定、低对比。不要生成货币符号、金额、百分比、排名、可读文字、数字、Logo、手机 UI、Creator Dashboard、交易卡、紫色霓虹、随机粒子、圆形光晕或新的产品元素。所有信号节点保持方形，人物和建筑结构全程不漂移。
```

### S06-P0.1 · SmartX Network

```text
@图片1作为视频第一帧与唯一视觉参考。严格保持图片中的同一个人物、远景黑色网络空间、方形节点、细线路径、材质、光线、近黑与低饱和 teal 配色，以及原始 16:9 构图。

生成一个单一连续的 5 秒远景电影镜头，无切镜、无转场。相机从当前远景做非常缓慢、平稳的继续拉远。已有网络从右侧开始沿现有路径逐段点亮，依次连接到画面边缘，但不要新增节点、路线或网络密度。主角始终稳定站在空间中，最后缓慢抬起一部屏幕纯黑的手机。最后 0.5 秒，手机附近原本存在的一个 teal 方形信号轻微放大并向镜头靠近，为循环回到 S01 留出视觉接口；不要全屏闪白，也不要让它变成光球。精确 SmartX Logo 将在后期合成，不由模型生成。

画面中央 Hero 标题区域必须保持黑暗、稳定、低对比。不要生成任何可读文字、数字、Logo、假品牌符号、手机 UI、交易卡、K 线、ticker、更多人物、紫色霓虹、随机粒子、圆形光晕或新的产品元素。人物身份、服装和网络结构全程不漂移。
```

## 7. 限免生成前的执行步骤

1. 先确认 SB-B 的六幕职责和 15 秒时间分配，不讨论镜头里的小装饰。
2. 按本文件的 K1 审查结论制作六张 K2；优先解决 S01、S04、S05，S02、S03、S06只做必要修正。
3. 单独制作 `character-anchor.png` 和 `signal-language.png`，消除人物与信号漂移。
4. 把六张 K2 组成没有官网标题和按钮的 `SB-B-board.png`。
5. 对九张图做一次终审：人物一致、空间一致、中心安全、每帧职责不同、S05 方向可读。
6. 完成 `FULL-P0.1`，在即梦选择全能参考、16:9、720P、15 秒，只提交一次。
7. 结果保存为 `FULL_SB-B_R00_C01_seedance20mini_15s.mp4`，并回填本文件。

## 8. 资产目录与命名

建议把后续素材放在：

```text
output/hero-brand-film-lab/
  shot-01/
    round-00/
      S01_R00_C01_seedance25_5s.mp4
  shot-02/
    round-00/
      S02_R00_C01_seedance25_5s.mp4
      S02_R00_C02_seedance25_5s.mp4
      S02_R00_C03_seedance25_5s.mp4
  keyframes/
    S02_K2.png
  edits/
    E01_10s.mp4
  full-film/
    FULL_SB-B_R00_C01_seedance20mini_15s.mp4
```

命名规则：

```text
S{Shot}_R{Round}_C{Candidate}_{Model}_{Duration}.{ext}
```

不要使用 `final-final-2.mp4` 一类不可追踪命名。

## 9. 单个候选记录模板

复制下面的模板，为每个 Seedance 输出建立记录：

```markdown
### S02-R00-C01

- 日期：
- 模型 / 模式：Seedance 2.5 / First-frame I2V
- Source Keyframe：S02-K1
- Prompt：S02-P0.1
- 本轮唯一变量：无，Round 0 基线
- 输出文件：
- 评分：
  - 概念可读性：/25
  - 品牌区隔：/20
  - 人物与世界一致性：/15
  - Hero 安全区：/15
  - 镜头与运动质量：/15
  - 可剪辑与可循环性：/10
  - 总分：/100
- Hard Fail：无 / 有，说明
- 决策：Promote / Keep for reference / Reject
- 为什么：
- 下一轮只修改：
```

## 10. Current Best Board

| Shot | Story | Keyframe | Prompt | Video Current Best | 分数 | 下一步 |
| --- | --- | --- | --- | --- | ---: | --- |
| S01 Open SmartX | SB-C baseline | — | — | — | — | 评审状态合同：只建立手机与视线触发 |
| S02 The World Sorts | SB-C baseline | — | — | — | — | 评审状态合同：真实空间结构抽取为路径 |
| S03 See the Market | SB-C baseline | — | — | — | — | 评审状态合同：同一路径转为单一标的与 K 线 |
| S04 Person × Environment | PARTIAL | — | — | — | — | 低成本测试一种环境响应；人物始终是唯一注意力主体 |
| S05 Social Proof | OPEN | — | — | — | — | 测试 `Shared Trace`，固定观察环境证据；不制作正式成片资产 |
| S06 Reward → SmartX | PARTIAL · role locked | — | — | — | — | 可先生成干净手机 plate；奖励提示与 Logo 后期合成 |

## 11. Change Log

### 2026-08-25

- 建立实验台账；明确六个 Shot 和六张 K1 都不是定稿。
- 注册 Storyboard Hypothesis A、K1 关键帧和 P0.1 Seedance 提示词。
- 将“分享变现”明确为 S05 的 `Share → Action → Value Return` 因果链。
- 新增一次限免约束；暂停逐 Shot 首轮生成，改为 K2 定稿后生成一条 15 秒整片。
- 新增 Storyboard Hypothesis B 的 15 秒时间表、九图投喂包与整片 Prompt 骨架。
- 完成 K1 关键帧审查：S01、S04、S05 需要重构；S02、S03、S06 可作为 K2 基础。
- 新增 Opening Trigger V1：一张共享 Before，以及 A/B 两组 Trigger 与 After，共五张关键帧。
- A 测试“环境与信息共同响应”；B 测试“环境不变，只有噪音变清晰”。暂未晋级 Current Best。
- Opening Trigger V1 被明确判定为 Rejected：问题属于抽象符号假设失败，不进行光线、方块大小或动效层面的局部修补。
- 新增 Mountain Treatment V1：先用三张 Anchor 测试 `Lost → Find a verified path → Become the path`；初始状态为 Reviewing，未晋级 Current Best。
- 新增主人公候选 C1：29–33 岁东亚男性，深灰蓝针织 Polo 与宽松西裤，状态为 Reviewing，暂未替换山地测试中的临时人物。
- 新增主人公候选 C2：24–27 岁东亚男性，服装更轻、更松弛，以适配年轻 Meme-first 用户的审美；状态为 Reviewing。
- Mountain Treatment V1 因“艰难攀登”的情绪与品牌目标冲突，被标记为 Rejected as Tone；保留 `find a route → create a route` 的故事骨架。
- 新增 `Effortless Discovery` 情绪基线：环境为人物降低摩擦，人物以好奇、轻松的状态前进。
- 新增 C3 人物动态测试：C3-A 验证软质肩包与松弛行走；C3-B 只调整空间与出口光线，暂为该测试的 Provisional Current Best，尚未晋级正式人物锚点或关键帧。
- 新增 C3-C 表演迭代：只调整表情、视线、肩颈、手臂与步态，解决“职业形象照式端着”的问题；暂时取代 C3-B，但笑意是否过强仍待评审。
- C1–C3 因年龄感与精英化服装方向被停止；C3-C 不再作为 Current Best。新增 C4 简报：21–24 岁、无 Polo／技术西裤／手表，改为柔软 Overshirt、T 恤、休闲裤、日常球鞋与软质肩包。
- 新增 SB-C `Follow-Camera Content Draft`：借用 Robinhood 以近景／中近景持续 follow 人物的镜头语法，删除大远景网络与地球尺度结尾。
- 冻结十条镜头尺度原则：四段近中景、一个起点—终点纵深镜头、一个无人数据微距、统一运动方向、每段一个变化、UI 感低于 10% 且只在 S03 出现。
- SB-C 先只评审六段内容，不制作首尾帧；SB-B 的 K2、九图投喂包、长 Prompt 和单 Shot Prompt 全部暂停。
- 撤销以移动端纯 Demo 限制品牌片内容的错误方向：Demo 只可借用设计语言，不作为功能叙事或产品状态约束。
- 收紧 UI 边界：全片只有 S03 一次 UI-like moment，仅包含一个标的与一条 K 线／价格轨迹；S04、S05 的行动、传播、影响力与 value return 全部用 cinematic motion identity 表达。
- 将 S02 从固定的“背后仰拍建筑”改为更通用的起点—终点空间关系：近处人物、远处标志物与中间路径必须在同一纵深中成立；S03 由这条真实路径 match cut 成 K 线。
- SB-C 六段内容与镜头原则被接受为当前 Baseline；新增状态合同 V0.1，逐段锁定起始状态、唯一变化、结束状态和共享交接实体，仍未制作任何关键帧或 Prompt。
- 删除 SB-C 原 S04 的手机触碰／交易职责。S04 改为 `Follow the Path`：S03 的 K 线重新获得现实材质，人物沿同一条路径前进；传播与 value return 统一延后到 S05 `Your Path Travels`。
- S04 被定义为可合并的 bridge beat，而非必须独立存在的第六段功能；最终可采用六个叙事 beat、五次切镜。
- 根据最新评审撤销 S03 → S04 的强制材质 morph：S03 可独立结束，S04 改为新的 `Opinions in Motion` 行走镜头，以不同景深里的半透明 opinion 残影表达 social intelligence。
- 将“每个镜头必须共享实体”降级为局部工具：S02 → S03 可保留路径 match cut；S03 → S04、S05 → S06 允许依靠人物、方向、色彩、声音和节奏完成 editorial cut。
- S05 重新开放，不再假定 personal trace 网络或 value pulse。记录三个传播候选，当前优先 `The Camera Stays with the Opinion`；明确不采用插旗、横向 rail、网络总览和收益卡。
- S05 进一步排除“前后人物在同一路径追赶”的空间隐喻，避免排队、领袖跟随或赶路误读。新增领先方向 `Same Take, Different People`：同一 opinion 保持在画面中，人物与现实环境通过 match cut 变化。
- 将奖励结果从 S05 移到 S06：S05 只负责“被不同的人接收并回应”；S06 手机近景先显示一次后期合成的奖励提示，再落 SmartX Logo。Seedance 不负责生成任何文字、数字或 Logo。
- 撤回 `Same Take, Different People`：它仍在一个短段落中连续切换人物主体，不符合最新 attention discipline。新增硬规则：每镜只有一个注意力锚点，若主体改变必须明确切镜。
- S04 改为 Partial `Person × Environment`，S05 保持 Open。记录 `Shared Trace` 实验族：S04 只 follow 主人公与一个环境媒介产生关系；S05 固定观察同一媒介，通过连续脚步、涟漪或痕迹证明许多人参与。
- 新增 Lock Matrix V0.5 与并行生产队列：C4 人物／空间锚点和 S01–S03 先进入生成，S06 只生成干净 phone plate；S04／S05 在渲染等待期间继续低成本实验，不阻塞一次性 Seedance 长片。
- 完成 Wave A 工具无关提示词包：C4 face anchor → C4 body／walk anchor → clean space anchor。附独立验收条件、负向约束与可选 ComfyUI 工作流记录要求；尚未实际生成图片。
- 完成 C4 face anchor Round 00 四位候选并保存项目资产。初步判断：C01 综合品牌表现最好但年龄处于上沿；C03 年龄最明确但略偶像化；C04 最普通但表情偏平；C02 重新落入成熟精英感。尚未晋级 Current Best，等待人物选择后再生成 full-body anchor。
- 完成 space anchor Round 00 四张候选。C03 的尺度／黑位和 C04 的 teal／城市感可作为参考，但四张都因 `passage／route／opening` 提示词收敛成走廊，且输出为 3:2 而非 16:9；本轮无晋级，下一轮只改变空间拓扑。
- 用户选择并晋级 C04 face anchor；复制为稳定 identity reference，Round 00 原图保留。下一步只生成同一人物的 full-body／walk／wardrobe anchor，不重开选角。
- 完成 C4 body／walk anchor Round 00 四张同身份候选并归档。C02 的表情、肩颈和整体步态最好；C04 的月牙包与双手状态最好；C03 因手插口袋淘汰。暂不整张晋级，Round 01 只把 C04 包型与更短步幅替换进 C02，继续以已选 C04 portrait 作为最高优先级身份锚点。
- 用户确认 Round 00 C02 是最佳身体／表演方向，并新增三条硬规则：行走时绝不插兜、S02–S05 不拿手机、肩包不得影响姿势或行动；手机只在 S01 与 S06 出现。
- 完成 body Round 02：R02-C01 移除手机并清空双手；R02-C02 只把软包移动到身体侧后方，释放右臂摆动。R02-C02 成为 phone-free walking 的 Provisional Current Best，等待用户确认。
- 用户确认 R02-C02 成立，复制为稳定 `C4_BODY_WALK_ANCHOR_SELECTED.png`；人物 face 与 body 均正式晋级。
- 生成的 S01／S06 手机动作测试因侧前／正面视角被降级为 Rejected as Camera Direction。新增 Camera Angle Bible V0.1：只使用纯侧面、侧后 3/4、后肩／背面；正面与侧前 3/4 不进入最终分镜。下一步先审核四张实际需要的人物视角资产，再生成关键帧。
- 完成基础人物视角 A／B：A R01 为严格纯侧面并缩短到日常步幅；B R02 保留用户认可的步幅，只将脊柱、肩颈和头部调整得更自然挺拔。用户确认两张均成立，已复制为稳定 `SELECTED` 参考。
- 根据 Seedance 2.0 官方全能参考能力，撤销“六段都做首尾帧”的重资产方案。新增 Seedance Reference Plan V0.1：使用 face、side、rear 3/4、space、单张 shooting-script board 与 signal language 六件最小素材，直接测试 10 秒多镜头；首尾帧只作为失败后的局部修复工具。
- 完成空间 Round 01：A 为开放式 undercroft，解决 Round 00 的走廊拓扑并提供稳定 Hero 暗场，当前推荐为贪婪最优；B 为下沉庭院，只保留人尺度参考。两张均未晋级最终空间锚点，等待用户选择后再做单变量精修。
- 用户否决把 Round 01 A 当作 S02 画面基础：它只有开放空间，没有可读的近点—远点路线。S02 改为一个连续的后方跟随 → 升高 → 轻微拉远／俯倾揭示镜头，发现现实硬质铺装道路与偏侧建筑开口。
- S01 取消杂乱信息场，改为干净的短竖线／方形标记场；场本身固定，只有局部清晰波面跟随人物，以区别 Robinhood 的整片规则点阵平移。
- S04 改用当前 Consumer Network `Picked for you` 的真实 Opinion Card 原子组成半透明横向 Rail；S05 不再发明 Shared Trace，而是同一目标卡的弱选择与整组画面推进。二者均以后期合成，不让 Seedance 重绘文字和卡片。
- 新增并接受 [`Shooting Script V0.2`](../output/hero-brand-film-lab/shooting-script-v0.2.md)：六段时长、机位、Seedance clean plate 与确定性后期职责已分离。下一步只制作一张六格摄影调度板。
- 完成六格摄影调度板 R00 的确定性 SVG／PNG 导出：逐格标出 Hero 安全区、摄影机箭头、图形运动、Seedance clean plate 与后期职责；不使用写实生成图，也不写入未确认标的、数字、奖励声明或近似 Logo。当前进入视觉评审。
- 用户确认六格摄影调度板成立，正式晋级为 review board。派生 `SEEDANCE_CLEAN_PLATE_BOARD_V01`：只保留五个实际生成场景、摄影机、人物和负空间，删除点阵、K 线、Opinion Rail、选择状态、奖励和 Logo；S04／S05 共用一个连续三秒人物底片。
- 完成 `Seedance Run Package V0.2`：实际只上传 face、side、rear 和 clean-plate board 四张图；Prompt 明确五场景时间、角色／服装锁定、S02 升高揭示、S04 连续跟拍、S06 黑屏手机，以及全部 Hard Fails。等待用户在即梦使用一次限免。
- 将 R00 实际投喂素材复制到 `/Users/wuxiuchen/Downloads/同步空间/SmartX/剪辑/SmartX_Hero_Seedance_R00/`：`01_上传即梦` 仅含按顺序编号的四张上传图与 Prompt；评审板／SVG／脚本隔离在 `02_制作参考_不要上传`；原始视频应保存到 `03_生成结果放这里`。
