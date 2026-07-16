# ADR 001: 官网 V2 动效运行时与技术验证

> 状态：Accepted for spike  
> 日期：2026-07-14  
> 适用范围：`/motion-lab` 技术验证；不直接改变正式首页
> 正式实现架构：`docs/website-v2-frontend-architecture.md`

## Context

官网 V2 的核心体验不是独立的入场动画，而是下面三次连续交接：

1. 首屏网格进入三维市场宇宙。
2. 流星信号被锁定，镜头抵达市场行星并展开证据。
3. 行星轨道压平为市场图表，随后由交易行为进入 AI Memory。

当前官网首屏使用独立的 Canvas 2D renderer，后续内容主要依赖 CSS 和 `IntersectionObserver`。这套实现适合局部反馈和进入视口后的 reveal，但不能提供可逆的长时间线、统一 Camera 或 WebGL 到 DOM 的精确交接。

技术验证必须先回答连续动效是否成立，再决定是否迁移正式首屏和提取完整产品组件。

## Baseline

验证开始前的官网基线：

- Next.js `15.5.15`
- React `19`
- 静态导出 `output: "export"`
- 首页页面包约 `63.6 kB`
- 全站共享首载 JS 约 `102 kB`
- `npm run typecheck` 通过
- `npm run build` 通过

`/motion-lab` 必须使用路由级动态加载，验证期间不能增加正式首页的首载 3D 依赖。

## Decision

### 1. 原 Hero renderer 接入一个持续存在的 WebGL 场景

原 Hero 的 DOM、Canvas 2D 视觉和指针反馈保持不变。WebGL Canvas 在首屏背后异步预热，在用户开始进入下一章节时，通过短暂的 CanvasTexture / 同构网格接力取得渲染控制权。

Universe、Planet Inspection 和未来的 Memory 使用同一个 React Three Fiber Canvas。HTML 标题、分析 HUD 和产品 UI 保持为 DOM。接力期间允许一个 2D context 和一个 WebGL context 短暂并存；接力完成后暂停 Canvas 2D animation loop。反向滚动时先恢复 2D renderer，再完成反向接力。

这项决定替代早期“先把整个 Hero 背景重构到 R3F”的设想。首屏不需要为了空间叙事重新实现，正式开发先验证 renderer relay。

### 2. R3F 负责场景结构，GSAP 负责叙事时间

最小依赖集合：

- `three@0.183.2`
- `@react-three/fiber@9.6.1`
- `@react-three/drei@10.7.7`
- `@react-three/postprocessing@3.0.4`
- `gsap@3.15.0`
- `@gsap/react@2.1.2`
- `maath@0.10.8`

React Three Fiber 管理 Scene Graph、资源生命周期和 React 组件边界。GSAP ScrollTrigger 管理章节进度、pin、scrub、Camera、shader uniform 和 DOM 交接。

不通过 React `setState` 写入每一帧的滚动进度。GSAP 修改 refs 或普通的 mutable state，R3F 在 `useFrame` 中读取。

### 3. 原生滚动优先

技术验证阶段不引入 Lenis、ScrollSmoother 或自定义 wheel handler。

- 保留浏览器原生滚动、触控和键盘行为。
- 使用 ScrollTrigger 的 scrub 调整镜头跟手程度。
- 只有在真实设备上确认原生滚动无法达到需要的镜头质感后，才单独评估 Lenis。

### 4. 不引入 r3f-scroll-rig

`r3f-scroll-rig` 适合大量 DOM 元素与 WebGL mesh 的持续像素级同步。当前叙事只有一次关键的 WebGL-to-product handoff，使用统一进度和屏幕坐标锚点即可完成。

暂不引入的原因：

- 增加 Global Canvas、DOM tracker、tunnel 和 smooth scrollbar 等额外抽象。
- 自带 Lenis，与原生滚动优先的验证策略冲突。
- 官方建议在移动端考虑关闭 smooth scrolling 和 scrolling WebGL elements。
- 当前只需验证一个有明确构图的产品交接，不需要通用 DOM tracking framework。

### 5. 视觉帮助库只按需使用

验证后的职责分配：

- Drei `Line`：绘制屏幕空间宽度稳定的双层流星尾迹。
- `maath/easing`：提供帧率无关、可打断的 Camera position / look-at damping。
- React Postprocessing：通过一个 EffectPass 提供低强度 Bloom。
- Drei `AdaptiveDpr`：在负载变化时限制像素成本。

主叙事不使用 Drei `Trail`。Trail 依赖运行时历史帧，适合自由运动物体，但在滚动倒放时无法由当前 progress 唯一还原尾迹。流星改用三次贝塞尔轨迹，并根据当前 progress 重新采样尾迹，保证向下和向上滚动都可重放。

Bloom 只强化流星光芯和目标锁定，不能代替几何、Camera 和时序。当前不加入 Noise、Vignette、通用星空模板或额外 EffectPass。

## Runtime Architecture

```text
MotionLabPage
  StoryDirector
    ScrollTrigger timeline
    normalized chapter progress
  OriginalHero (DOM + Canvas2D, final integration)
  RendererRelay (final integration)
    CanvasTexture / aligned grid twin
    Canvas2D pause / resume
  WebGLStage (sticky, one WebGL Canvas)
    HeroRelayScene
    SignalFieldScene
    PlanetInspectionScene
    MemoryScene (future)
  SemanticOverlay (DOM)
    chapter copy
    evidence HUD
  ProductHandoff (DOM)
    chart anchor
    product shell
```

场景进度使用一个归一化值和明确的章节区间，不让每个组件自行监听 `scroll`：

```text
0.00-0.18  Hero grid depth transition
0.18-0.38  Signal field and meteor lock
0.38-0.62  Flight to planet and inspection
0.62-0.82  Orbit-to-chart handoff
0.82-1.00  Product UI settled state
```

## Spike Scope

技术验证只实现下面三件事：

1. 在实验路由复现首屏网格的构图，并让网格从正视图进入透视纵深；正式 Hero renderer relay 留到下一阶段单独验证。
2. 展示多条有语义颜色的流星，自动锁定一条并抵达一个市场行星。
3. 将行星轨道压平并与一个 DOM 图表占位区域完成屏幕坐标交接。

第一阶段不实现：

- 完整的产品交易流程
- 完整的 AI Memory
- 真实 API、钱包或鉴权
- Updates 和 Footer
- 平滑滚动库
- 复杂后处理

## Visual Rules for the Spike

- 使用 SmartX 的黑、白和 `#08DFB5`，信号色只表达数据类型。
- 不使用紫色星云、通用 Space Skybox 或无意义的发光球。
- 证据标签使用清晰的 DOM，引线端点与 3D 对象保持一致。
- 每个阶段只有一个主视觉判断。
- 产品交接必须能反向滚动并回到完整行星，不能只做单向入场。

## Acceptance Criteria

### Behavior

- 向下和向上滚动均能稳定重放全部过渡。
- pinned scene 没有跳变、空白帧或滚动锁死。
- WebGL 与 DOM 图表锚点在 resize 后仍然对齐。
- `prefers-reduced-motion` 使用淡入和静态状态，不执行快速 Camera flight。
- 页面可以通过键盘和触控正常滚动。

### Rendering

- 只有一个 WebGL Canvas 和一个 WebGL Context。
- Canvas 不是空白或纯背景，桌面与移动端截图均能检测到有效像素变化。
- 桌面 DPR 上限为 `1.5`；移动端可以进一步降低。
- 粒子使用 Points 或 instancing，不为每颗星创建独立 React component。
- 页面不可见时暂停无必要的 animation loop。

### Performance Targets

- 桌面目标：滚动期间接近 60 fps，持续帧时间不超过约 20 ms。
- 中端移动设备目标：至少 30 fps，并使用简化粒子、轨道和后期效果。
- 不在滚动回调中触发 React component rerender。
- 正式首页 bundle 在 spike 阶段不包含 Three.js 或 GSAP。

## Validation Method

- Production build 和 typecheck。
- Playwright 桌面与移动端关键滚动位置截图。
- Canvas 像素采样，确认场景非空且不同阶段存在可观察变化。
- 浏览器 Performance API / FPS sampler 记录滚动区间帧时间。
- 检查 `prefers-reduced-motion` 和 resize 后的场景状态。

## Consequences

### Positive

- 先验证最高风险的镜头和交接，避免过早搬运产品业务代码。
- 一套 Camera 和时间线可以保证视觉连续性。
- 产品 UI 保持 DOM，继续获得真实交互、清晰文字和可访问性。
- R3F v9 与当前 React 19 匹配。

### Cost

- 原 Canvas 2D 脚本需要暴露最小 pause / resume / render-once 生命周期接口。
- Hero 接力期间需要维护 CanvasTexture 或严格对齐的 WebGL grid twin。
- `vc-demo` 的 Memory renderer 不能直接挂载，需要把算法和数据模型迁入统一场景。
- 需要维护桌面、移动端和 reduced-motion 三套场景参数。

## Follow-up Decision

只有在三个关键过渡通过验收后，才开始：

1. 正式 Original Hero renderer relay。**已完成独立验证。**
2. `marin` 产品展示层提取。**已完成第一版。**
3. `vc-demo` Memory 场景迁移。
4. 后处理和可选 smooth scrolling 评估。

## Spike Result / 2026-07-14

状态：**Passed**

已验证：

- `/motion-lab` 通过静态导出、TypeScript 和 ESLint。
- 正式首页页面包仍为约 `63.6 kB`；Three.js 和 GSAP 保持在实验路由动态 chunk 中。
- 单一 R3F Canvas 完成 Hero Grid、Signal Field、Planet Inspection 和 Orbit-to-Chart。
- ScrollTrigger 时间线支持向下和向上完整回放，没有滚动锁死。
- 根据浏览器实测反馈，Hero Grid 从早期的倾斜入场改为正对视窗放大并穿越；倾斜会产生“地面/跑道”语义，不符合向市场宇宙前进的意图。
- 桌面 1440 x 900 自动滚动采样：正向平均 `16.66 ms`、P95 `17.6 ms`；反向平均 `16.66 ms`、P95 `17.6 ms`。
- 移动端 390 x 844 的 Hero、Inspection 和 Product 构图均可用；Product 自动收起 Signals rail，保留图表和交易动作。
- 移动端 Inspection 状态直接读取 WebGL framebuffer，约 `15.67%` 像素明显不同于背景，确认 Canvas 不是空白帧。
- `prefers-reduced-motion: reduce` 时不创建长滚动时间线，直接展示静态 Product 状态。
- 浏览器 Console 无运行时错误。

关键截图：

- `output/playwright/motion-lab-15-forward.png`
- `output/playwright/motion-lab-57-inspection.png`
- `output/playwright/motion-lab-69-handoff.png`
- `output/playwright/motion-lab-81-product.png`
- `output/playwright/motion-lab-mobile-57-inspection.png`
- `output/playwright/motion-lab-mobile-81-product.png`
- `output/playwright/motion-lab-reduced.png`

已知限制：

- 当前流星和行星材质用于验证语义和空间关系，不是最终视觉资产。
- Product 仍是 handoff shell，尚未接入从 `marin` 提取的纯展示组件。
- Memory 未进入本轮 spike；正式迁移时必须进入同一 Canvas，不能复用独立 renderer。
- 当前 R3F 渲染循环在开发环境会触发 Three.js `Clock` deprecated warning，但没有运行时错误；正式依赖升级前需要跟踪上游适配。
- `npm audit --omit=dev` 报告现有 Next.js `15.5.15` 和其 PostCSS 依赖的 advisory。官网为静态导出，但仍应单独安排 Next.js patch upgrade，不在本次动效 spike 中混改。

### Motion Polish / Product Extraction Result

- 流星由直线 `LineBasicMaterial` 改为三次贝塞尔路径和 Drei 屏幕空间宽线；光芯与外层光轨分别控制。
- 尾迹长度随滚动速度温和变化，但位置始终由 progress 决定；产品屏快速倒回 Signal 段后没有历史残影。
- Camera 使用 Catmull-Rom flight path，并通过 `maath` 对 position、look-at 和 FOV 做帧率无关阻尼。
- Signal Field 增加低频空间漂移，避免粒子像统一传送带。
- 单一低强度 Bloom 已接入；DOM 文案和 Product UI 不参与后处理。
- Product 已从 Motion Lab 内联壳提取为 fixture-driven `MarketDemo`，支持 Evidence、Range、Outcome、Amount、Preview 和 Simulated confirmation。
- 模拟确认暴露 serializable `TradeMemoryEvent`，供下一阶段 Memory transition 使用。

新增验证截图：

- `output/playwright/motion-polish-meteors.png`
- `output/playwright/motion-polish-lock.png`
- `output/playwright/motion-polish-inspection.png`
- `output/playwright/motion-polish-product.png`
- `output/playwright/motion-polish-reverse.png`
- `output/playwright/motion-polish-mobile-inspection-cold.png`
- `output/playwright/motion-polish-mobile-product-final.png`

最终验证：

- Production build、TypeScript 和 ESLint 均通过。
- 正式首页仍为约 `63.6 kB`；`/motion-lab` 为 `1.47 kB` 路由壳，3D runtime 保持动态加载。
- 1440 x 960 自动滚动采样运行于 120 Hz 环境：正向平均 `8.33 ms`、P95 `9.1 ms`；反向平均 `8.33 ms`、P95 `9.1 ms`。
- 390 x 844 自动滚动采样：平均 `8.33 ms`、P95 `9.7 ms`。
- 移动端 Inspection Canvas 截图采样中约 `17.78%` 像素显著不同于背景。
- Reduced Motion 下 progress 直接设为 `0.82`，Product opacity 为 `1`，页面高度等于单个 viewport。

结论：动效 primitives 与 Product Demo 边界均已确认。下一阶段可以迁移 Memory model 和四个顶层维度，不需要先引入平滑滚动库。

## Orbit-to-Product Handoff Revision

根据浏览器评审，早期 handoff 虽然同时播放了 Planet flatten、Orbit morph 和 Product fade，但三者没有共享屏幕锚点，仍然表现为三个并行动画；Product 也依赖单一 `autoAlpha` tween 才能显示。

修订后的交接规则：

- 产品 SVG 和 WebGL 轨道共享同一套 128 点概率曲线采样数据。
- 运行时读取真实产品 SVG 的 DOM bounds，将 WebGL 曲线逐点投影到对应屏幕坐标。
- 不再把整个行星压扁；行星收束为图表末端的当前价格点。
- 只让选中轨道的开放前半弧进入 morph，避免闭合圆环变成开放曲线时出现回折和尖角。
- 使用透明 SVG bridge 完成 WebGL 曲线与产品曲线的短暂重合，不提前显示大块产品背景。
- 产品按 `Chart -> Frame -> Header -> Signals -> Trade` 顺序建立，而不是整页统一淡入。
- 最终 Product 状态由 ScrollTrigger `onLeave` 明确锁定为 visible / unclipped / interactive；反向滚动仍由同一时间线恢复。

验证结果：

- 桌面与移动端正向、反向 handoff 均可重放，无 bridge 或 Product 残留。
- 最终 Product 为 `opacity: 1`、`visibility: visible`、`clip-path: inset(0)`，模拟交易可进入 Preview。
- Reduced Motion 直接显示完整 Product，bridge 保持隐藏。
- 120 Hz 环境自动滚动采样：正向和反向平均 `8.33 ms`，P95 `9.3 ms`。

关键截图：

- `output/playwright/handoff-v2-final-curve.png`
- `output/playwright/handoff-v2-final-chart.png`
- `output/playwright/handoff-v2-final-product.png`
- `output/playwright/handoff-v2-mobile-72.png`
- `output/playwright/handoff-v2-mobile-90.png`
- `output/playwright/handoff-v2-mobile-reverse-72.png`

## Original Hero Relay Result

独立路由 `/motion-lab/hero-relay` 已完成 renderer relay 验证：

- 正式首页与实验路由复用同一个 `OriginalHero`，接力前 DOM、Canvas 2D 和视觉构图一致。
- WebGL 通过 CanvasTexture 取得当前 2D 画面，并在同一屏幕坐标进行 shader 变形和 Universe 显示；页面只有一个 WebGL Context。
- `smartx-main.js` 暴露 `pause`、`resume` 和 `renderOnce` 生命周期接口。正向滚动在接力稳定后暂停 2D RAF，反向滚动先恢复 renderer 再交还画面。
- Hero 主文案从首次滚动开始上移最多约 `10vh`，Header 保持固定；这让用户在第一下滚轮时就获得“页面正在离开首屏”的空间反馈，不额外增加显眼的 Scroll 标签。
- CanvasTexture 会在源 Canvas resize 后重建，避免纹理尺寸变化导致上传越界或空白帧。
- Reduced Motion 保留静态交叉淡入，不执行前冲变形。

验证结果：

- Production build、TypeScript 和 ESLint 均通过。
- 1440 x 960 正向自动滚动平均 `8.83 ms`、P95 `9.2 ms`；反向平均 `8.31 ms`、P95 `9.1 ms`。
- 390 x 844 下 Hero 文案、导航和后续章节无重叠；首次滚动位移与桌面保持同一语义。
- 反向回到顶部后 Hero 恢复完整构图，Canvas 2D 像素继续变化，确认 renderer 已恢复。
- 浏览器 Console 无运行时错误；保留现有的 Next Script preload 和 Three Clock 上游 warning。

关键截图：

- `output/playwright/hero-relay-discovery-00.png`
- `output/playwright/hero-relay-discovery-10.png`
- `output/playwright/hero-relay-discovery-20.png`
- `output/playwright/hero-relay-discovery-mobile-22.png`
- `output/playwright/hero-relay-v5-reverse-00.png`
- `output/playwright/hero-relay-reduced-82.png`

结论：Phase 1 通过。下一阶段不再单独重做 Hero，而是把该 relay 与已经通过的 Signal、Planet 和 Product handoff 合并到一条正式 narrative timeline。

## Semantic Snap Result

独立路由 `/motion-lab/snap` 验证了基于语义状态的方向吸附，现有 `/motion-lab` 保留为无吸附基线。

决策：

- 使用 GSAP ScrollTrigger 内置 snap，不引入 Lenis、CSS `scroll-snap` 或自定义 wheel handler。
- 只吸附到 Hero `0.00`、Signal `0.22`、Lock `0.36`、Inspection `0.58` 和 Product `1.00`。
- `directional: true` 保证短输入沿最后滚动方向前进；`inertia: false` 避免高速输入推算出额外跨屏。
- 延迟为 `100 ms`，吸附时长限制为 `280-900 ms`，并保留原生的用户中断行为。
- 实验时间线的 scroll distance 从 `5.4` 个 viewport 压缩为 `4.2` 个 viewport。

验证结果：

- 1440 x 960 下连续四次 `100 px` 短滚轮输入依次精确落到五个状态，没有跳过章节。
- Inspection 吸向 Product 后 `180 ms` 反向输入会取消当前吸附并回到 Inspection。
- 反向短滚轮从 Inspection 精确回到 Lock。
- 390 x 844 下五个状态顺序一致，Inspection 文案与证据无重叠，Product 可见且可操作。
- Product 落稳后 `opacity: 1`、`pointer-events: auto`，Preview Trade 可以正常进入确认状态。
- Reduced Motion 页面高度为单个 viewport，直接显示 Product，不创建滚动吸附。
- 无吸附基线收到同样 `100 px` 输入后只前进到约 `0.022`，确认两个实验路由互不影响。

结论：软磁吸可以显著减少滚轮负担，同时保留连续镜头和中途夺回控制的能力。正式整合时沿用语义状态模型，不把吸附点等距化。

## Narrative Core Integration Result / 2026-07-15

独立路由 `/motion-lab/narrative` 将此前分开验证的 Original Hero Relay、Motion Lab 场景、Orbit-to-Product handoff 和 Semantic Snap 合并进同一运行时。

实现结果：

- 原 Hero 继续由页面直接输出，不等待 3D runtime；后续内容动态加载。
- Canvas 2D 与单一 R3F Canvas 短暂并存，Universe、Planet 和 Product handoff 不创建第二个 WebGL Context。
- 全局 `0-1` progress 同时驱动 GSAP DOM timeline 与 R3F scene；RelayTexture 使用前 `0.20` 区间的局部 progress。
- Hero、Signal、Lock、Inspection 和 Product 的状态点、吸附点与 Evidence 数据集中在 `story.config.ts`。
- 2D renderer 在全局 progress `0.05` 后暂停，回到 `0.035` 前恢复。
- 后处理在 progress `0.14` 后启用，反向回到 `0.10` 前关闭，避免 Bloom 处理 Hero CanvasTexture。
- Product Overlay 从 Motion Lab 中抽成共享组件，集成页与两个基线实验继续使用同一套 DOM 和选择器契约。

验证结果：

- 1440 x 960 下四次短滚轮依次落到 `0.22 / 0.36 / 0.58 / 1.00`，原 Hero 到 Product 全链路连续。
- 从 Product 四次反向短滚轮依次回到 Inspection、Lock、Signal 和 Hero；顶部 progress 为约 `0.001`。
- 回到 Hero 后 Canvas 2D 两次像素采样发生变化，确认恢复的是真实 renderer，而不是静态截图。
- Product 最终 `opacity: 1`、`pointer-events: auto`，Preview Trade 可进入确认状态。
- 390 x 844 下原 Hero、Inspection 和 Product 构图均可用，WebGL Canvas 尺寸精确为 `390 x 844`。
- `1100 x 760` resize 后 WebGL Canvas 尺寸正确，产品 chart 与 bridge bounds 完全一致。
- Reduced Motion 页面高度为单个 viewport，Hero source 隐藏并直接显示可交互 Product。
- 60 Hz 浏览器正向采样平均 `16.74 ms`、P95 `17.5 ms`；反向平均 `16.67 ms`、P95 `17.6 ms`。
- `/motion-lab` 和 `/motion-lab/snap` 回归通过，短滚轮后分别停在 `0.022` 和 `0.220`。
- 浏览器 Console 无运行时错误。

关键截图：

- `output/playwright/integrated-narrative-hero.png`
- `output/playwright/integrated-narrative-relay-mid.png`
- `output/playwright/integrated-narrative-signal.png`
- `output/playwright/integrated-narrative-lock.png`
- `output/playwright/integrated-narrative-inspection.png`
- `output/playwright/integrated-narrative-product.png`
- `output/playwright/integrated-narrative-reverse-hero.png`
- `output/playwright/integrated-narrative-mobile-hero.png`
- `output/playwright/integrated-narrative-mobile-inspection.png`
- `output/playwright/integrated-narrative-mobile-product.png`
- `output/playwright/integrated-narrative-reduced.png`

结论：Phase 2 通过。下一阶段进入 Trade-to-Memory，使用现有 `TradeMemoryEvent` 驱动同一 R3F Canvas 中的 MemoryScene，不再修改核心滚动运行时。

## Visual Audit And Trade-to-Memory Result / 2026-07-15

本轮根据浏览器截图重新审计 Universe、Inspection、Product 和 Memory，并完成第六个语义状态。

实现结果：

- 集成叙事不再创建第二套 WebGL HeroGrid；原 Hero 网格交接后只保留星场。
- Meteor 使用粒子衰减尾迹和独立平滑核心线；TargetLock 与目标 Meteor 共用同一条 Bezier 曲线，不再出现圆圈和错误长线。
- Planet 使用暗面、Fresnel 边缘、表面采样点和四条不同倾角的局部轨道。
- Evidence HUD 从抽象分数改成 Market signal、Smart money flow、Wallet tags 和 News context 四类市场事实。
- MarketDemo 改为左侧证据与标注图表、右侧 Execute 的双栏决策界面；确认操作生成结构化 `TradeMemoryEvent`。
- Memory 复用 `vc-demo` 的 Interests、Signals、Trading style、Edge 模型语义，但渲染迁入现有 R3F Canvas；DOM 负责可访问的维度选择和说明。
- 全局吸附点更新为 `0.00 / 0.18 / 0.29 / 0.46 / 0.80 / 1.00`，物理滚动长度为 `5.2` 个 viewport。

验证结果：

- 1920 x 1080 下六个状态可通过真实滚轮前进，短反向输入可回到 Lock，Memory 反向回到 Product 后 opacity 和 pointer-events 均恢复。
- Product 的 Review、Confirm 与 Memory event 写入链路可操作；四个 Memory 维度均可点击切换。
- 390 x 844 下 Product 使用图表上、执行下的构图；Memory 关系图缩小并下移，文字优先保持可读。
- `prefers-reduced-motion: reduce` 直接显示稳定、可交互的 Product 状态。
- 浏览器 Console 无运行时错误。

关键截图：

- `output/playwright/narrative-signal-rework.png`
- `output/playwright/narrative-lock-rework.png`
- `output/playwright/narrative-why-rework.png`
- `output/playwright/narrative-product-rework.png`
- `output/playwright/narrative-memory-rework.png`
- `output/playwright/narrative-product-mobile.png`
- `output/playwright/narrative-memory-mobile.png`

结论：Trade-to-Memory 核心链路成立。下一阶段可以在正式首页接入该运行时，并设计 Memory 到 Updates / Footer 的降噪退出。
