# SmartX 官网 V4 方案（当前主线）

> 状态：上线收口中，公开首页 `/`；`/v4` 仅作旧链接兼容跳转。本文件是 V4 的唯一权威文档
> 更新日期：2026-07-22
> 前身：`website-v4-design-brief.md`（初版简报，部分内容已被迭代推翻，以本文件为准）
> **与旧方案的关系**：V2 太空叙事与 V3 编辑化原型均为已废弃探索，只保留在 Git 历史与历史文档中，不进入生产源码和构建产物。
> 工作规则：仓库根 `AGENTS.md`（跨 Agent 设计优先级与反 Demo 约束）+ `CLAUDE.md`（Claude/Fable 动效与自审补充）

## 1. 定位与叙事（已签字）

- 主标语（与 Pitch Deck v8 同口径）：**"The AI Trading Terminal That Understands You"**（Hero 两行排版，"first" 放 lede）
- 官网唯一任务：**融资/可信度背书**，访客以投资人为主
- 证据策略：deck 无 traction 数字 → **产品真实度就是证据**（真实字段、真实 UI 结构、真实标签体系）
- 叙事骨架 = deck 的 AI Flywheel：Signals（信号快）→ Execute → Learn（Memory = compounding gap）→ All-in-one
- **内容红线**：不出现任何投资机构/导师名（YZi Labs 保密）；不强调 BNB；集成现状只有 Polymarket（Live），Predict.fun / Hyperliquid / Aster / bStocks / Ondo GM 标 Coming；News 信号产品未上线，官网不出现

## 2. 设计系统

**参照系**：particle.network——连续变形而非翻页、每章不同运动语法、抽象几何扛转场 + 真实产品 UI 扛内容、反海报式。

**色板**（源 smartx-fe-dev + 品牌片头）：
画布 `#0C1322` · 面板 `#172033` · 边线 `#1E293B` · 主色 teal `#08DFB5` · 对色 coral `#FF5D60`（只成对出现）· 文字 `#F1F5F9`/`#C8D3E8`/`#94A6C2`/`#71829E` · 地址橙 `#FFB86C`。产品标签类目色（Expert 蓝 `#6198FF` / Trading 金 `#FFB44D` / Status 青 `#23D6FF` / Behavior 紫 `#B561FF`）只用于产品语义元素。

**字体铁律**：PixelOperatorMono **700**（仅宣言与 logo，letter-spacing 0、line-height ~1）· Inter（一切阅读文本含 kicker/标签/按钮）· JetBrainsMono（仅数据/时间戳/地址，tabular-nums）· 11px 下限。

**形状语言**：切角容器（clip-path 斜切）、强调块 4px 左边线、圆角 ≤4px（手机框等产品描绘除外）、1px 边线。

**签名元素**：**像素抖动场**（Bayer 8×8 有序抖动，teal 单色）——目前仅作边缘纹理：右缘密度带（品牌片头构图引用）+ 底部过渡带 + 星尘级底噪，中央阅读区干净。装饰动效必须遵守像素网格语法（禁止自由角度线条/圆形粒子）。

**动效规范**：见 CLAUDE.md（emilkowalski skills 标准：强 ease-out `cubic-bezier(0.23,1,0.32,1)`、永不 ease-in、UI <300ms、入场永不 scale(0)、只动 transform/opacity、stagger 30-80ms、reduced-motion 必备）。

## 2.5 抽象图形与转场的硬验收条件（两轮评审合并，2026-07-21）

1. **语义映射强制**：每个抽象图形必须映射到真实字段、事件或产品状态；hash/随机生成的纯装饰形态禁止。评审时必须能回答"这个像素/线/带对应产品里的什么"。
2. **转场实体强制**：每个转场必须说明同一个实体从哪里来、变成什么（shared element 原则）；只有空间连续没有信息连续的缩放/位移不合格。
3. **激活质变强制**：交互激活态必须发生内容质变（展开真实产品证据/状态演化），不允许只有 3% 背景色 + 6px 位移级别的装饰性 hover。
4. **焦点即时**：`:focus-visible` 立即呈现，不复用 pointer hover 的 transition。
5. 每屏 authored line primitives ≤ 3；触屏下产品证据必须默认可见或有明确展开方式。

## 3. 桌面端逐屏 Storyboard（2026-07-21 用户线框签字版）

> 本节取代此前所有 `00 / Decision Trace`、`active stage + chapter rail`、
> `DiscoverRail` 与 Memory band 方案。Hero 后不再有独立 `00`；Thesis 直接并入 Index。

```text
Hero → Index / The system → 01 Signals → 02 Execute → 03 Learn
→ 04 All-in-one → Closing CTA → Updates → Footer
```

### Hero / Prologue（视觉冻结）

- 当前居中构图、标题、lede、CTA 与 navy/teal 气质保留。
- Hero 是独立序章，正常纵向离场，不缩小、不向左让位。
- idle 只允许边缘抖动密度发生极慢变化；标题与 CTA 的阅读状态保持稳定。首屏状态统一为 **Live alpha**。
- 主 CTA 统一使用 `Launch Alpha`；hover 使用箭头端的 teal 像素染色由右向左覆盖文字区，文案不替换，不增加第二套 CTA 状态。
- `Scroll` 提示的文字与箭头位置均保持静止；箭头仅在首次进入时做两轮低频明暗呼吸，随后停在稳定状态，避免无限循环与复位跳变；reduced-motion 下完全静态。

### Index / The system

- 左侧总论标题：**“Built around how you trade.”**；一句话解释 Signals、Execute 与 Memory 是同一条持续适应用户的链路。
- 右侧为有明确阅读顺序的 `2 × 2` 章节网格：

  ```text
  01 Signals     02 Execute
  03 Learn       04 All-in-one
  ```

- Signals 与 Learn 可获得更强视觉权重，但不得用位置打乱叙事顺序。
- Index 总命题和四个章节名使用低于 Hero 一级的展示字号；Hero 是全站唯一最大标题。
- 四格共用一套 EvidenceStage 语义像素层：默认态只保留低对比语义轮廓，不显示顶部 evidence 文案；hover/focus 后才显示真实证据摘要，并触发一次有终点的汇入、管线、记忆或 venue 路径。激活态必须与默认态形成明显质变，click 进入章节。
- Index 初次进入使用一次像素幕布揭示；文字不参与“粒子化”。

### 01 Signals → 02 Execute（同一个手机实体）

- 取消横向 Rail 与重复章节开场。Signals 使用稳定的一屏构图：左侧标题/开放式来源轨道，右侧真实 H5 产品切片；来源控件采用三列等宽的开放轨道，序号与文字在各自列内居中，选中线宽度稳定，不跟随文案长度跳变。
- 首版来源只有 **Smart money / Market / Watchlist**；News 产品未上线，不展示。
- 切换来源时必须改变信号、证据字段与产品状态，不做自动轮播和装饰性 carousel dots。
- Smart Money 的首要证据是交易者标签的**覆盖维度**，按领域专长、交易风格、历史战绩与行为特征组织；每类只展示代表性例子，不公开强调标签总数。Market 同样以 Momentum / Flow / Positioning 三个维度展示 Fast Move / Big Orders / Smart Money / OI Build Up / Volume Surge / Illiquid 等代表性事件，不让用户误以为 taxonomy 只有当前几项。Watchlist 的首要证据是可配置规则，包括价格阈值、1h/6h OI 或 Volume 变化、Radar signal 与跟踪钱包买入金额。
- Signals 与 Execute 共用同一台手机、同一个示例市场和同一组数值。滚动交接时手机从右侧移动到左侧，信号展开为图表、订单与成交；文案交叉衔接，不出现空窗，也不额外展示 01→02 的装饰性进度条。
- Execute 收敛为两条路径：**Recall & trade**（从 SmartX Signal / 用户 Alert 回到对应市场；Telegram 召回标 Coming）和 **Strategy follow**（用市场事件或 Smart Money 配置 Watchlist Rule；自动执行标 Coming）。两条路径共享同一台手机，但必须显示不同的真实产品状态，不能只替换说明文字。
- 产品录屏素材到位前，Signals 使用真实 2× H5 静态图：Smart Money 标签列表、Markets 事件标签列表、Watchlist Create Alert；Execute 的 Recall 使用真实 H5 market trade ticket，Strategy follow 使用真实 Watchlist Rules（价格、Radar signal、指标与钱包规则）。手机外壳只模拟 iPhone 系统层的状态栏、Dynamic Island、硬件按键与 Home Indicator；产品级顶部/底部导航必须来自真实 H5 截图，禁止在截图外再画一套近似图标或场景标签。所有截图使用同一屏幕 viewport，并完整显示底部导航或主 CTA。首版以双状态静态帧和轻量切换代替 MP4，素材到位后只替换手机屏幕内部，不改变外部布局与 shared-element 交接。

### 03 Learn / AI Memory

- 标题：**“It gets sharper every trade.”**；内容偏营销，解释四个维度的意义与用户价值，不展开算法机制。
- 沿用 `vc-demo` 的语义拓扑：中央 Memory core + 四个非对称 domain cluster：
  **Market interests / Trusted signals / Trading style / User edge**。
- 官网版保留核心与四个 domain，但先解释因果、再解释结构：右侧把 `Next Feed 队列 → Memory Reasoner → 四类变化 → 下一次排序改变` 画成一条闭合因果链。Reasoner 使用可循环的输入、拆解和输出动画，不再使用无语义随机像素团；四个 domain 以横向吸收器和微型状态图形呈现。
- Execute 的成交回执进入 Memory core，只触发本次真实相关的维度；不展示没有真实依据的综合分数。

#### Learn 动效：Memory nutrient loop（已确认、桌面版已实施）

目标不是画一条装饰性流水线，而是让同一个决策 packet 解释「为什么 SmartX 下一次会更懂用户」。共享实体始终有明确来源与去向，循环分五段：

1. **进入**：Next Feed 保持五项队列；第 05 位 packet 沿垂直管道进入 Memory Reasoner，原 01–04 立即下移补齐 02–05，并由一个低对比候选项补入 01，队列不能在处理期间留下空洞。
2. **消化**：Reasoner 点亮并把 packet 拆解为四路带有产品语义的“养料”：Market interests / Trusted signals / Trading style / User edge；分解先走共同主干，再沿四条可追踪支路进入对应吸收器，颜色只能复用各 domain 的既有语义色。
3. **消费**：养料沿分支进入四个维度。本次有真实依据的维度吸收并更新；无依据的维度只保持可见，不伪造变化。
4. **汇合**：已写入的信息在四个横向吸收器下方立即重新汇成一颗更精确的 packet；不增加底部压缩仓、第二处理阶段或额外仪表盘。
5. **回流**：packet 经右侧单向正交管道返回顶部，覆盖 Next Feed 第 01 位的低对比候选项；语义颜色逐格消散并落回普通 Feed 状态，不再用第二个对象替换，闭合 `feed → memory → rerank → next feed` 因果环。

实现合同：

- packet 必须跨五段保持同一身份；第 05 位的离队、Reasoner 内的拆解、底部重组与第 01 位的回填必须在几何上连续。第 01 位补位块作为静态底层持续存在，回流 packet 只在其上完成一次语义着色与消散，不允许中途替换为随机粒子雨或额外 settled 对象。
- 阅读窗口以静止为主：首次进入完整播放一次，之后只允许低频慢循环；hover 只用于查看四个维度，不接管主循环。
- 运动只用 `transform / opacity`，路径使用像素网格与正交管线；不增加自由角度轨迹、发光圆晕或无终点漂浮。
- `prefers-reduced-motion` 下保留静态方向、四维写入状态和 `Next time` 结果，不播放回流。
- 四个维度固定从左到右平铺：Interest / Signal 吸收并增加语义像素，Style 记录行为轨迹，Edge 保持 pending；不得为了画面热闹伪造四项同时更新。
- 若完整回流的工艺在收口阶段仍不稳定，降级为「packet 在底部汇合 → Next feed 第 01 位点亮」；语义完整性优先于强行动效。

### 04 All-in-one

- 固定 `3 × 2` 六项布局：Polymarket（Live）+ Predict.fun / Hyperliquid / Aster / bStocks / Ondo GM（Coming）。
- 六项置于开放品牌场域，不使用六张等权卡片；标题使用单行 **“Every venue. One terminal.”**，删除重复解释型副标题。整个品牌场在一屏内垂直居中；SmartX intelligence layer 与六个 venue 全部采用严格居中轴，平台节点统一为「图标在上、名称/品类/状态在下」，由一条无标签的横向 spine 建立共同关系。
- 每项以复用自 SmartX 产品原型的真实平台图标、名称、品类和状态为主；不再绘制近似 logo，也不堆长描述。
- Polymarket 的 Live 状态必须比 Coming 更完整、更明确，但六项仍保持同一结构体系。

### Closing CTA / Updates / Footer

- Closing：kicker 使用 **“Live on Polymarket”**，主标题 **“Trade with a terminal that gets sharper with you.”**；删除与 CTA 重复的 “Start with SmartX” 正文。主 CTA `Launch Alpha`，次入口 `Read the docs`。
- Updates 固定三篇文章版式：第一篇带封面、后两篇为编辑式文本行；数据接口固定为 `category / date / title / excerpt / cover / url`。当前展示 SmartX 官方 Medium 最新三篇，文章分别跳转对应详情，`See all` 跳转 `https://medium.com/@smartxofficial`；后续官网 Blog 列表页与详情页上线后，只替换数据来源和链接，不改变版式。
- Footer 保持常规导航、社交入口、Terms of Service 与 Privacy Policy，并以低对比灰色超大 `SMARTX` 字标收尾；移除无叙事价值的通用风险句。
- Closing Banner 使用低对比 intelligence rail；三条离散 packet 在移动中收束为一条更窄的输出，直接表达 “gets sharper”。Closing 主 CTA 与 Hero 共用同一套右向左染色逻辑：箭头区默认 teal、箭头不位移。Hero / Closing CTA、Docs、页眉与 Footer 的真实链接都必须有清晰 hover/focus 状态，非交互文案不制造虚假点击暗示。
- Updates 使用开放式编辑排版：首篇保留 4px 统一圆角的大封面，后两篇用单条分隔关系而不是完整线框卡片；三篇都显示日期并使用真实文章链接，hover 只做封面轻微收紧、标题与分类短线响应，不额外增加卡片箭头。

### 图形交接合同

| 交接 | 必须持续存在的实体 | 状态变化 |
| --- | --- | --- |
| Hero → Index | 无 | Hero 正常离场，Index 像素幕布揭示 |
| Index → Signals | Signals 的命中事件 | Index 预览成为 H5 中第一条信号 |
| Signals → Execute | 同一台手机 + 同一市场 | 信号详情展开为图表、订单与成交 |
| Execute → Learn | 成交回执 | 回执进入 Memory core，相关 domain 响应 |
| Learn → All-in-one | Memory core | 核心退为 intelligence layer，六个 venue 状态出现 |
| All-in-one → Closing | Polymarket Live 状态 | Live 路径收束为 Launch Alpha 行动 |

### 桌面优先、移动端后置

- 当前只实现并验收桌面端；移动端在桌面整站成立后单独编排。
- 手机内容本身可响应，但桌面章节动效不直接机械缩放为移动版。
- reduced-motion 在桌面阶段同步实现。

## 4. 当前实现状态

| 章节 | 状态 | 说明 |
| --- | --- | --- |
| **Hero / Prologue** | ✅ 视觉冻结 | 保留当前版 |
| **Index** | 🟡 精修待签字 | 默认态取消假激活与无效 evidence；hover/focus 后显示证据摘要并强化对应像素状态，其他章节同步降噪 |
| **01 Signals** | 🟡 精修待签字 | 手机缩小并只保留系统 chrome，产品导航来自真实截图；三列来源轨道等宽居中；不公开标签数量 |
| **02 Execute** | 🟡 精修待签字 | 文案已收敛为两条路径；Recall 使用真实交易票据，Strategy follow 使用真实 Watchlist Rules，自动执行能力明确标 Coming |
| **03 Learn** | 🟡 精修待签字 | 已用 Memory nutrient loop 替换文字型 profile register：四维横向吸收、底部立即汇合、右侧单向回流并改变下一次 Feed 排序 |
| **04 All-in-one** | 🟡 精修待签字 | 单行标题，删除冗余副标题与 spine 标签；intelligence layer 与六个平台保持统一居中轴 |
| **Closing / Updates / Footer** | 🟡 精修待签字 | Banner packet 汇流表达 “gets sharper”，CTA 与 Hero 同构；Updates 已接官方 Medium 最新三篇与 `See all` 外链；Footer 法务入口保留 |

桌面首版已在 `1440 × 900` 浏览器逐屏验收，并完成 motion review、章节锚点和 `prefers-reduced-motion` 降级验证。

### 正式发布合同

- 唯一可索引页面为 `/`；`/v4/` 只保留同源兼容跳转且声明 `noindex`，V3 与内部 stage preview 不进入生产路由。
- 构建产物是 `.next-build/` 静态站点：`npm run build` 生成，`npm start` 只用于本地预览。生产环境直接发布该目录，不运行 `next dev`。
- Google Search Console verification meta 必须长期保留；`robots.txt`、`sitemap.xml`、Open Graph 图片和自定义 404 随构建生成。
- CDN/静态托管层上线时必须验证安全响应头：CSP、`X-Content-Type-Options: nosniff`、点击劫持防护、`Referrer-Policy` 与适用的 `Permissions-Policy`。这些响应头不由静态页面本身代替。
- 托管层若支持重定向，优先把 `/v4/*` 配置为指向 `/` 的 308；仓库中的客户端跳转仅作为跨平台兜底。
- 当前移动端只保证内容不丢失、不横向裁切和 reduced-motion 可用；桌面签字后再做独立的移动端构图，不把安全降级视为移动端定稿。

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
src/app/page.tsx                 V4 公开首页组装
src/app/v4/page.tsx              旧链接兼容跳转
src/components/v4/
  hero.tsx                       Hero（滚动进度 + CTA）
  dither-field.tsx               签名抖动场（Canvas 2D）
  story-page.tsx                 Index 之后的桌面叙事与交互状态
  story-page.module.css          V4 叙事与交互样式
  evidence-stage.tsx             Index 四章的语义像素预览
  closing-field.tsx              Closing 的离屏暂停像素流场
  footer-wordmark.tsx            Footer 字标聚合动效
  v4.module.css                  Hero 与共享 tokens
共享：memory-demo fixture/types、smartx-links
```

## 7. TODO（用户已定方向）

1. 按 Index → Signals/Execute → Learn → All-in-one → Closing/Updates 的顺序逐屏评审并冻结桌面构图。
2. 用真实产品录屏、最终官方 venue SVG 与运营文章替换现有素材槽；替换不得改变已签字结构。
3. 桌面整站签字后再做移动端专项；随后完成大屏（>1600px）与无障碍完整 pass。

## 8. 事实依据（三份蒸馏报告要点存档）

- **Pitch Deck v8**：定位 "The first AI trading terminal that understands you"；故事线 All-in-one 过载 → 个性化层空位 → AI Flywheel → compounding gap 护城河；竞品是 AI 终端不是 Polymarket；无 traction 数字。
- **smartx-fe-dev**：色板/字体/切角/4px 左边线/标签体系/图表形态的唯一真源；移动端完整（xl 断点分树）。
- **品牌素材**：像素抖动渐变是最独特资产；设计分析 PDF 实测旧灰字对比度 Lc −42.8 不达标（V4 正文用 `#C8D3E8` 修正）；等宽滥用是旧物料主要弱点（V4 字体铁律修正）。
