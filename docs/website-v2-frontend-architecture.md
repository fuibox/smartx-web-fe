# SmartX 官网 V2：前端架构与实现方案

> 状态：正式首页 `/` 已接入叙事 runtime；`/original` 与 `/motion-lab/*` 验证路由已于 2026-07-20 删除（§2.2-2.5 中对这些路由的描述仅作历史记录）。场景时间窗口已收敛至 `story.config.ts` 的 `MARKET_SCENE` / `STORY_TAIL` 单一来源；§6.1 的节奏参数表以该文件为准。首屏采用 cosmic 星空 surface（见设计意图文档 V2.1 记录）。  
> 更新日期：2026-07-20  
> 适用范围：官网首页 V2 的 Hero、Universe、Planet Inspection、Product、AI Memory、Updates 和 Footer  
> 设计依据：`docs/website-v2-space-narrative-design-intent.md`  
> 技术决策记录：`docs/adr/001-motion-runtime-and-spike.md`

## 1. 架构目标

官网不是多个特效区块的拼接，而是一条可逆的产品叙事：

```text
Original Hero
  -> See the Move
  -> Know the Why
  -> Make the Trade
  -> Build Your Memory
  -> Updates
  -> Footer
```

前端架构需要同时满足：

1. 原首屏的视觉、交互和品牌辨识度保持不变。
2. Hero 到 Universe、Planet 到 Product、Trade 到 Memory 均有连续的视觉对象负责交接。
3. 3D 场景、DOM 文案和真实产品 UI 由同一条确定性的滚动时间线协调。
4. 向下和向上滚动都能完整还原，不依赖只播放一次的历史动画状态。
5. 正式首页首屏不被 Three.js 的下载和初始化阻塞。
6. 桌面、移动端和 reduced-motion 使用同一信息结构，但允许不同的渲染复杂度。

## 2. 当前实现状态

### 2.1 正式首页 `/`

- Next.js App Router + React 19，静态导出。
- 原 Hero 是 React DOM + `public/smartx-main.js` 驱动的 Canvas 2D 网格。
- `smartx-main.js` 同时负责网格、信号、指针反馈和标题字符校准。
- 后续页面目前使用 `IntersectionObserver`、CSS reveal、`lightweight-charts` 和普通 React 交互。
- Updates 和 Footer 已接在 Memory 之后，并使用普通文档流退出沉浸叙事。

### 2.2 技术验证 `/motion-lab`

当前已经实际使用 GSAP：

- `gsap@3.15.0`
- `@gsap/react@2.1.2`
- `ScrollTrigger`

`MotionLabExperience` 中只有一条主 GSAP timeline。它负责 pin、scrub、章节文案、证据 HUD、WebGL-to-product 交接和最终产品状态；R3F 场景只读取由 timeline 写入的 mutable progress。

已验证范围：

- R3F 单 Canvas 的 Universe、Meteor、Planet Inspection 和 Orbit-to-Chart。
- DOM 图表 bounds 到 WebGL 世界坐标的映射。
- `MarketDemo` 的 fixture-driven 展示和一笔 Preview Trade。
- 同一 R3F Canvas 中的四维 MemoryScene、交易事件映射和 DOM 维度选择。
- 桌面、移动端、反向滚动和 reduced-motion。
- Three.js / GSAP 仍位于 `/motion-lab` 动态 chunk，没有进入正式首页首载包。

尚未完成：

- 正式首页整合和最终内容数据接入。
- 真机滚轮、触控板和中端移动设备上的最终节奏与性能复核。

### 2.3 Hero Relay 验证 `/motion-lab/hero-relay`

- 直接复用正式首页的 Hero DOM 和 Canvas 2D，不重画首屏。
- 用 CanvasTexture 在同一屏幕坐标接管 2D 画面，再由 shader 进入 Universe。
- 2D renderer 在接力后暂停，反向滚动时恢复并继续运行。
- Hero 主文案从首次滚动开始上移，Header 保持为固定视觉锚点；文案完成位移后才淡出。
- 桌面、390 x 844 移动端、反向滚动、resize 和 reduced-motion 均已验证。

### 2.4 Semantic Snap 验证 `/motion-lab/snap`

- 保留原生滚动和 scrub，只在用户停止输入后吸附到稳定叙事状态。
- 集成叙事只保留 Hero、Signal、Inspection、Product 和 Memory 五个稳定状态；Lock 是 Signal 到 Inspection 途中的短反馈，不再吸附。
- 短滚轮输入每次只前进或后退一个状态，吸附途中再次输入会立即中断。
- 集成叙事物理滚动长度为 `4.65` 个 viewport；更慢的 scrub 与 settle 让关键演出可见，chapter rail 负责降低跳转成本。
- Product 和 Memory 都是可停留状态；Product 保留真实市场结构并把交易入口交给正式产品，Memory 同时支持 Canvas 节点和右侧维度选择；reduced-motion 不创建吸附时间线。

### 2.5 Narrative Core 集成 `/motion-lab/narrative`

- Original Hero、CanvasTexture Relay、Universe、Meteor、Planet、Orbit-to-Chart、Product 和 Memory 已进入同一条 GSAP timeline。
- 全程只有一个 WebGL Context；原 Canvas 2D 在接力后暂停，反向回到 Hero 时恢复。
- Hero、Signal、Inspection、Product 和 Memory 使用共享 `story.config.ts` 的语义状态点。
- Bloom 在 RelayTexture 退出后才启用，避免改变原 Hero 的颜色和亮度。
- Product DOM、图表 bridge 和 WebGL handoff 共用 resize 后重新测量的屏幕锚点。
- Product 使用从 Marin 信息架构提取的市场头部和 `lightweight-charts` 图表语法；Planet 收束到真实最新价格点，Fast Move、Smart Money、News、资金结构和关联市场继续附着在同一图表上下文中，右侧只承担叙事与进入正式产品的操作。
- 目标 Meteor 的终点与 Planet reveal 共用一个空间锚点；信号命中后揭示市场，不出现第二个并列焦点。
- Planet 使用完整闭环轨道并关闭轨道深度遮挡；数据层级由线宽、颜色、透明度和运动标记表达。
- Trade 的 Decision Anchor 会脱离产品画面并移动到 Memory 的 Event Receipt，成为 Trade-to-Memory 的持续视觉对象。
- 五段式 chapter rail 替代隐藏滚动条，支持键盘聚焦和直接跳转。
- chapter rail 使用 `00-04` 的语义编号，位于右侧以避开 Hero 中心、左侧章节文案和产品主阅读区；非激活状态只保留短刻度。
- Memory 是最后一个 pinned 状态；离开后暂停连续 WebGL 渲染，Updates 和 Footer 回到普通文档滚动。
- 桌面、390 x 844 移动端、完整正反向、resize、交易确认、Memory 维度选择和 reduced-motion 静态内容流均已验证。

## 3. 技术栈与职责

| 层级 | 方案 | 唯一职责 |
| --- | --- | --- |
| 应用与语义内容 | Next.js 15 + React 19 | 页面、SEO、可访问 DOM、静态导出 |
| 原首屏 renderer | Canvas 2D + `smartx-main.js` | 保持现有 Hero 的视觉和指针反馈 |
| 空间场景 | Three.js + React Three Fiber v9 | Universe、Meteor、Planet、Memory scene graph |
| 3D helpers | `@react-three/drei` | Line、AdaptiveDpr 等经过选择的 primitives |
| 主叙事时间线 | GSAP + ScrollTrigger + `@gsap/react` | pin、scrub、章节进度、DOM/WebGL 协调 |
| Camera 阻尼 | `maath/easing` | 帧率无关的 position、look-at、FOV damping |
| 产品展示 | React + CSS Modules | 清晰、可交互、可访问的 MarketDemo |
| 图表 | `lightweight-charts` / 共享采样数据 | 产品图表和视觉交接锚点 |
| 后处理 | `@react-three/postprocessing` | 克制的 Bloom；不处理 DOM 产品界面 |

### 3.1 设计与动效审计工具

本轮已安装并用于实现复核：

- `emil-design-eng`：动效工程边界与交互细节。
- `review-animations`：完整时间线的节奏、缓动与注意力检查。
- `improve-animations`：Hero relay、磁吸和 Trade-to-Memory 交接打磨。
- `apple-design`：空间连续性、减速阅读和触控构图参考。
- `impeccable`：排版、布局、响应式与最终 polish 检查。

这些 skills 不进入运行时依赖，也不替代 R3F、GSAP 或产品组件；它们只约束设计与实现审查方法。

### 3.2 GSAP 是主时间线，不是组件动画补丁

GSAP 只在 `StoryDirector` 层创建主 timeline。下层组件不能各自监听 `scroll`，也不能同时用多个库修改同一个属性。

职责约束：

- GSAP 写入归一化 progress、DOM transform/opacity/clip-path 和章节状态。
- R3F 在 `useFrame` 中读取 progress，计算 Camera、mesh、material 和 shader uniform。
- React state 只处理离散交互，例如图表区间、选中证据和 Memory 维度。
- 每帧连续值不进入 React state，避免滚动触发整棵组件树 rerender。
- 若后续引入 Motion，它只负责与主滚动无冲突的产品微交互。

## 4. 目标运行时架构

```text
HomePage (Server Component)
  OriginalHero (DOM)
    KineticGridCanvas2D
    Header / Title / CTA
  NarrativeRuntimeLoader (client-only, lazy)
    StoryDirector
      one ScrollTrigger timeline
      chapter progress refs
      responsive motion profile
    RendererRelay
      source Canvas2D lifecycle
      Hero texture / geometry handoff
    WebGLStage (one persistent R3F Canvas)
      HeroRelayScene
      SignalFieldScene
      PlanetInspectionScene
      OrbitToChartScene
      MemoryScene
    SemanticOverlay (DOM)
      scene copy
      evidence HUD
    ProductHandoff (DOM)
      MarketDemo
      shared chart anchor
  EditorialFlow (DOM)
    Updates
    Footer
```

渲染层级：

```text
z4  Navigation / accessible controls
z3  Semantic copy, evidence HUD, Product UI
z2  Original Hero DOM
z1  Original Canvas2D during Hero and relay overlap
z0  Persistent R3F Canvas, prewarmed behind Hero
```

这里只有一个 WebGL Context。原 Hero 的 2D context 可以在短暂接力期间与它并存，完成接力后暂停动画循环。

## 5. Original Hero 到 Universe 的 renderer 接力

原 Hero 不重画，也不先迁移成一个近似的 R3F 版本。它是首屏阶段的视觉真源。

### 5.1 接力阶段

```text
A. Hero authoritative
   Canvas2D 正常运行；R3F 在背后异步加载和预热。

B. Acquire
   滚动刚离开首屏静止区时，R3F 读取当前 Canvas2D 画面作为 CanvasTexture，
   或显示与接管帧严格对齐的 WebGL grid twin。

C. Crossfade
   约 120-180 ms 内完成 2D canvas 与 WebGL relay plane 的透明度接力；
   标题、导航和 CTA 仍由原 DOM 控制。

D. Transform
   WebGL relay plane / grid 才开始向中心收敛、进入纵深，并露出 Universe。

E. Release
   原 Canvas2D 动画循环暂停，后续 Universe、Planet、Memory 共用同一 R3F Canvas。
```

首选先验证 `CanvasTexture -> relay shader -> procedural grid`。它能保留接管瞬间的真实首屏像素，再让纹理和几何逐步分离；如果移动端纹理上传成本不稳定，则降级为接管帧对齐的 grid twin + 短交叉淡入。

### 5.2 反向滚动

- WebGL grid 回到接管帧的构图和屏幕坐标。
- 原 Canvas2D 先恢复并渲染一帧，再进行反向 crossfade。
- 接力完成后 R3F 保持预热但停止不必要的连续渲染。
- 不重新播放 Hero 入场动画，也不重置用户已经看到的标题状态。

### 5.3 2D renderer 生命周期接口

`smartx-main.js` 需要增加很小的 adapter，不把 GSAP 或 React 写入该脚本：

```ts
type HeroGridController = {
  getCanvas(): HTMLCanvasElement | null;
  renderOnce(): void;
  pause(): void;
  resume(): void;
};
```

Narrative runtime 只调用这个接口完成接力。原网格的模拟、信号和指针逻辑继续归 2D renderer 自己管理。

## 6. 场景和章节模型

全局只维护一个 `storyProgress: 0..1`，再映射成显式的稳定状态点。当前验证版参数如下；它们描述的是归一化进度，不是固定毫秒，滚轮输入、viewport 高度和 `scrub` 会共同决定实际体感。

```ts
const states = {
  hero: 0.00,
  signal: 0.19,
  inspection: 0.45,
  product: 0.74,
  memory: 1.00,
} as const;
```

每个场景组件接收同一个 progress ref，通过纯函数 `smoothstep(start, end, progress)` 得到自己的局部状态。这样任意滚动位置都能唯一还原画面，避免基于“上一次播放到哪里”的状态机残留。

### 6.1 当前节奏参数

| 控制层 | 当前值 | 影响 |
| --- | --- | --- |
| 物理滚动长度 | `4.65 viewport` | 完成 Hero 到 Memory 所需的总滚动距离 |
| ScrollTrigger scrub | `0.48` | 滚轮停止后时间线追上滚动位置的柔化时间 |
| Snap delay | `0.16 s` | 停止输入多久后开始吸附 |
| Snap duration | `0.48-0.92 s` | 状态间吸附的最短与最长时间 |
| Relay 占比 | market progress `0-0.28` | Hero CanvasTexture 向宇宙画面交权的总区间 |
| Hero copy 位移 | `-min(84px, 9vh)` | 首次滚动时的向上推进感 |
| Hero copy tween | start `0.006`, duration `0.14` | 文案上移与轻微缩小的响应区间 |
| 2D Canvas fade | start `0.045`, duration `0.11` | 原网格淡出区间，与星场建立重叠 |
| Backdrop fade | start `0.05`, duration `0.13` | Hero 背景向 WebGL 背景交接的区间 |
| Relay shader travel | local `0.08-0.78` | 纹理向纵深收敛的主要区间 |
| Relay texture fade | local `0.42-0.86` | 原 Hero 像素与星场重叠的区间 |
| Postprocessing gate | market `0.31 / 0.25` | Relay 完全退出后才启用 Bloom，反向滚动时提前关闭 |
| Camera flight | market `0.14-0.46` | 进入宇宙并追踪目标信号 |
| Camera damping | position `0.28`, look-at `0.26` | 相机跟随进度时的惯性 |

Hero 到第二屏的丝滑度主要由四组参数共同决定：DOM 文案 tween、CanvasTexture shader、Camera damping 和 ScrollTrigger scrub/snap。只改其中一个会再次产生速度曲线不一致；调整时应优先保持交接区间重叠，再微调单项强度。

### 6.2 共享视觉对象

- Hero grid 通过 renderer relay 进入 Universe 坐标网格。
- 目标 Meteor 只负责引导 Camera 找到 Planet，不在语义上变成 Planet；它的终点与 Planet 中心共用锚点，由命中脉冲揭示市场。
- 选中 Orbit 和产品图表共享同一套曲线采样及屏幕锚点。
- Planet 收束为图表当前价格点，Product 按 Chart、Frame、Header、Context、Narrative 建立。
- 叙事 fixture 生成可序列化的 `TradeMemoryEvent`；Decision Anchor 沿屏幕坐标移动到 Memory Event Receipt，作为进入 Memory 的因果对象。

### 6.3 语义吸附

吸附点描述的是用户可以理解和停留的稳定构图，不等同于等距页面或任意 timeline keyframe：

```text
Hero -> Signal -> Inspection -> Product -> Memory
```

- 使用 ScrollTrigger directional snap，不引入 CSS `scroll-snap`、Lenis 或 wheel hijacking。
- 正常滚动期间仍连续 scrub；停止输入约 `140 ms` 后才开始吸附。
- Lock 仍发生在镜头追踪途中，但不会形成额外停靠状态。
- 吸附时长根据距离限制在约 `280-580 ms`，用户输入可随时打断。
- 不在 Orbit-to-Chart、Product build 等过渡中间态停留。
- Product、Updates 和 Footer 需要正常交互或阅读时，不继续建立强制章节吸附。
- `prefers-reduced-motion: reduce` 直接显示稳定静态状态，不启用 snap。

## 7. DOM 与 WebGL 的边界

适合 WebGL：

- 大量粒子、流星尾迹、行星、轨道、扫描和 Camera flight。
- 需要空间遮挡、统一透视或 shader 变形的对象。
- AI Memory 中的轨道、节点和焦点关系。

必须保持 DOM：

- Hero 标题、导航和 CTA。
- `See the Move / Know the Why / Make the Trade` 等语义文案。
- 资金流、Smart Money、新闻等证据标签。
- 产品 UI、交易控件、Updates 和 Footer。
- 所有需要键盘操作、选择、复制或被辅助技术读取的内容。

DOM/WebGL 交接使用 DOM bounds 映射到屏幕归一化坐标，再由 Camera 投影到指定 world plane。resize、字体加载和 ScrollTrigger refresh 时重新测量，不在每帧调用 `getBoundingClientRect()`。

## 8. 产品组件与数据边界

`MarketDemo` 是官网展示层，不从 `smartx-fe-marin-pm` 跨仓库运行时 import，也不携带鉴权、钱包和业务 API。

建议边界：

```text
product-demo/
  market-demo.tsx          presentational composition
  market-demo-chart-view.tsx  lightweight-charts renderer
  market-demo.types.ts     serializable contracts
  market-demo.fixture.ts   deterministic demo data
  market-demo-chart.ts     shared curve sampling
  market-demo.module.css   website art direction
```

产品真实性来自真实信息结构、组件关系和完整 Preview Trade，而不是连接生产账户。未来同步 marin 变化时，人工选择需要同步的结构和视觉 token，避免两个仓库形成隐式依赖。

交易输出使用可序列化事件：

```ts
type TradeMemoryEvent = {
  marketId: string;
  outcome: string;
  amount: number;
  probability: number;
  evidenceIds: string[];
  timestamp: string;
};
```

Memory 只消费事件，不读取 `MarketDemo` 内部组件状态。

## 9. AI Memory 迁移

从 `smartx-fe-vc-demo` 复用：

- Domain / Dimension 数据模型。
- 权重、轨道、选择和焦点算法。
- 已经形成的视觉语义和交互机制。

不直接复用：

- 独立 `MemoryUniverseCanvas` renderer。
- 第二个 animation loop、Camera 或 WebGL Context。

正式实现为统一 R3F Canvas 中的 `MemoryScene`。交互按钮和维度标题使用 DOM；3D 节点只处理空间表达和选择反馈。

## 10. 加载、性能和降级

### 10.1 加载顺序

1. 服务端直接输出 Original Hero DOM 和 Canvas2D，不等待 3D。
2. 首屏可交互后动态加载 Narrative runtime。
3. 浏览器空闲或用户产生首次滚动意图时预热 R3F scene。
4. Product 和 Memory 的较重代码按章节临近程度预加载。

### 10.2 性能约束

- 正式首页首屏性能预算单独记录，不能因为接入 Motion Lab 而默认接受 bundle 增长。
- WebGL DPR 桌面上限 `1.5`；移动端按 profile 降低。
- 星体使用 Points 或 instancing；不为单颗粒子创建 React component。
- 后处理保持单一低强度 Bloom，默认不启用景深和运动模糊。
- 页面不可见、进入纯 DOM Updates/Footer 或回到稳定 Hero 后，切换为按需渲染或暂停循环。
- 不在 scroll callback 中测量布局、setState 或创建对象。

### 10.3 响应式 profile

```ts
type MotionProfile = "desktop" | "mobile" | "reduced";
```

- `desktop`：完整 Camera path、粒子和证据层。
- `mobile`：减少粒子、轨道和同时出现的 HUD；Product 使用移动构图。
- `reduced`：不创建长 pinned flight，使用静态章节、淡入和完整可读 Product。

降级由内容能力决定，不只根据 viewport 宽度。还需要考虑 `prefers-reduced-motion`、WebGL 可用性和设备性能。

## 11. Updates 和 Footer 的退出策略

Memory 是最后一个 WebGL 章节。滚动进入 Updates 前：

- Memory 节点收束为一条稳定的数据线或品牌基准线。
- pinned stage 正常释放，页面回到原生文档流。
- WebGL Canvas 淡出并暂停，不持续覆盖 Updates/Footer。
- Updates 使用编辑式列表而不是卡片墙；Footer 保持清晰的站点导航和信任信息。

Updates 和 Footer 不进入 3D 场景。它们负责让高强度叙事平稳落地，并提供真实内容、链接和品牌可信度。

## 12. 推荐目录结构

```text
src/
  app/
    page.tsx
    motion-lab/
  components/
    hero/
      original-hero.tsx
      hero-grid-adapter.ts
    narrative/
      narrative-runtime-loader.tsx
      story-director.tsx
      renderer-relay.tsx
      narrative-stage.tsx
      narrative-overlay.tsx
      scenes/
        hero-relay-scene.tsx
        signal-field-scene.tsx
        planet-inspection-scene.tsx
        orbit-to-chart-scene.tsx
        memory-scene.tsx
      story.config.ts
      narrative.module.css
    product-demo/
    updates/
    footer/
```

不要求一次性重排当前目录。只有在正式首页接入时再从已验证的 Motion Lab 中提取这些边界，避免为了目录整洁提前重构。

## 13. 实施顺序与验收门

### Phase 1：Original Hero Relay

- 状态：**Passed**，独立验证路由为 `/motion-lab/hero-relay`。
- 复用正式首页 Hero DOM 和 Canvas2D。
- 验证 CanvasTexture / grid twin 接力、暂停恢复和反向滚动。
- 验收：接力前截图与当前 Hero 一致；接力无亮度跳变、缩放跳变或空白帧。

### Phase 2：Narrative Core Integration

- 状态：**Passed**，集成验证路由为 `/motion-lab/narrative`。
- 将已通过的 Signal、Planet、Product handoff 接到 relay 后。
- 将已验证的 Semantic Snap 状态点迁入统一 narrative timeline。
- 把时间区间集中到 `story.config.ts`。
- 验收：桌面、移动端、正向、反向和 resize 全部通过。

### Phase 3：Trade to Memory

- 状态：**Passed**。
- 用 `TradeMemoryEvent` 驱动交易脉冲。
- 迁移 vc-demo 的数据模型和算法到 `MemoryScene`。
- 验收：Memory 与真实交易行为有明确因果关系，维度可键盘选择。

### Phase 4：Editorial Exit

- 状态：**Passed**，已在 `/motion-lab/narrative` 接入。
- 接入 V2 Updates 和 Footer。
- 在离开 Memory 后释放 pin、暂停 WebGL。
- 验收：没有滚动锁死、额外空白高度或 Canvas 覆盖普通内容。

### Phase 5：正式首页替换

- 保留 `/motion-lab` 作为视觉回归场。
- 在 Production build 下比较 bundle、LCP、帧时间和关键截图。
- 通过后再移除旧的 Thesis / TradingStory / MemoryLoop 组合，不提前删除回退路径。

## 14. 当前不引入

- Lenis / ScrollSmoother：原生滚动优先，先用 ScrollTrigger scrub 调节镜头跟手感。
- `r3f-scroll-rig`：目前只有少量明确的 DOM/WebGL 交接，不需要全局 tracker。
- Theatre.js、Spline、Rive、Lottie：不负责这条实时、可逆的数据空间叙事。
- Aceternity、React Bits 等效果集合：可以参考局部细节，不进入核心运行时。
- 第二套产品应用依赖图：官网只提取展示组件和序列化数据契约。

## 15. 架构验收清单

- 原 Hero 在接力前与当前正式页面视觉一致。
- GSAP 只有一个主 ScrollTrigger timeline。
- 页面只有一个 WebGL Context。
- 向上滚动可恢复 Original Hero，并恢复 2D renderer。
- Product UI 可交互，文字不进入 Canvas。
- Trade 事件可以独立序列化并驱动 Memory。
- resize / ScrollTrigger refresh 后 DOM-WebGL 锚点仍对齐。
- mobile、reduced-motion、WebGL unavailable 都有可读路径。
- 进入 Updates/Footer 后 pin 正常释放，WebGL 停止持续渲染。
- Production build、typecheck、lint 和桌面/移动端截图回归通过。
