# SmartX iPhone 官网 · ios-app 分支

更新：2026-09-02。本文记录用户确认的 iOS 首发官网范围；`main` 的长页营销方案不适用于此分支。

## 产品与页面范围

- 只描述聪明钱看板、Token 看板、注册登录和个人信息设置。
- 保留原首页黑底、Playfair 标题、IBM Plex 正文和人物品牌片构图，不重新设计。
- 标题：`On-chain data, made clear.`；正文：`Explore smart money activity and token data, all in one place.`。首页、搜索摘要和分享预览共用同一套文案；注册和资料设置不作为首屏卖点。
- 首页底部仅版权、Support、Privacy Policy、Terms of Service；移除无实际登记功能的 Waitlist 按钮及投资机构背书。
- 顶部仅保留返回首页的 SmartX 标志；首页及共享页眉不再重复提供导航，也不保留手机菜单及其状态、样式。
- 公开页面仅 `/`、`/support`、`/privacy-policy`、`/terms`，另有静态 404、robots、sitemap 和分享图。
- 不新增交易、预测市场、跟单、提醒、AI 推荐、钱包托管、支付等首发版本未确认功能的宣传。
- 法律正文的“不执行交易、不托管资产”等范围说明和真实数据处理披露保持不变，不能按关键词机械删去。
- 保留真实支持邮箱 `support@smartx.io`；没有创建或假定 `smartx.fun` 邮箱。账户删除的既有路径仍需在提交前与实际 App 核对。

## 素材与源码清理

- 删除旧长页的闲置导出、产品预览、V4、博客、Memory 演示、旧 Web App 跳转工具、对应样式和博客测试。
- 删除仅旧组件使用的 `react-icons` 依赖，以及 69 个不再使用的已跟踪资源。历史版本保留在 Git 提交 `3f00606`；本机另有临时备份 `/tmp/smartx-ios-assets.IW7kfl`。
- 用户未提交的品牌片文档、`scripts/` 与七张 PNG 原始素材不改动、不删除。
- 新品牌片从原 `hero-film.mp4` 保留 `0–2.65s` 和 `5.0–7.23s` 两段，删除中间含市场卡片的镜头；成片约 4.87 秒，H.264、静音、1280×720。封面取新片 1.8 秒。
- `social-preview.png` 在构建期生成，只含品牌与当前产品描述，不需要线上 Node 服务。
- 全局 layout、首页、Support、Privacy Policy、Terms 和 404 的 Open Graph / Twitter 分享图均使用 `/social-preview.png`（1200×630）。已检查实际图片，只有 SmartX、当前标题和看板描述；旧 `smartx-social-share.png` 已移除。发布测试同时校验兜底继承、图片地址、替代文字与分享元信息中无旧交易宣传。

## 构建与交付

- `npm run build`：静态导出、按 `tooling/public-assets.mjs` 的 13 项资源清单清理输出、运行发布产物测试。
- `npm run typecheck`、`npm run lint -- --max-warnings 0`：代码检查。历史本地设计脚本不参与 lint；本分支的构建工具在 `tooling/`，正常参与检查。
- `npm test`：在已有 `out/` 上核对文案、元信息、本地链接、路由、资源清单与旧功能声明残留；保留法律边界和支持联系方式的回归检查。
- `npm start`：预览 `out/`，默认端口 3000。生产只发布 `out/`，不要直接发布 `public/`，也不要跳过完整构建流程。
- 发布清理仅影响生成的 `out/`；不会删除 `public/` 中的用户原件。macOS `.DS_Store` 不进入交付物。
- 无障碍保留跳过链接、键盘焦点和 reduced-motion 静态封面。

## 验证与剩余事项

- 浏览器验收素材保存在忽略目录 `output/ios-app-review/`；包括桌面、手机、缩小屏幕、reduced-motion 与滚动录屏。
- 用户已授权检查后提交并推送到 `origin/ios-app`；不修改 `main`，不另行操作线上部署，也不代表 App Store 审核保证。
- 依赖检查发现既有构建工具链告警：生产依赖树 2 项 high、1 项 moderate（涉及 nanoid / PostCSS / Next 依赖关系）。本轮仅移除闲置依赖，未执行自动修复或框架大版本升级；需要另行评估修复。生产交付为静态文件，但这不替代构建环境的依赖维护。
