# SmartX 官网 V4 设计简报

> 状态：已签字（2026-07-21），主标语 understands you；不做背书叙事；猫头鹰仅页眉字标
> 日期：2026-07-21
> 输入：Pitch Deck v8 / smartx-fe-dev 产品 UI / 设计分析 PDF / 品牌片头素材 / particle.network 参照 / 用户四项决策
> 替代：V2 太空叙事、V3 编辑化原型的全部视觉方案（可复用零件见文末）

## 1. 定位与任务

- **一句话**（Pitch Deck v8 原话，官网与融资材料统一口径）：
  **"The first AI trading terminal that understands you."**
- **官网唯一任务**：融资/可信度背书。访客画像以投资人为主。
- **关键约束**：deck 无可用 traction 数字（Traction 页全部"待补充"）→ **官网的证据只能是产品真实度本身**。每一屏都必须让人觉得"这产品是真的、能跑、有细节"。
- **叙事骨架直接采用 deck 的 AI Flywheel 四环**（官网章节 = 融资故事章节，投资人看完官网再看 deck 无缝衔接）：
  Discover（信号快）→ Execute（看懂并下单）→ Review / Learn（Memory 飞轮 = 护城河）→ BNB-native & Roadmap。
- 第一证明点（用户已定）：**信号快**——"SmartX called it early"，用真实时间戳讲。

## 2. 参照系：particle.network 手法映射

| Particle 的手法 | 我们的落法 |
| --- | --- |
| 一个几何母题（三角形）贯穿全站变形 | **像素抖动（pixel-dither）母题**贯穿：品牌片头的"密度梯度像素场" |
| 滚动=同一世界连续变形，非翻页 | 抖动场是全站底层介质：噪声→聚成信号→散开→重组为下一章 |
| 每章不同运动语法（横移/缩放/视差） | 四章四语法（见 §5），杜绝海报式重复 reveal |
| 抽象几何扛转场，真实产品 UI 扛内容 | 抖动场扛转场；SignalProCard/移动端市场页/聪明钱卡扛可信度 |
| 黑底白字一条渐变，排版即装饰 | 深 navy 底 + 薄荷绿一条主光，等宽只给数据 |

**反目标**：海报式（全屏口号堆叠 + 同款 fade-in）；需要学习的隐喻（行星/流星）。

## 3. Tokens（全部来自产品与品牌真实资产）

**色板**（源：smartx-fe-dev tailwind + 片头素材）
- 画布：`#0C1322`（产品同款深 navy）；面板 `#172033`；分割线 `#1E293B`
- 品牌主色：`#08DFB5` teal（信号/买/正向/主光）
- 语义对色：`#FF5D60` coral（卖/负向）——只成对出现，不做装饰
- 类目色（产品标签体系原样）：Expert 蓝 `#6198FF` / Status 青 `#23D6FF` / Trading 金 `#FFB44D` / Behavior 紫 `#B561FF`
- **对比度硬约束**：正文文字必须过 APCA 正文档（现有产品灰字 Lc −42.8 不达标，官网不得复制这个错误）

**字体（铁律，修正产品的等宽滥用）**
- Display：PixelOperator 像素体——仅章节宣言与 logo 字标
- 阅读：Inter/系统无衬线——标题、正文、kicker、标签（对比度达标色）
- 数据：JetBrainsMono + tabular-nums——仅数字、价格、时间戳、地址

**形状语言（产品独有，直接继承）**
- clip-path 切角容器（产品 `clip-path-sm/md/lg`）
- 强调块左侧 4px 粗边（产品交易面板语法）
- 圆角 ≤4px，1px `#1E293B` 边线

## 4. 签名元素：像素抖动场（Pixel-Dither Field）

品牌片头右侧的"像素密度梯度"升级为全站签名：
- **Hero**：满屏稀疏抖动噪声（= 市场噪声），滚动/入场时密度向中心聚拢，**凝结成一张真实的 SignalProCard**——"从噪声中看见信号"一镜完成品牌+产品+定位三件事。
- **章节转场**：上一章内容溶解为像素散点 → 沿滚动方向流动 → 聚成下一章的容器。技术上是 Canvas 2D 粒子（廉价、可打磨到完美），不需要 WebGL 重炮。
- 抖动场只有 teal 单色 + 密度变化，永不使用多色，保持"高级=克制"。

## 5. 章节编排（四章四语法）

| 章 | 内容 | 运动语法 | 产品证据 |
| --- | --- | --- | --- |
| 00 Hero | 定位句 + 抖动场凝结成信号卡 | 密度凝聚（入场编排） | 真实 SignalProCard 单条 |
| 01 Discover — "Called it early" | 信号快证明：信号时间戳 vs 市场反应时间轴 | **横向**：时间轴横移擦洗 | 信号卡 + 真实字段（Buy +$X on Yes @ ¢ · since signal ↗） |
| 02 Execute — 看懂即下单 | 证据附着价格 + 一键执行 | **缩放推进**：zoom 进手机框 | smartx-fe-dev 移动端市场详情页（图表+吸底交易 sheet） |
| 03 Learn — The compounding gap | AI Memory 四维 + 飞轮 = 护城河叙事 | **视差展开**：飞轮四环逐环点亮 | Memory 雷达图 + vc-demo 宇宙（收敛使用） |
| 04 All-in-one | 资产扩张：Polymarket（Live）→ Predict.fun / Hyperliquid / Aster / bStocks（Coming） | 静（编辑式，动效停止） | 集成状态墙，以产品为中心 |

每章结构统一：宣言（像素体）→ 一句 lede（Inter）→ 产品证据（真实 UI）→ 数据注脚（mono）。

## 6. 工艺底线（三轮 audit + 设计分析 PDF 沉淀）

- 11px 字号下限；正文对比度达标；一屏一个判断
- 阅读时运动停止；所有链接真实；未来能力（Memory/Perps/TradFi）标注状态
- 1280px 容器居中，大屏留白对称
- reduced-motion：抖动场退化为静态渐变

## 7. 流程

1. 本简报签字
2. **只做 Hero + 第一转场**（抖动场凝结成信号卡 → 溶解流向 01 章）至满意
3. 逐章扩散（每章单独验收）
4. Playwright 截图回归 + skill 复审

## 8. 可复用零件清单

lightweight-charts 封装（area 形态）、Memory 3D 场景与雷达、市场/信号 fixture、TradeMemoryEvent 契约、smartx-links UTM 工具、ExperienceMotion reveal、visual-motion-spec 的字阶与发光预算原则。V2 叙事版整站保留于 `/` 作对照，V4 在新路由开发。

## 9. 已拍板决策与保密约束

1. 主标语锁定 v8 口径："The first AI trading terminal that understands you."
2. **不做背书叙事**：不强调 BNB；**YZi Labs 投资不得在官网出现（保密）**；导师/机构名一律不提。
3. 04 章为产品中心的 All-in-one 资产扩张：Polymarket（Live）→ Predict.fun / Hyperliquid / Aster / bStocks 链上股票（Coming）。
4. 猫头鹰仅页眉字标，Hero 主角是抖动场与信号卡。
