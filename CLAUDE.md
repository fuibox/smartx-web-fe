# SmartX 官网 · 工作规则

> 跨 Agent 共同约束以根目录 `AGENTS.md` 为准；本文件只补充 Claude/Fable 工作流程。

## 当前主线

- 活跃开发路由：`/`（V4；唯一权威方案：`docs/website-v4.md`，**做任何设计工作前必读**）；`/v4` 只作旧链接兼容跳转。
- `docs/website-v4-design-brief.md` 为历史简报，不再作为当前实施依据。
- V2 叙事版仅保留历史代码；`/v3` 为已废弃探索。

## 设计一致性铁律（每次出手前后都要过一遍）

1. **签名语法唯一**：装饰性视觉只允许"像素抖动"语法——Bayer 网格量化的方块、沿网格轴向的运动。**禁止**自由角度的矢量线条、圆形粒子、平滑光晕等任何脱离像素网格的装饰元素。
2. **字体三分法**：PixelOperatorMono **700** 仅用于章节宣言与 logo；Inter 负责一切阅读文本（含 kicker、标签、按钮）；JetBrainsMono 仅数据值/时间戳/地址。11px 硬下限。
3. **色彩纪律**：画布 `#0C1322`、面板 `#172033`、边线 `#1E293B`、主色 `#08DFB5`、对色 `#FF5D60`（只成对出现）。产品标签类目色（Expert 蓝/Status 青/Trading 金/Behavior 紫）只出现在产品语义的元素里。
4. **产品保真边界**：凡是"产品 UI 切片"（信号卡、标签、图表、交易面板）必须与 `../smartx-fe-dev` 的真实结构与样式一致；站点外壳只守品牌色。
5. **动效克制**：环境动效周期 ≥5s、幅度小；一切动效必须有 reduced-motion 降级；阅读区静止。
6. **文案分层**：官网文案是营销表达（解释能力），产品字段只出现在 UI 切片内；两者不得混用。

## 设计自审（每屏建完必做，再交付）

1. Playwright 截图 1440×900（动效需真实浏览器，**内嵌预览后台标签页时钟会冻结，不可用于动效验证**）；
2. 对照 `AGENTS.md` + `docs/website-v4.md` 当前屏幕验收要求 + 上面六条铁律逐条检查；
3. 明显丑/怪/不搭的元素（尤其自绘图形的质感）先自己修掉再给用户看。

## 动效规范（源：emilkowalski skills，已装入 ~/.claude/skills：review-animations / improve-animations / animation-vocabulary）

- 缓动：入场/出场用强 ease-out `cubic-bezier(0.23, 1, 0.32, 1)`；屏上移动用 `cubic-bezier(0.77, 0, 0.175, 1)`；**永不使用 ease-in**；内置 CSS 缓动太弱，一律用自定义曲线。
- 时长：UI 动效 <300ms（按钮反馈 100-160ms、下拉 150-250ms）；营销/叙事段落可更长。
- 入场永不 `scale(0)`——从 `scale(0.95-0.97)+opacity:0` 开始。
- 只动 `transform` 和 `opacity`；stagger 间隔 30-80ms 且不阻塞交互。
- 动效必须有目的（空间一致性/状态指示/反馈/避免生硬）；高频元素不动画。
- reduced-motion = 更少更柔，保留 opacity 过渡，去掉位移。
- 动效工作启动前调用 review-animations / improve-animations skill。

## TODO（用户已定方向，待做）

- Hero 为独立 Prologue 且已冻结；不重做首屏构图，只允许为进入第二屏设计必要的边界交接。
- 桌面端优先实现 `00 / Thesis → Index`；完整验收后再逐屏打磨 01/02/03/04。
- 移动端在桌面端整体验收后单独优化，不与当前桌面轮次混做。

## 工程注意

- `npm run build` 与 dev server 共用 `.next`：build 后必须重启 dev server。
- typecheck + eslint --max-warnings 0 必须全绿。
- 验证截图存 `output/playwright/roundN/`。

## 内容红线

见 `docs/website-v4.md` §1：不出现任何投资机构/导师名字；集成现状只有 Polymarket（Live），其余（Predict.fun / Hyperliquid / Aster / bStocks）标 Coming。
