# SmartX 官网 V2：市场宇宙叙事设计意图

> 状态：方向已确认，Motion Lab 核心验证已通过，待正式首页整合  
> 更新日期：2026-07-14  
> 适用范围：SmartX 官网首页 V2 设计、动效和前端实现  
> 替代关系：替代此前以静态信号脊柱和独立功能屏为主的 Scene 02-05；现有首屏保持不变
> 前端架构：`docs/website-v2-frontend-architecture.md`  
> 技术决策：`docs/adr/001-motion-runtime-and-spike.md`

## 1. 背景

SmartX 官网不是产品说明书，也不承担完整介绍所有功能的任务。首页需要让第一次接触 SmartX 的用户快速形成三个判断：

1. SmartX 能比普通市场工具更早发现值得关注的变化。
2. SmartX 不只展示价格，还能解释变化背后的证据和上下文。
3. SmartX 能把洞察带到交易，并在未来从真实交易行为中形成 AI Memory。

当前产品阶段以发现、分析和交易链路为主；个性化 AI Memory 属于未来方向。未来能力必须由交易行为驱动，不能被表达成脱离交易的内容推荐系统。

## 2. 核心设计命题

官网 V2 使用一条连续的空间叙事表达 SmartX 的产品价值：

> 在庞杂的市场宇宙中发现异动，沿信号找到对应市场，理解异动原因，进入真实产品完成交易，最终让每一次交易成为 SmartX 学习用户的依据。

页面的高级感主要来自镜头连续性、空间尺度、信息出现时序和真实产品能力，而不是更多发光装饰、卡片或文字。

核心产品叙事：

```text
SEE THE MOVE -> KNOW THE WHY -> MAKE THE TRADE -> BUILD YOUR MEMORY
```

## 3. 隐喻映射

所有宇宙元素都必须具有明确的数据含义，不允许沦为无意义的科幻背景。

| 视觉对象 | 产品含义 | 设计要求 |
| --- | --- | --- |
| 宇宙 | 整个预测市场世界 | 表达机会众多、信息复杂，不表现为普通星空壁纸 |
| 行星 | 一个具体的预测市场 | 可被观察、分析和交易，是场景中的稳定对象 |
| 流星 | 某个市场正在发生的异动或信号 | 速度、颜色、亮度和尾迹需要映射真实信号属性 |
| 流星轨迹 | 信号的来源、方向和影响市场 | 负责把“发现异动”自然带到“选中市场” |
| 行星轨道与资源层 | 资金流、Smart Money、新闻、成交量和市场上下文 | 用轨道、刻度、引线和读数表达，避免卡片环绕 |
| 坐标网格 | SmartX 的分析框架 | 从首屏延伸到宇宙，并最终变形为产品图表坐标系 |
| 交易脉冲 | 一次已发生的用户交易行为 | 作为进入 AI Memory 的因果连接，不是装饰粒子 |

重要语义约束：流星代表信号，行星代表市场。选中流星后，镜头沿其轨迹找到受影响的行星；两者可以在命中时共用同一空间锚点，但不能把流星本体解释成行星。

## 4. 页面结构

页面信息结构保持七个内容节点，但视觉上应组织为四个连续章节，避免七个彼此割裂的屏幕。

### Chapter A：进入市场宇宙

1. Hero：保持当前首屏设计和核心内容不变。
2. Universe / See the Move：网格向前加速，进入市场宇宙并发现多条异动信号。

### Chapter B：锁定并理解市场

3. Planet Inspection / Know the Why：锁定一条信号，沿轨迹抵达对应市场，逐层展开证据。

### Chapter C：进入产品并交易

4. Product / Make the Trade：从行星分析坐标系连续变形到真实市场详情页，完成一笔模拟交易。

### Chapter D：交易形成记忆

5. AI Memory：交易行为进入 Memory，用户可查看不同记忆维度及其含义。
6. Updates：退出沉浸式场景，进入克制、编辑式的信息阅读区。
7. Footer：安静、平面、功能化地结束页面。

## 5. 分镜与关键交互

### Scene 01：Hero（保持不变）

- 保留当前首屏的品牌识别、网格语言、主文案和主要交互。
- 首屏不能像独立封面；底部网格需要为下一幕的纵深运动预留连续性。
- 页面可以隐藏视觉滚动条，但必须保留原生滚动能力。

### Scene 02：Forward Into the Universe

- 用户滚动后，首屏网格不是淡出，而是向视窗深处快速移动。
- 网格线在透视中被拉长，逐渐成为信号轨迹和星体坐标。
- 品牌文案减少，视野扩大，让用户感受到从界面进入市场空间。
- 首次出现 `SEE THE MOVE`，不同时展示长段说明。

### Scene 03：Meteor Field

- 多条流星信号从不同距离和方向掠过，表达市场中同时存在的异动。
- 信号类型可以包含 Fast Move、Smart Money、Big Orders 和 News Catalyst。
- 颜色、速度、尾迹长度和粒子密度必须具有语义，不能随机。
- 滚动自动把一条目标信号带到视窗中心；此阶段不要求用户点击，以免打断叙事。

### Scene 04：Target Lock

- 目标流星进入克制的锁定框，其他信号降低亮度和速度。
- 镜头沿目标轨迹加速前进，逐渐看到它指向的市场行星。
- 锁定过程应表达 SmartX 从噪音中筛选出值得关注的机会。

### Scene 05：Planet Inspection / Know the Why

- 镜头围绕目标市场建立稳定观察视角。
- 证据按因果顺序逐项出现，不在同一时刻铺满屏幕。
- 建议首版只展示四个一级维度：
  - Fund Flow
  - Smart Money
  - News Catalyst
  - Market Context
- 二级指标可包含成交量、OI、概率变化、相关市场和时间敏感度，但不扩大为完整说明书。
- 信息形态优先使用轨道、扫描弧线、引线标签、刻度和小型读数；避免一圈悬浮卡片。
- 基础轨道保持完整闭环；通过透明度、线宽、颜色和移动标记区分数据层，不再用缺口制造层级。
- `KNOW THE WHY` 在证据开始形成时出现，而不是等全部信息出现后再补标题。

### Scene 06：Orbit-to-Chart Morph

这是整套叙事中最重要的过渡，也是区别于普通科幻官网的标志性动效。

- 行星轨道逐渐压平，成为市场图表的时间轴和价格网格。
- 被选中的行星位置变成图表上的当前价格点。
- 证据标签分别归位到真实产品中的 Signals、News 和市场数据区域。
- 视角由 3D 勘查空间稳定过渡到 2D 产品界面，不使用硬切或遮罩转场掩盖关系。
- `MAKE THE TRADE` 在交易面板进入后出现。

### Scene 07：Real Product UI

- 使用从 `smartx-fe-marin-pm` 提取的真实信息结构和 React 交互，不重新绘制一个只有外观的官网 mockup。
- 推荐复用的页面骨架：`MarketHeader + MarketChart + MarketNotifications + MarketList + MarketTrade`。
- 官网只编排一个有代表性的真实市场和一个明确的可交易状态；桌面构图为左侧市场片段、右侧交易判断，外层不再套一张占满视窗的终端卡片。
- 可以调整裁切、初始数据、面板比例和演示状态，但不改变真实产品的基本信息结构。
- 不在官网中完整复刻所有标签页、列表和设置；重点证明从信号、证据到交易的链路真实存在。
- 用户应能够执行一次低风险的演示交互，例如选择结果、输入金额并 Preview / Trade。

### Scene 08：Trade-to-Memory

- 交易确认后，订单状态不直接消失或跳转。
- 一条包含市场、方向、时机和置信信息的数据脉冲离开交易面板。
- 图表和产品界面逐渐退到背景，脉冲进入 Memory 场景并成为新的记忆事件。
- 这个过渡必须明确表达：SmartX 从真实行为中学习，而不是凭空猜测用户喜好。

### Scene 09：AI Memory

- 复用 `smartx-fe-vc-demo` 中 `MemoryUniverseCanvas` 的 Three.js 场景和 Domain 选择机制，重新编排为官网叙事版本。
- 首版建议展示四个顶层维度：
  - Market Interests
  - Trusted Signals
  - Trading Style
  - User Edge
- 用户点击不同维度后，更新中心视觉、维度标题、简短说明和本次交易产生的变化。
- 每个维度只展示最重要的 3-5 个子维度，避免雷达图和说明面板同时过载。
- Trade 是最高权重的 Memory Event；Watch、Follow 和 Alert 可以提供弱信号，但不能与真实交易等权。
- AI Memory 必须明确标记为未来能力，避免让用户误认为当前产品已经完成个性化推荐。

建议主表达：

> Every trade sharpens what SmartX shows you next.

### Scene 10：Updates and Footer

- Memory 结束后主动降低运动强度、空间深度和视觉噪音。
- Memory 是最后一个 pinned 镜头；离开后不再使用前进式相机或语义吸附，直接恢复普通纵向文档滚动。
- Updates 使用编辑式排版：日期、分类、标题、摘要和细分隔线，不使用等宽卡片墙。
- 保持充足留白，让用户在高密度叙事后恢复阅读节奏。
- Footer 不继续使用 3D 动效；只保留品牌、核心链接、社交入口和必要的法律信息。

## 6. 视觉原则

### 6.1 延续现有品牌，而不是制作通用科幻站

- 核心颜色继续使用 SmartX 黑、白和绿色 `#08DFB5`。
- 蓝色、橙色和红色只用于区分数据和交易语义。
- 避免紫色星云、渐变光球、无含义的雾效和通用 Web3 视觉。
- 星空不能是静态背景图；主要星体和轨迹必须参与产品叙事。

### 6.2 留白和信息密度

- 每一幕只承担一个主要判断，不同时解释多个功能。
- 大标题、数据读数和产品 UI 之间需要有清晰的尺度层级。
- 不用长段文字解释交互；让镜头运动和数据归位说明关系。
- 不使用卡片套卡片，也不把每个信息点放进圆角容器。

### 6.3 真实产品的可信度

- 产品 UI 应来自真实组件和真实信息结构。
- 允许为了官网演示进行 art direction，但不能牺牲可识别的产品真实性。
- 真实 UI 的价值是证明 SmartX 已经具备能力；视觉打磨的目标是聚焦，而不是伪造。

## 7. 滚动与动效原则

- 采用原生纵向滚动，不把滚轮变成按钮，也不阻塞用户快速滚动。
- 使用 pinned scene 组织长镜头，但每个 pinned 区域必须有明确进入和退出状态。
- 页面之间不做普通淡入淡出；主要过渡必须由同一个视觉对象连续变形完成。
- 动效节奏遵循“加速发现、减速观察、稳定交易、柔和学习”。
- UI 微交互使用短时长和明确反馈，不与主镜头争夺注意力。
- 支持 `prefers-reduced-motion`：将镜头飞行降级为缩放、淡入和静态数据轨道。
- 不出现明显的横向滚动条；隐藏纵向滚动条时仍需保留键盘、触控和辅助技术的滚动能力。

## 8. 响应式原则

- 桌面端承担完整的纵深、锁定和坐标系变形体验。
- 移动端保留同一叙事，但减少粒子数量、景深、自由视角和同时出现的数据标签。
- 移动端产品 UI 使用真实移动端组件或针对官网重新编排的响应式组合，不缩小桌面界面。
- 关键标题和操作始终避开星体中心、图表关键点和交易控件。
- 所有固定格式元素需要稳定尺寸，避免滚动过程中因文案变化发生布局跳动。

## 9. 技术方向

Motion Lab 已完成轻量技术验证，正式实现采用下面的职责边界：

- 原 Hero：保留现有 DOM、Canvas 2D 视觉和指针反馈，不以近似的 R3F 首屏替换。
- Renderer relay：WebGL 在首屏背后预热，通过 CanvasTexture 或严格对齐的 grid twin 接管网格，再进入 Universe。
- React Three Fiber v9：统一管理宇宙、流星、行星勘查和 AI Memory 的 scene graph；全页只有一个 WebGL Context。
- GSAP ScrollTrigger：唯一的长镜头、pinned scene 和确定性滚动时间线。
- React DOM：市场详情、交易演示、证据 HUD、Memory 标题和选择控件。
- `lightweight-charts` 和共享曲线采样：产品图表及 Orbit-to-Chart 的屏幕坐标交接。
- `vc-demo`：复用 AI Memory 的数据模型、权重和选择算法，不直接搬运其独立 renderer。

完整组件边界、数据流、加载顺序和实施阶段见 `docs/website-v2-frontend-architecture.md`。

动效与质量工具的定位：

- `emilkowalski/skills`：用于实现阶段的动效设计建议和完成后的 animation review，不是运行时组件库。
- `shadcn/improve`：用于结构和界面质量审计，不提供宇宙或滚动效果。
- fancy 效果的核心仍然是专门设计的镜头、语义映射和真实产品组件之间的连续变形。

## 10. 性能与可访问性约束

- 3D 只覆盖发现、勘查和 Memory 等必要章节，不让整站持续运行高成本场景。
- 星体和粒子优先使用实例化渲染，并限制移动端数量。
- 限制设备像素比，避免高分屏上无收益地增加 GPU 压力。
- 离开场景后暂停渲染循环，释放不再使用的纹理、材质和几何体。
- 首屏内容不能等待 3D 资源加载；宇宙场景应在首屏展示期间异步准备。
- 所有可点击维度必须支持键盘操作、焦点状态和语义标签。
- Canvas 之外需要保留等价文本信息，避免核心内容只存在于视觉画布中。

## 11. 实现关键帧与评审要求

当前不以重画 Figma 页面作为前置工作。动效原型、截图回归和实现文档需要共同记录以下十个关键帧：

1. Hero unchanged
2. Grid accelerating into depth
3. Meteor field / See the Move
4. Signal target locked
5. Planet inspection begins
6. Evidence layers fully revealed / Know the Why
7. Orbit-to-chart morph
8. Real product UI / Make the Trade
9. Trade pulse entering AI Memory
10. Memory dimensions, Updates and Footer

每个关键帧需要记录：

- 滚动区间或触发条件
- 镜头位置和主要对象变化
- 文案出现时机
- 对应的真实产品组件
- 桌面与移动端差异
- reduced-motion 降级方式

## 12. 非目标

- 不把官网做成完整产品说明书。
- 不展示所有 SmartX 功能和每一种信号类型。
- 不制作与数据无关的太空游戏或自由探索体验。
- 不用纯概念 mockup 替代已经存在的产品能力。
- 不把未来 AI Memory 表达成当前已经上线的个性化推荐。
- 不用大量卡片、长文案和连续全屏标题制造信息密度。

## 13. 设计验收标准

V2 实现进入正式首页前，至少应满足以下判断：

1. 不阅读说明文字，也能看懂从发现异动到交易的方向。
2. 流星、行星、轨道和数据层各自具有稳定且不冲突的含义。
3. 首屏到宇宙、宇宙到产品、产品到 Memory 三次主要过渡都由连续对象完成。
4. 产品 UI 明显来自真实 SmartX，而不是通用交易终端模板。
5. AI Memory 明确由交易触发，并被标记为未来能力。
6. 页面有足够留白，Updates 和 Footer 能让整体节奏自然落地。
7. 桌面、移动端和 reduced-motion 模式下都能完成同一核心叙事。

## 14. 参考来源

- 官网代码：`smartx-web-fe-main`
- 当前产品能力：`smartx-fe-dev` 的 `dev` 分支
- 市场详情与交易组件：`smartx-fe-marin-pm`
- AI Memory 模型与 Canvas：`smartx-fe-vc-demo`
- [SmartX 对接文档（Figma）](https://www.figma.com/design/t38RJ52jEzew2IHUY4EwTA/SmartX-%E5%AF%B9%E6%8E%A5%E6%96%87%E6%A1%A3?node-id=149-42118)
- [SmartX 补充资料（Google Docs）](https://docs.google.com/document/d/1eFTpliPnL42KykAZhnQ7AW-4t2lqLJk_vLexmrUlgio/edit?tab=t.0#heading=h.87fsg7ncqam)
- [emilkowalski/skills](https://github.com/emilkowalski/skills)
- [shadcn/improve](https://github.com/shadcn/improve)

## 15. 版本记录

### V3 原型 / 2026-07-21（并行路由 `/v3`，方向探索）

- 新增编辑化原型 `/v3`（"终端即主角"）：普通文档流 + 排版节奏，与叙事版并行对照，未替换正式首页。
- 结构：Hero（复用）→ 四章编辑化章节（See the move = 真实信号流 / Know the why = 证据 pin 图表 + 证据栏 / Make the trade = 策略卡 + 仓位 / Memory = 全页唯一 3D 时刻）→ Updates/Footer（复用）。
- 签名 spine：一条信号线沿左缘贯穿全部章节，滚动驱动绘制，章节节点随 reveal 点亮——全页唯一的连续视觉对象。
- `ProbabilityChart` 抽取为 `product-demo/probability-chart.tsx`，叙事版与 v3 共用。
- 证据截图：`output/playwright/round10/`。

### V2.6 / 2026-07-21（同日第四轮）

- Know the Why 定稿为**证据汇流**方案：轨道/扫描环全部移除，四条数据流从 context 卡（`WHY_CONTEXT_PLACEMENTS` 反投影）流向行星表面，粒子沿流向行星移动、命中点脉冲；激活维度流更亮更快（×1.7）。运动方向即语义——证据流入市场、汇聚成一个价格，与文案完全同构。
- context 卡位置常量收敛到 `story.config.ts`，overlay 排版与 WebGL 流起点共用，保证精确对齐。
- 验证证据：`output/playwright/round9/`。

### V2.5 / 2026-07-21（同日第三轮）

- 磁吸节奏放缓：snap 时长 0.24-0.58s → 0.55-1.2s（power1.inOut）、scrub 0.32 → 0.5，过渡演出不再被闪过。
- SEE THE MOVE 标题与 legend 延长到 Lock 阶段（copy.moveOut 0.26 → 0.34），第二静态屏保留章节语义。
- 证据切换改为停留时间轮播（3.4s/档，interval 驱动），不再被磁吸滚动一闪跳到最后一档；用户点击后停止自动轮播。
- Know the Why 轨道改为 2.5D 扫描环：浅倾角（0.34-0.55 rad）同心椭圆 + depthTest 关闭，HUD 语义，从根上消除遮挡接缝；删除双 pass。
- 卡片高级化：context 卡 / MARKET NODE / legend 去盒子化——色点标识 + 大号 mono 数值（16-17px）+ 发丝底线替代描边盒。
- 验证证据：`output/playwright/round8/`。

### V2.4 / 2026-07-21（同日第二轮）

- Know the Why 改为群星（Stellaris）式勘查视角：四张 context 属性卡固定屏幕位置环绕行星（11-14px 可读字号、引线指向行星、可点击切换），不再跟随轨道节点投影；仅激活维度的轨道做完整遮挡渲染，其余只保留幽灵弧，消除多轨道遮挡接缝的杂乱感。
- Make the Trade 意象化：拆除终端面板的盒子边框与底色，图表/市场标题/证据 chips 漂浮于宇宙背景，保留真实 lightweight-charts 与策略卡内容。
- Memory 视觉向 `smartx-fe-vc-demo` 对齐：线框球核心 + 内部暗核，集群改为扁平饱和色星盘 + 细椭圆环 + 权重驱动的不规则星座因子节点，锚点非对称分布。
- 全站字号 sweep：所有 <11px 文本提升至 11px 下限；删除已被 MarketInstrument 取代的 MarketDemo 组件链（market-demo.tsx / chart-view / module.css）。
- 验证证据：`output/playwright/round7/`。

### V2.3 / 2026-07-21

- 新增 `docs/visual-motion-spec.md` 作为全部屏幕精修的验收标准（发光预算、流星渲染标准、遮挡规则、字阶）。
- 首屏：环境流星密度提升并拆分远/近两层，生命周期与路径完成绑定（不再中途消失）；~15% 快闪星 + 大星偶发 glint；信号头光晕收敛。
- Universe 流星头改为 billboard shader 精灵（白核 + 色晕），脉冲走亮度 uniform，目标流星锁定时带十字 glint；尾迹近头端偏白。
- Know the Why：轨道双 pass 遮挡（前景亮弧被行星正确遮挡 + 幽灵弧暗示闭环），行星 wireframe 降密度，节点转入背面时标签降权、激活标签始终可读。
- Make the Trade：信号事件以 series markers 锚定图表时间轴（按 tone 着色 + AUTO 触发标记）；右栏新增 Automation 策略卡（IF/AND/THEN 触发规则、30d 模拟回测、跟单入口标注 Coming）。
- Memory：面板字体从 system-ui 修正为全站 `--font-ui`，字阶按规范重排（20px 面板题 / 13px 正文 / 12-13px mono 数据 / 11px kicker）。
- 验证证据：`output/playwright/round6/`。

### V2.2 / 2026-07-20（同日第二轮）

- 流星方向统一为单一辐射方位（左上 → 右下）：首屏 cosmic（Canvas 2D）与 Universe 章节（WebGL）共用同一方位语义，信号流星（彩色、更亮、头部脉冲）与环境流星（暗白、平行）分层；流星头部在吸附静止时保持呼吸脉冲。
- `smartx-main.js` 从 2702 行精简至约 600 行：删除全部旧网格模拟，仅保留 cosmic 渲染、标题字符校准与生命周期接口；`OriginalHero` 不再有 grid/cosmic 开关。
- Hero → See the Move 过渡加强：文案上移距离从 9vh 提高到 16vh，相机新增入场前推（`universe.cameraApproach`）。
- Know the Why 轨道系统全部进入 WebGL：SVG 图例废弃，4 条彩色倾斜轨道与行星共享同一变换空间，证据节点沿轨道运行（相位保持约 90° 间隔），DOM 标签沿"行星中心 → 节点"方向投影环绕定位，MARKET NODE 价格 chip 锚定行星下方投影点。
- 验证证据：`output/playwright/round5/`。

### V2.1 / 2026-07-20

- 首屏方向变更：Hero 背景从动力学网格切换为 cosmic 星空（`OriginalHero surface="cosmic"`，由 `smartx-main.js` 的 Canvas 2D cosmic renderer 驱动）。Hero 的 DOM、标题、CTA 与 reveal 机制保持不变；本条目取代 §5 Scene 01 中"保持当前首屏网格"的表述。
- `/original` 旧首页与 `/motion-lab` 全部验证路由已删除（Phase 1-4 验证完成后按计划回收）；回归对照使用 `output/playwright/` 截图。
- 全部场景时间窗口收敛到 `story.config.ts`（`MARKET_SCENE` / `STORY_TAIL`），GSAP timeline 与 WebGL 场景共同消费，调节奏只改一个文件。

### V2 / 2026-07-14

- 保持现有 Hero。
- 建立“流星是信号、行星是市场”的统一空间隐喻。
- 使用行星勘查承载 Know the Why。
- 使用 orbit-to-chart morph 连接宇宙和真实产品 UI。
- 使用交易事件连接产品和 AI Memory。
- Updates 改为编辑式排版，Footer 保持克制。
