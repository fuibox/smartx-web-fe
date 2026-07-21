# SmartX 官网 V4 方案（当前主线）

> 状态：开发中，路由 `/v4`，本文件是 V4 的唯一权威文档
> 更新日期：2026-07-21
> 前身：`website-v4-design-brief.md`（初版简报，部分内容已被迭代推翻，以本文件为准）
> **与旧方案的关系**：V2 太空叙事（`website-v2-space-narrative-design-intent.md`、`website-v2-frontend-architecture.md`、`visual-motion-spec.md`）为已废弃方向，保留于 `/` 路由作对照，其文档不再更新；V3 编辑化原型（`src/components/v3/`）为已废弃探索。
> 工作规则：仓库根 `AGENTS.md`（跨 Agent 设计优先级与反 Demo 约束）+ `CLAUDE.md`（Claude/Fable 动效与自审补充）

## 1. 定位与叙事（已签字）

- 主标语（与 Pitch Deck v8 同口径）：**"The AI Trading Terminal That Understands You"**（Hero 两行排版，"first" 放 lede）
- 官网唯一任务：**融资/可信度背书**，访客以投资人为主
- 证据策略：deck 无 traction 数字 → **产品真实度就是证据**（真实字段、真实 UI 结构、真实标签体系）
- 叙事骨架 = deck 的 AI Flywheel：Signals（信号快）→ Execute → Learn（Memory = compounding gap）→ All-in-one
- **内容红线**：不出现任何投资机构/导师名（YZi Labs 保密）；不强调 BNB；集成现状只有 Polymarket（Live），Predict.fun / Hyperliquid / Aster / bStocks 标 Coming

## 2. 设计系统

**参照系**：particle.network——连续变形而非翻页、每章不同运动语法、抽象几何扛转场 + 真实产品 UI 扛内容、反海报式。

**色板**（源 smartx-fe-dev + 品牌片头）：
画布 `#0C1322` · 面板 `#172033` · 边线 `#1E293B` · 主色 teal `#08DFB5` · 对色 coral `#FF5D60`（只成对出现）· 文字 `#F1F5F9`/`#C8D3E8`/`#94A6C2`/`#71829E` · 地址橙 `#FFB86C`。产品标签类目色（Expert 蓝 `#6198FF` / Trading 金 `#FFB44D` / Status 青 `#23D6FF` / Behavior 紫 `#B561FF`）只用于产品语义元素。

**字体铁律**：PixelOperatorMono **700**（仅宣言与 logo，letter-spacing 0、line-height ~1）· Inter（一切阅读文本含 kicker/标签/按钮）· JetBrainsMono（仅数据/时间戳/地址，tabular-nums）· 11px 下限。

**形状语言**：切角容器（clip-path 斜切）、强调块 4px 左边线、圆角 ≤4px（手机框等产品描绘除外）、1px 边线。

**签名元素**：**像素抖动场**（Bayer 8×8 有序抖动，teal 单色）——目前仅作边缘纹理：右缘密度带（品牌片头构图引用）+ 底部过渡带 + 星尘级底噪，中央阅读区干净。装饰动效必须遵守像素网格语法（禁止自由角度线条/圆形粒子）。

**动效规范**：见 CLAUDE.md（emilkowalski skills 标准：强 ease-out `cubic-bezier(0.23,1,0.32,1)`、永不 ease-in、UI <300ms、入场永不 scale(0)、只动 transform/opacity、stagger 30-80ms、reduced-motion 必备）。

## 3. 桌面端逐屏 Storyboard（当前签字结构）

整体顺序：

```text
Hero / Prologue
→ 00 / Thesis
→ Index / Chapter Directory
→ 01 Signals
→ 02 Execute
→ 03 Learn
→ 04 All-in-one
→ Closing CTA
```

### Hero / Prologue（视觉冻结）

- Hero 是独立的序章，不属于 `00`，当前首屏构图、标题、lede、CTA 与 idle 气质保持不变。
- Hero 离场时不缩小、不向左让位；它按正常纵向滚动离开 viewport。
- 只允许使用底部抖动带作为 Hero 与第二屏之间的接缝，不提前露出 Index，不为衔接重做 Hero。

### 00 / Thesis — Decision Field（方向已签，文案待定稿）

- `00` 是全新的第二屏，可以且应当与 Hero 使用不同构图；只继承 navy/teal、PixelOperator 和像素抖动语法。
- 工作文案：**"BUILT AROUND HOW YOU TRADE."** 最终 copy 在实现前单独确认。
- 这一屏解释 Hero 的 "understands you" 如何成为系统：Signals、Execute 与 Memory 不是三个孤立功能，而是一套持续适应用户的决策系统。
- 视觉主角是非对称的像素密度带 / 决策指纹，不放产品卡片，不复刻 Particle 的圆环。
- 初始状态完整占据一屏并留出稳定阅读窗口；只有进入本屏后半段才开始缩小与左移。

### 00 → Index（Particle 式核心 sticky 场景）

- 桌面容器目标长度 `260–300vh`，内部 `100vh sticky`；Hero 不参与这段 transform。
- `0–30%`：Decision Field 与 thesis 完整停留，画面基本静止。
- `30–70%`：Decision Field 作为一个整体缩小并移动到左侧，像素轴向延展，建立 Index 的空间原点。
- `55–100%`：Index 从右侧进入；运动只使用 transform/opacity，并与滚动直接绑定。
- Index 使用无圆角卡片背景的 **1+3 建筑式网格**：Signals 占左侧半屏；Execute / Learn / All-in-one 在右侧纵向三等分。
- 默认状态只出现超大章节名和一句 outcome；hover/focus 才显示真实产品切片。分割依靠 1px 线、比例和留白，不做等权卡片墙。
- 离开 Index 时，Signals 区域扩展为全屏并成为 `01 Signals` 的起点。

### 后续章节

| 章节 | 本屏唯一判断 | 桌面端运动语法 | 与下一屏交接 |
| --- | --- | --- | --- |
| **01 Signals** | SmartX 持续发现值得关注的变化 | 横向 pinned 轨道；每个 viewport 只讲一种信号，真实产品切片主导，营销文字退居次要 | 最后一张信号实体转化为 Execute 的市场详情入口 |
| **02 Execute** | 从信号到下单不丢失上下文 | `220–260vh` 缩放推进：信号附着到图表，进入真实市场页，交易 sheet 上推并完成下单 | 成交结果转化为一条 Memory event |
| **03 Learn** | 每次交易都会改善下一次推荐 | 分层/视差累积：交易记录逐步组成四维 Memory profile；不使用旋转飞轮或轨道 | Memory 外框扩展为 Venue 状态墙 |
| **04 All-in-one** | 同一套理解能力扩展到更多市场 | 动效刻意停止，以大排版和集成状态墙形成节奏反差 | 状态墙像素化并收束到 Closing CTA |
| **Closing CTA** | 现在进入 SmartX | 像素场重新聚拢为品牌字标或 CTA 容器；一个主 CTA、一个次级入口 | 极简 Footer；没有真实文章 permalink 时不展示 Journal |

### 桌面优先、移动端后置

- 当前轮次只实现并验收桌面端；桌面整站成立后再启动移动端专项。
- 移动端最终采用独立编排：Hero 保留、00 静态展示、Index 改 accordion、pinned 章节改为纵向状态序列。
- 桌面实现仍需保持内容结构与动效层解耦，避免未来只能机械缩放桌面版本。
- reduced-motion 在桌面阶段同步实现，不属于移动端延期范围。

## 4. 当前实现状态

| 章节 | 状态 | 说明 |
| --- | --- | --- |
| **Hero / Prologue** | ✅ 视觉冻结 | 当前首屏保留；仅补充正常离场与第二屏边界接缝 |
| **00 / Thesis** | ⬜ 待实现 | Decision Field 桌面原型 |
| **Index** | ⬜ 待实现 | `1+3` 目录与 Signals 扩展交接 |
| **01 Signals** | ⚠️ 有素材 | 当前 pinned 轨道作为内容素材保留，视觉与节奏待逐屏精修 |
| **02 Execute** | ⚠️ 有素材 | 产品 UI 与文案待真实性校对和 pinned 编排 |
| **03 Learn** | ⚠️ 有素材 | Flywheel/Memory 素材保留，最终构图与累积语法待定 |
| **04 All-in-one** | ⚠️ 有素材 | 状态与内容正确，视觉精修待定 |
| **Closing / Footer** | ⚠️ 有素材 | CTA 与 Footer 待重组；Journal 仅在真实 permalink 齐备时启用 |

## 5. 已废弃的实验（勿重做）

- Hero 放真实信号卡（用户读不出"噪声凝聚成信号"的语义，首屏要气势不要数据卡）
- 满屏抖动介质 + 圆形凝聚体（视觉污染 + 语义不明）
- 标题弧光扫过、像素脉冲串（风格/价值不成立，撤除）
- "Called it early" 标题 + 测量时间轴（不像官网文案；横向滚动本身即时间轴）
- 像素字体 400 字重（必须 700）
- CTA 切角样式（用原 smartx.io 双段按钮）
- 全站产品 token 教条（只有产品 UI 切片需要保真，外壳守品牌色即可）

## 6. 组件地图

```text
src/app/v4/page.tsx              页面组装
src/components/v4/
  hero.tsx                       Hero（滚动进度 + CTA）
  dither-field.tsx               签名抖动场（Canvas 2D）
  discover-rail.tsx              01 横向轨道（GSAP pinned）
  sections.tsx                   02/03/04 + Journal/Footer
  signal-card.tsx                SignalProCard 复刻（当前未挂载，留作素材）
  v4.module.css                  全部样式（tokens 在 .page 上）
共享：v3/memory-radar.tsx（雷达）、product-demo fixture、smartx-links
```

## 7. TODO（用户已定方向）

1. **仅做桌面原型：Hero → 00 → Index**。Hero 不改构图，先验证独立第二屏、sticky 缩放左移和 `1+3` Index 的整体关系。
2. 00/Index 签字后，按 01 Signals → 02 Execute → 03 Learn → 04 All-in-one → Closing 顺序逐屏实施与验收。
3. 使用已安装的 improve-animations / review-animations skill 做每屏动效审计；阅读窗口必须稳定。
4. 桌面整站验收后再做移动端专项；随后完成大屏（>1600px）与无障碍完整 pass。

## 8. 事实依据（三份蒸馏报告要点存档）

- **Pitch Deck v8**：定位 "The first AI trading terminal that understands you"；故事线 All-in-one 过载 → 个性化层空位 → AI Flywheel → compounding gap 护城河；竞品是 AI 终端不是 Polymarket；无 traction 数字。
- **smartx-fe-dev**：色板/字体/切角/4px 左边线/标签体系/图表形态的唯一真源；移动端完整（xl 断点分树）。
- **品牌素材**：像素抖动渐变是最独特资产；设计分析 PDF 实测旧灰字对比度 Lc −42.8 不达标（V4 正文用 `#C8D3E8` 修正）；等宽滥用是旧物料主要弱点（V4 字体铁律修正）。
