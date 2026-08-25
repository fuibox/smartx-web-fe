# SmartX Consumer Network 官网改版交接说明

> 状态：桌面版持续视觉评审中  
> 分支：`codex/consumer-network-stage-20260825`
> 更新日期：2026-08-25  
> 适用范围：`src/components/consumer-network/` 与 `public/assets/consumer-network/`

这份文档记录当前 Consumer Network 官网改版的设计判断、产品事实、动效合同和素材来源。后续 AI 或开发者接手时，应先读仓库根目录 `AGENTS.md` 和 `docs/website-v4.md`，再读本文件。若产品 UI、Figma 或产品负责人给出更新信息，以更新信息为准，并同步回写本文件。

## 1. 设计目标

官网不是功能 Demo，也不是组件陈列页。每一屏必须只有一个主判断和一个视觉主角；产品可信度来自真实 UI 结构、真实字段和真实状态。

当前视觉方向：

- 黑色主画布、teal 产品语义色、克制的开放式产品切片。
- 不用额外的展示容器把产品 UI 硬包起来；上下用遮罩、裁切或轻微模糊让切片自然延续出画面。
- 动效只解释产品状态变化：P&L 改变排名、Feed 推荐向上流动、Signal 右滑执行 Quick Copy。
- 桌面端以 `1440 × 900` 为基准，视觉判断由产品/UI 负责人完成；自动化只验证结构、时序、溢出和降级状态。

## 2. 外部设计与文案来源

| 来源 | 用途 | 备注 |
| --- | --- | --- |
| [SmartX 对接文档 · Figma 主稿](https://www.figma.com/design/t38RJ52jEzew2IHUY4EwTA/SmartX-%E5%AF%B9%E6%8E%A5%E6%96%87%E6%A1%A3?node-id=22134-8148) | 官网总体构图、各屏文字与产品图比例 | 不合理项允许按产品事实修正，例如导航靠右、移除 Login |
| [第三、第四屏产品 UI · Figma](https://www.figma.com/design/t38RJ52jEzew2IHUY4EwTA/SmartX-%E5%AF%B9%E6%8E%A5%E6%96%87%E6%A1%A3?node-id=22160-8894) | 第三、第四屏产品 UI 图 | 产品/UI 负责人持续替换素材 |
| [2026-08-25 最新第 3–6 屏 · Figma](https://www.figma.com/design/t38RJ52jEzew2IHUY4EwTA/SmartX-%E5%AF%B9%E6%8E%A5%E6%96%87%E6%A1%A3?node-id=22228-636) | 第三、第四、第六屏当前视觉基准 | 本轮采用 `22228:727`、`22228:758`、`22228:783`；第五屏采用独立生成并确认的 SmartX Hub 构图 |
| [Signal Card 产品参考 · Figma](https://www.figma.com/design/t38RJ52jEzew2IHUY4EwTA/SmartX-%E5%AF%B9%E6%8E%A5%E6%96%87%E6%A1%A3?node-id=22148-30) | 第二屏第三列的 Signal Card 排版、deck rail 与 Quick Copy 语义 | 卡片紧凑比例约为 `398 × 230`；官网按列宽适配，不改变内部信息层级 |
| [官网文案 · Google Docs](https://docs.google.com/document/d/16n07df30yycBf43UopOtqErBdMOdtUfgEoqwi4XL4Lc/edit?tab=t.0) | 当前英文文案来源 | Docs/GitBook 公开入口暂时移除 |
| `../smartx-mobile-v2-demo/` | 第二屏真实移动端 UI、字段、交互和演示数据 | 第二屏产品结构的主要事实来源 |
| `../smartx-fe-dev/` | 正式产品结构与最新 Signal/Market 事实交叉检查 | 若与纯 demo 冲突，先确认产品状态，不自行拼接两套 UI |

## 3. 全站已确认判断

- Hero 描述桌面端分两行：第一行结束于 `prediction markets.`，第二行是 `Follow verified traders and trade in one tap.`；H5 使用独立的固定三行排版。
- Hero 主视觉使用 `hero-film.mp4`：源片为 `7.23s / 1280 × 720 / H.264 / 无音轨`，按 Robinhood 式全屏背景处理，必须 `muted + playsInline + loop` 自动播放。视频离开首屏后暂停，回到首屏继续；`prefers-reduced-motion` 下隐藏视频并固定显示从 3 秒镜头提取的 `hero-film-poster.jpg`。
- 顶部导航整体靠右，不做视觉居中；官网不显示 Login。当前入口为 `X / Community / Blog`，不保留含义模糊的 `Product`。
- Blog 的桌面与 H5 Header 复用首页的品牌锁定、Logo 尺寸和 `X / Community / Blog` 顺序；H5 使用汉堡菜单，主题切换器收进菜单，右侧 CTA 保留 `Launch Alpha`。Blog Footer 与首页保持同一份 `App / Blog` 目录和移动端 SmartX 大字标适配。
- Hero 右上角主入口使用 `Launch Alpha` 并进入当前 Alpha；Hero 与 Closing 的 `Join the Waitlist` 暂不提交表单，点击后原位提示 `Coming soon`。
- Docs/GitBook 入口暂时移除。
- Discovery eyebrow 使用句式大小写 `Personalized for you`，不使用全大写。
- 第二屏与第三屏共用一套中性的虚拟身份：`Clear Signal / North Index / Open Ledger / Quiet Market`，不使用廉价的编号占位名，也不显示可能属于真实用户的 `@handle`；副信息只写 `Verified profile / Demo profile`。社交推荐用 `A trader you follow liked this` 等中性关系文案，不暗示任何真实账号参与或背书。
- 第二屏三列标题和说明文字保持紧密关系，当前间距为 `4px`；三列标题使用同一顶部基线。
- H5 Hero 对 16:9 视频使用居中 `object-fit: cover` 裁切；人物、teal 路径和手机在当前镜头中都必须保持可识别。导航、主标题、固定三行说明和 CTA 使用独立纵向节奏，稳定暗色遮罩负责可读性，不随镜头内容移动文字。
- H5 第二屏不沿用桌面三列构图；每项按“标题 → 说明 → 产品局部”纵向阅读，隐藏 `No. 01–03` 编号。
- H5 第三屏隐藏桌面流程标签，先显示标题与说明，再接透明底的 Square + People 双手机图；产品图允许横向满幅，但不能出现不透明矩形接缝。
- H5 `The next opportunity finds you.` 与 `One Account. Every Market.` 都使用“文案区 → 独立视觉区”的纵向构图，不把正文压在复杂产品 UI 或线路图之上。视觉区允许裁切放大主要实体，但上下用暗场渐隐衔接，并控制整屏高度，避免长幅背景造成空洞滚动。
- H5 `Turn influence into income` 与 `The next opportunity finds you.` 共用同一标题、eyebrow 和正文字阶；`Performance → Rank → Audience → Income` 必须完整保留并压缩为单行窄屏流程，不得因移动端隐藏。One Account 的裁切以 SmartX Hub 接近视觉中心为准，同时保留左右入口与链路的存在感。
- 第四屏在大屏构图中，产品 UI 需要上移以修正视觉重心。
- `Be early` 使用 Figma `22228:784` 的高清点阵波纹。几何位置保持静止，只做低幅度亮度呼吸；不能回退到竖线轨道、连续位移的波面、多个错位圆形或多张图片叠加。

### Be early 同心波纹

- 视觉来源：Figma `22228:783 / 22228:784`。Robinhood 参考不再进入画面；不复制雨丝构图、旋转轨道或荧光绿色。
- 实现方式：`ClosingGlowField` 只渲染一张 `closing-dot-waves.webp`，不使用 Canvas、位移、缩放或多层叠图。
- 动效只在 `12s` 周期内把图片透明度从 `0.72` 缓慢过渡到 `0.84`，形成温和的发光呼吸；圆点和波纹的几何位置不变，避免持续径向位移引起眩晕。
- 标题与 CTA 周围沿用原图的安静区，不增加额外光晕或随机粒子。
- `prefers-reduced-motion` 下停止呼吸，固定为 `0.78` 透明度。
- 旧点阵与轨道方案只保留在 Git 历史和阶段分支中，不进入 main 的公开素材目录。

## 4. 第二屏产品叙事

### 4.1 Verified, not claimed

目的：证明排行榜来自真实 P&L，而不是自我声明。

- 使用开放式四行排行榜，不显示局部 `Leaderboard` 标题、范围切换器或轮播点。
- Clear Signal 的 `30D P&L` 先从 `+$118.6K` 递增到 `+$164.2K`，再到 `+$219.8K`。
- P&L 完成变化后，Clear Signal 从 02 平滑移动到 01；North Index 同时下移。
- 数值变化必须先于排名变化，建立清楚因果。
- 循环复位时不整块淡出；只让数值和行位置回到起始状态。

### 4.2 Picked for you

目的：表达 Square 的 `For You` 是基于用户交易兴趣和社交关系形成的真实 Feed。

- 保留真实 Square 顶栏和独立的 `For You / Newest / Friends` lanes。
- Feed 只做纵向移动，不与排行榜换位或 Signal 横滑重复。
- 必须保留中性的社交推荐关系，例如 `A trader you follow liked this` 和 `3 traders you follow liked this`，不得出现未经授权的真实姓名或 handle。
- 三类仓位卡的右侧固定为 `Position value` 数值与下方 PnL；不得根据标的类型把右侧替换成市值、买入价或交易事件。
- Prediction 左侧显示市场、用户实际持有的 `Yes/No` side 与 average entry，不得使用市场 short name 代替交易 side。
- Token 左侧直接写标的，例如 `PUMP token`，第二行写以 market cap 表达的 average entry；不增加 `Position · Open` 或 `Bought` 前置标签。
- Tokenized stock 左侧直接写标的，例如 `AAPLx`，第二行用价格表达 average entry，因为股票仓位的买入价格比市值更有意义。
- 当前内容覆盖三类资产：二元预测市场、meme coin（PUMP）、代币化股票（AAPLx）。三条内容的图标、字段和值必须有明显区别。
- 循环结构为三条不同内容加一条首项副本；首项副本只用于无缝回到循环开头。

### 4.3 One tap to trade

目的：让访客在一个短循环中理解“看到机会、右滑确认、成交反馈、下一张机会进入”。下一张不能在成交确认前提前露出。

产品还原规则：

- Signal Card 结构以 `../smartx-mobile-v2-demo/src/components/home/HomeScreen.tsx` 的 `SignalCard` 为准。
- 样式以 `../smartx-mobile-v2-demo/src/components/home/HomeScreen.module.css` 的 `.signalDeck`、`.signalCard`、`.signalTrader`、`.signalMarket`、`.signalPosition` 和 `.signalQuote` 为准。
- 官网实现保留原产品的层级、比例和字段；Signal 产品切片允许沿用 Figma 的 `8–12px` 字体层级，避免把辅助信息放大成与主信息等权。当前卡片在 `1440 × 900` 下约为 `398 × 230px`，不是对移动端截图做机械缩放。
- 卡片必须包含 trader、30D win rate、30D P&L、市场标题、opinion、可交易的 outcome/side、投入金额、position value、entry/current 和 copied count。
- 卡片本身不加入官网风格的额外标题、玻璃高光或装饰渐变。
- 当前卡下方保留与真实产品一致的 deck underlay；underlay 使用当前卡自身的低饱和、轻模糊残影，而不是下一张机会或一块空的装饰底板。
- 官网切片不显示 `Swipe left to skip · right to copy` 底部说明文字；方向语义在卡片被拖动时由原位残影上的 `Copy` / `Skip` 提示承担。

两卡循环合同：

1. DOM 中有 A/B 两张不同内容的 Signal Card，但任一时刻只能显示当前一张；未成交前下一张必须保持 `opacity: 0`。
2. A 开始右滑时，只揭示 A 自身的 underlay 残影；残影上出现斜向 `Copy · 5 USDC`，不能把 B 当作后卡提前露出。
3. A 释放后使用强 ease-out 快速离场；顶部 toast 在 `160ms` 内进入。只有成交确认已经出现后，B 才在 `160ms` 内进入原卡位置。
4. Toast 完整可见至少 `2s`，随后以 `160ms` 退出；toast 退出后到下一次滑动之间保留约 `1.84s` 的稳定阅读时间。
5. 随后 B 向左滑表示 `Skip / Not interested`，揭示 B 自身的残影与红色 `Skip` 提示；跳过不显示成交 toast。B 完成离场后 A 回到原位，循环边界上 A 的最终状态必须与循环开头一致。
6. Tinder 式手感来自当前卡的跟手位移、轻微旋转、原位虚影和释放加速；不靠预露下一张、夸张弹跳、粒子或大面积光效。
7. 自动演示以 `12s` 完成一次右滑交易和一次左滑跳过；每次跟手阶段约 `480ms`，释放离场约 `160ms`，交易 toast 进入/退出各约 `160ms`。
8. 动画只修改 `transform` 和 `opacity`；underlay 的背景、边线和阴影保持静态，不在运动中改变布局属性。
9. `prefers-reduced-motion` 下：A 静态覆盖 underlay，B 保持隐藏；不播放手势、不显示没有触发依据的成交 toast。

当前两张演示卡：

- A：North Index / `Fed Decision in September?` / `No change` / Entry `61¢` → Current `64¢`。
- B：Clear Signal / `Will Bitcoin reach $150K before 2027?` / `Yes` / Entry `34¢` → Current `38¢`。

## 5. One Account 当前方案

这一屏只讲一条连续链路：`Apple / Google / Bank / Exchange → SmartX → supported markets and chains`。不把登录、入金、统一账户和交易拆成三张等权功能卡。

- 当前视觉主角为单一 SmartX Owl Hub。左侧 Apple、Google、Bank、Coinbase 与 Binance 作为账户和资金入口，右侧 Solana、Robinhood、Base 与 BNB Chain 作为明确的市场/链锚点。SmartX Hub 与线路使用品牌主色 `#08DFB5`；第三方 Logo 保持各自原始品牌色。
- 右侧同时保留少量无标签线路，并在画面边缘自然衰减，表达支持范围可以继续扩展；不加入 Polygon 或未经确认的具体链 Logo。
- 背景素材不含任何文案，`One Account. Every Market.` 及说明始终由 HTML 渲染，确保清晰度、可访问性和响应式排版。
- 桌面端保持图片自然方向，不翻转；素材缩至约 `94%`，SmartX Hub 位于左侧视觉区，右侧暗场留给文案。四周用短距离透明遮罩融入页面暗场；文案区另用一块椭圆软遮罩让线路在文字背后消失，不形成硬边矩形，也不覆盖 Hub 和主要链 Logo。
- 动效只在进入视口时做一次约 `1.4s` 的轻微位移与显现，阅读期间保持静止。`prefers-reduced-motion` 下直接显示最终状态。

## 6. 素材来源表

| 站内素材 | 原始来源 | 类型 | 说明 |
| --- | --- | --- | --- |
| `performance-product-latest.webp` | Figma `22228:728` | Figma 原始透明 PNG 的高质量 WebP 交付版 | 第三屏 Square + People 双手机组合；文件 `2894 × 3943`，页面按 Figma 节点 `678 × 923` 的比例显示；透明底避免 H5 出现矩形接缝 |
| `discovery-scene-latest.webp` | Figma `22228:761` | Figma 节点 `2×` PNG 的高质量 WebP 交付版 | 第四屏手机与暗色交易台场景；文件 `2492 × 1600`，页面按 `1246 × 800` 显示并对左边缘做渐隐融合 |
| `closing-dot-waves.webp` | Figma `22228:784` | Figma 节点原始 PNG 的高质量 WebP 交付版 | 第六屏 `1920 × 600` 点阵主视觉；几何静止，仅做低幅度透明度呼吸 |
| `account-hub-network-brand-teal.webp` | Figma `22160:9028` SmartX Hub 方向、产品/UI 反馈与 SmartX 品牌色 `#08DFB5` | ImageGen 精准调色图的高质量 WebP 交付版 | 第五屏 `1920 × 800` 背景；只把 Hub、线路与 SmartX 边缘光校正为品牌 teal，第三方 Logo 保持原色，无内嵌文案 |
| `product-ui/avatar-rowdy.png` | `../smartx-mobile-v2-demo/public/assets/avatars/7.png` | 原文件复制 | Rowdy 头像，哈希一致 |
| `product-ui/avatar-quarterty.png` | `../smartx-mobile-v2-demo/public/assets/avatars/2.png` | 原文件复制 | Quarterty 头像，哈希一致 |
| `product-ui/avatar-smartx.png` | `../smartx-mobile-v2-demo/public/assets/avatars/1.png` | 原文件复制 | SmartX Owl 头像，哈希一致 |
| `product-ui/market-fed.png` | `../smartx-mobile-v2-demo/public/figma/profile/market-fed.png` | 原文件复制 | Fed 市场缩略图，哈希一致 |
| `product-ui/token-pump.svg` | `../smartx-mobile-v2-demo/public/assets/tokens/pump.svg` | 本地精简 SVG | 保留原 PUMP 图形语义 |
| `product-ui/token-aaplx.svg` | `../smartx-mobile-v2-demo/public/assets/brand/apple.svg` | 本地衍生 SVG | 用于 AAPLx tokenized-stock 演示，正式产品导出到位后替换 |
| `product-ui/market-bitcoin.svg` | `../smartx-mobile-v2-demo/public/assets/predictions/bitcoin-150k.png` | 小尺寸矢量化衍生 | 只服务官网 40px 缩略图；正式产品导出到位后替换 |
| `product-ui/signal-chevron-right.svg` | Figma `22148:109` | Figma 原始导出 | Signal footer 的 entry → current 图标 |
| `product-ui/signal-copy.svg` | Figma `22148:115` | Figma 原始导出 | Signal footer 的 copied 图标 |
| `product-ui/signal-copy-action.svg` | Figma `22148:56` | Figma 原始导出 | 右滑残影上的 Copy 图标 |
| `product-ui/signal-skip-action.svg` | Figma `22148:50` | Figma 原始导出 | 左滑残影上的 Skip 图标 |

素材替换规则：

- 优先替换为产品/UI 提供的原始导出，不使用截图二次放大。
- 新素材必须记录原始路径、导出节点或提供人，以及是否为临时衍生。
- 不改变产品图宽高比来强行填满；市场图在固定方形槽位中使用 `object-fit: cover`。
- 不从 FOMO 或其他第三方官网直接复制素材；第三方只用于构图和动效参考。

## 7. 实现位置

| 文件 | 职责 |
| --- | --- |
| `src/components/consumer-network/consumer-home.tsx` | 页面结构、H5 导航与滚动进入；`ClosingGlowField` 负责 Be early 静态点阵的柔和呼吸 |
| `src/components/consumer-network/network-product-previews.tsx` | 第二屏三个真实产品切片及字段 |
| `src/components/consumer-network/consumer-home.module.css` | 第二屏布局、循环关键帧、Signal underlay 与 reduced-motion |
| `public/assets/consumer-network/product-ui/` | 第二屏产品素材 |
| `design-qa.md` | 每轮设计与动效自检结果 |

## 8. 验收清单

每轮修改第二屏后至少检查：

- `1440 × 900` 下三列产品区高度一致，三列标题顶部基线一致。
- 排行榜为四行；P&L 变化先于换位。
- Square 社交推荐来源仍然可见；Token/stock 不出现 `Bought`；Prediction 使用 `Yes/No`。
- 两张 Signal Card 的 trader、市场、side 和数值不同。
- 当前卡拖动和释放期间下一张卡保持不可见；只出现原位 underlay 和斜向 Copy 提示。
- Toast 完整可见段不少于 `2s`；确认出现后下一张才进入，两次滑动之间存在稳定停顿。
- Underlay 本身保持静态，运动只涉及 `transform/opacity`。
- 循环边界没有整屏闪烁、卡片层级跳变或空白帧。
- 离开第二屏后循环暂停；重新进入后可以继续。
- reduced-motion 下不存在位移循环，也不会凭空显示成功 toast。
- TypeScript、ESLint、生产构建和 `git diff --check` 全部通过。

## 9. 禁止回退的方向

- 不把第二屏恢复成三张模糊静态截图。
- 不用同一个市场图和同一组字段伪装三种资产。
- 不在 Square 上增加无产品依据的左右轮播或切换器。
- 不把 Signal 成交结果做成替换整张卡片的大型成功面板。
- 不为了“更有动效”增加无语义粒子、随机光晕、无限漂浮或控制台式组件。
- 不在成交确认前提前显示下一张 Signal Card；不把 underlay 虚影误画成可读的第二张卡。
- 不把 toast 缩短成快速闪现；完整可见时间不得少于 `2s`。
