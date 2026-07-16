# SmartX 官网产品组件提取计划

> 状态：MarketDemo 与 Trade-to-Memory 验证已完成  
> 日期：2026-07-15

## Goal

官网需要使用 SmartX 的真实产品结构证明“Know the Why -> Make the Trade”，但不能把完整应用、API、鉴权、钱包和实时订阅带入静态官网。

目标是从 `smartx-fe-marin-pm` 提取一套纯展示、可交互、fixture 驱动的 `MarketDemo`，并从 `smartx-fe-vc-demo` 复用 AI Memory 的模型和场景算法。

## Source Audit

### Market detail

| Source | Size | Main coupling | Extraction decision |
| --- | ---: | --- | --- |
| `MarketHeader.tsx` | 639 lines | Lingui、用户状态、收藏、弹窗、规则 | 提取视觉 header 和 signal badges；移除收藏与规则动作 |
| `MarketChart.tsx` | 347 lines | 实时价格、订单簿、用户交易、相关市场 | 复用信息结构；官网使用 deterministic chart fixture |
| `MarketNotifications.tsx` | 690 lines | API、收藏、登录、Smart Money 用户组件 | 提取 Signals / News feed 的纯展示行 |
| `MarketTrade.tsx` | 568 lines | 钱包、SWR、交易 API、持仓、订单取消 | 重新建立 demo state machine，不携带业务 hooks |
| `MarketPageDesktop.tsx` | 199 lines | 五个业务组件和可调整面板 | 复用布局关系，不复制容器实现 |

这些组件不能直接跨仓库 import。它们依赖 React 18 应用中的业务别名、Lingui、鉴权、WebSocket、SWR 和交易状态；直接接入会显著增加官网依赖并造成运行时边界不清。

### AI Memory

| Source | Size | Reusable part | Migration decision |
| --- | ---: | --- | --- |
| `MemoryUniverseCanvas.tsx` | 1260 lines | 轨道、权重、选择、聚焦和几何算法 | 迁移为统一 R3F Canvas 中的 `MemoryScene`，不复用独立 renderer |
| `memoryRadarModel.ts` | 179 lines | Domain / axis 计算 | 去除 Lingui 后提取为纯 TypeScript model |
| `fixtures/memory.ts` | 806 lines | Domain、dimension 和交易记忆样例 | 裁剪为官网所需的四个顶层维度 |
| `MemoryProfilePanel.tsx` | 628 lines | 维度切换和 active factor 信息结构 | 重新组合为官网 DOM overlay |

## Target Structure

```text
src/components/product-demo/
  market-demo.tsx
  market-header-demo.tsx
  market-chart-demo.tsx
  evidence-feed-demo.tsx
  trade-ticket-demo.tsx
  market-demo.types.ts
  market-demo.fixture.ts

src/components/memory-demo/
  memory-scene.tsx
  memory-overlay.tsx
  memory-demo.types.ts
  memory-demo.fixture.ts
```

命名使用 `Demo`，防止展示组件被误认为真实交易实现。

## MarketDemo Contract

`MarketDemo` 只接收 serializable props，并在客户端维护最小演示状态：

```text
market
  question
  image
  probability
  probabilityDelta
  volume
  endTime
  signals[]
  news[]
  chartSeries[]
  outcomes[]

interaction
  activeEvidence
  selectedOutcome
  amount
  previewStatus
```

演示状态机：

```text
idle -> outcome selected -> amount entered -> preview ready -> simulated confirmation
```

不允许出现真实签名、钱包连接或网络交易。所有按钮必须明确处于 demo / preview 语境。

## Visual Fidelity Rules

- 使用 `marin` 的真实颜色、字体、信息密度和面板关系。
- 保留 Signals / News 与图表的邻接关系，这是 Know the Why 到交易的核心证据链。
- 保留真实市场问题、概率、成交量、结束时间、结果选择和金额输入。
- 可以裁剪 MarketList、OrderBook、复杂设置和非主线 tab。
- 官网构图优先于应用全功能，但不能重新设计成通用 landing-page 卡片。
- 桌面端采用左侧产品片段、右侧交易判断；只给产品片段保留工具边界，不给整屏套终端外壳。
- 桌面和移动端分别组合，不把桌面终端整体缩小到手机宽度。

## Extraction Sequence

1. [x] Motion spike 使用固定尺寸的 DOM product shell 验证 handoff。
2. [x] 确认图表锚点、最终构图和可用空间。
3. [x] 建立 `market-demo.types.ts` 与单一市场 fixture。
4. [x] 提取 Header、Chart、Evidence feed 和 Trade ticket 的纯展示层。
5. [x] 接入模拟交易状态机，并把 confirmation 事件暴露给 Memory transition。
6. [x] 迁移 Memory model 和 Interests、Signals、Style、Edge 四个 domain。
7. [x] 把 Memory 几何关系改造成统一 Canvas 内的 R3F Scene，并保留 DOM 维度选择。

## Exit Criteria

- 官网产品 UI 能被熟悉 SmartX 的用户识别为真实产品。
- 页面不包含应用 API、钱包、鉴权、SWR 或 WebSocket 依赖。
- 产品 demo 可以离线静态导出。
- 一次模拟交易能触发结构化 `TradeMemoryEvent`。
- 桌面和移动端均有稳定、可测试的布局。
- Product demo 和 Memory 都不会创建额外 WebGL Context。
