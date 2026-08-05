# SmartX Blog 阅读系统与内容契约

> 状态：V1 已实施
> 更新日期：2026-08-05
> 适用路由：`/blog`、`/blog/page/[page]`、`/blog/[slug]`

## 1. 目标

Blog 是官网的阅读层，不复刻首页章节动效。它需要同时做到：

1. 保留 SmartX 的 Pixel 标题、navy / teal 与精确索引语言。
2. 正文优先保证长时间阅读，不让品牌字体侵入段落。
3. 内容结构能够从本地数据平滑迁移到 CMS / 后端。
4. 明暗主题只改变阅读环境，不改变信息层级、图片和品牌语义。

## 2. 字体与字号映射

| 层级 | 字体 | 桌面字号 / 行高 | 移动端 | 用途 |
| --- | --- | --- | --- | --- |
| 列表页主标题 | PixelOperatorMono 700 | `56–88px / .9` | `46–62px` | SmartX Journal 品牌主命题 |
| 详情页 H1 | PixelOperatorMono 700 | `44–70px / .98` | `38–54px` | 文章标题 |
| 正文 H2 | UI / Inter 类系统字体 600 | `27–35px / 1.18` | 同比例收缩 | 一级章节，由 `section.heading` 生成 |
| 正文 H3 | UI / Inter 类系统字体 620 | `21–25px / 1.28` | 同比例收缩 | 章节内子命题，由 `heading(level: 3)` block 生成 |
| 正文 | UI / Inter 类系统字体 | `17px / 1.78` | `16px / 1.78` | 段落与列表 |
| 引用 | UI / Inter 类系统字体 520 | `21px / 1.55` | `18px` | 关键判断，不作装饰金句墙 |
| 目录章节名 | UI / Inter 类系统字体 520 | `14px / 1.45` | `14px / 1.45` | `In this dispatch` 下的 H2 导航 |
| 元信息 / 编号 | JetBrainsMono | `11–12px` | 不低于 `11px` | 日期、分类、阅读时长、目录编号 |

Pixel 只承担品牌级标题；正文 H2/H3 不使用 Pixel，以免长文出现海报感。

## 3. 正文宽度与间距

- 正文列固定最大宽度：`680px`。
- 桌面目录列：`246px`；目录吸顶偏移：`24px`。
- 详情页封面与正文共用 `680px` 内容列，位于目录右侧、首个 H2 上方；不横跨目录与正文两列。
- 详情页头部到「目录 + 封面」阅读区：`72px`；移动端：`56px`。
- 封面到首个 H2：`60px`；移动端：`42px`。
- H2 到首个内容块：`24px`。
- 连续段落：`22px`。
- H3 前 / 后：`38px / 17px`。
- 列表前：`26px`；列表项间：`14px`。
- 引用前：`34px`。
- 章节分隔：上一章节内容到分隔线 `48px`，分隔线到下一 H2 `48px`；移动端均为 `42px`。

目录的当前章节由滚动位置自动高亮；桌面端保持 sticky，窄屏改为正文前的静态目录。

## 4. 正文数据模型

页面与 CMS 之间的规范格式定义在 `src/content/blog-types.ts`：

```ts
type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 3; text: string; id?: string }
  | { type: "unordered-list"; items: readonly string[] }
  | { type: "ordered-list"; items: readonly string[] }
  | { type: "quote"; text: string };

type BlogSection = {
  id: string;
  heading: string; // 页面 H2，同时进入目录
  blocks: readonly BlogContentBlock[];
};
```

最初五篇 Medium 迁移稿仍允许在 `src/content/blog-posts.ts` 使用
`paragraphs / bullets / quote` 输入；它们会在仓储初始化时被一次性规范化为
`blocks`。2026-07-24 起同步的新内容直接使用规范 `blocks`。页面组件永远只接收
规范格式，不能直接读取迁移字段。新内容和后端返回必须直接使用 `blocks`，从而
保留内容块真实顺序。

规范化阶段会阻止以下内容进入构建：

- 同一章节同时提供 `blocks` 与旧字段。
- 空 `blocks`、空列表、空段落。
- 重复文章 slug、重复 H2/H3 id。
- 非 ISO 日期、更新时间早于发布时间、无效图片尺寸或来源 URL。
- 已发布文章缺少完整 SEO 标题与描述，或超过站内约定的字符预算。

### 列表规则

- `unordered-list`：teal 短横标记，表达并列属性或集合，没有先后关系。
- `ordered-list`：JetBrainsMono 的 `01 / 02 / 03` 计数，表达步骤、优先级或顺序。
- 不允许仅为了视觉统一把两者渲染成同一种样式；列表语义由内容决定。

## 5. 摘要、SEO 与副标题

- `excerpt`：必填，只用于站内列表摘要，不直接承担搜索摘要。
- `dek`：可选，只在详情页标题下出现；文章没有额外论点时不渲染，也不保留空白。
- `sourceUrl`：保留为内部迁移和版权溯源字段，不在公开页面显示 Medium 入口。
- `seo.title`：已发布文章必填，站内编辑预算不超过 `65` 个字符；正文 H1 仍保留文章原始标题。
- `seo.description`：已发布文章必填，站内编辑预算为 `100–170` 个字符；用于搜索结果、Open Graph、Twitter 与 BlogPosting。
- `seo.image`：可选的专用社交分享图；未提供时使用文章 `cover`。两者都必须提供 `src / alt / width / height`。

字符预算是 SmartX 的发布质量门槛，并非搜索引擎承诺的固定截断长度。页面的 canonical、robots、Open Graph、Twitter 和 JSON-LD 均从同一篇文章记录生成，禁止在页面组件中再次手写一份。

## 6. 自动阅读时长

页面不接受手填 `readTime`。`formatBlogReadTime(post)` 从 H2、H3、段落、列表、引用和文章注记自动计算：

- 拉丁文本：`220 words / minute`
- 中日韩文本：`500 characters / minute`
- 混合文本将两部分时长相加后向上取整
- 最小值为 `1 min read`

文章标题、列表摘要 `excerpt` 和图片替代文本不计入正文阅读时长。详情页 JSON-LD 同步输出 `wordCount` 与 `timeRequired`。

## 7. 明暗阅读主题

- 主题只作用于 Blog 路由，不改变官网首页。
- 首次访问固定使用 Dark，保持与 SmartX 官网一致的品牌入口。
- 用户选择写入 `localStorage` 的 `smartx-blog-theme`，后续访问优先使用保存值。
- Light 使用冷白偏绿画布，不使用纯白；teal 在浅色背景下切换为更深的可读版本。
- 封面、产品图片与文章末尾品牌 CTA 保持原始深色视觉，避免因主题切换改变素材含义。
- 主题按钮必须保留键盘 focus 与可读的 `aria-label`。

## 8. 后端 / CMS Handoff

页面依赖已经收敛到 `src/content/blog-repository.ts`，组件不直接绑定本地数组
或具体 CMS：

```ts
listBlogPosts({ page, pageSize, status }): Promise<{
  items: BlogPostSummary[];
  total: number;
  page: number;
  pageSize: number;
}>;

getBlogPost(slug: string): Promise<BlogPostDetail | null>;
getRelatedBlogPosts(slug: string, limit: number): Promise<BlogPostSummary[]>;
```

建议字段：

```ts
type BlogPostSummary = {
  slug: string;
  status: "draft" | "published";
  category: string;
  publishedAt: string;
  updatedAt?: string;
  title: string;
  excerpt: string;
  dek?: string;
  cover: { src: string; alt: string; width: number; height: number };
};

type BlogPostDetail = BlogPostSummary & {
  sourceUrl?: string; // internal only
  sections: BlogSection[];
  note?: string;
  seo: {
    title: string;
    description: string;
    image?: { src: string; alt: string; width: number; height: number };
  };
};
```

当前站点使用 Next 静态导出。接入后端 / CMS 时，应在构建阶段拉取已发布文章，并由发布动作触发重新构建；分页、详情页、sitemap 和首页最新三篇必须共享同一份发布数据。不要在四个位置各自维护文章列表。

### 当前模块边界

| 文件 | 责任 | 是否允许进入客户端 |
| --- | --- | --- |
| `blog-types.ts` | 共享内容类型 | 仅 `import type` |
| `blog-posts.ts` | 本地编辑源与 Medium 迁移输入 | 否 |
| `blog-core.ts` | 规范化、验证、排序、分页、阅读时长 | 否 |
| `blog-repository.ts` | 页面唯一数据入口与发布过滤 | 否 |
| `lib/blog-format.ts` | 日期、编号、阅读时长等轻量格式化 | 是 |

CMS 接入时只替换 repository 的数据适配层；`/blog`、详情、首页 Updates 与
`sitemap.xml` 不应改变数据读取方式。仓储只向公开页面返回 `published` 内容。

静态导出在只有一页文章时会生成 `/blog/page/1/` 作为到 `/blog/` 的规范跳转，
不会伪造 `/blog/page/2/`。当前二十一篇已发布文章已生成真实第二、三、四页，后续页数继续由
统一仓储中的 published 数量自动推导。同一天发布的文章按编辑源中的排列顺序展示，
确保首页最新三篇与运营的实际发布顺序一致。

### Medium 同步校验

- Medium RSS 仅返回最近 10 篇，不能作为“是否已经全量同步”的唯一依据。
- 每轮迁移先用 RSS 发现新稿，再用官方 Profile 的公开文章列表按 `sourceUrl` 做全量差集；缺失稿按发布日期插入编辑源。
- 同步完成后必须同时核对仓储文章数、静态分页页数、详情页数量与 sitemap URL 数量，避免内容进入数据源却漏掉分页或索引。
- `sourceUrl` 是去重和溯源键；标题变化不应导致重复导入。

内容逻辑由 `tests/blog/blog-core.test.ts` 覆盖；每次内容模型或 CMS 适配变更后
必须运行 `npm test`。

## 9. 验收清单

- H1/H2/H3 层级连续，没有为了字号跳级。
- 有序列表与无序列表语义和视觉不同。
- 目录在桌面端滚动时持续可见，并准确高亮当前 H2。
- 无 `readTime` 手填字段；正文变化会自动改变分钟数。
- 详情页没有公开 Medium 导流。
- 明暗主题刷新后保持，键盘可切换，图片不被主题滤镜处理。
- 相关文章固定最多三篇；列表固定每页六篇，不使用无限滚动。
- 首页、列表、详情、静态分页与 sitemap 只读取统一仓储中的 published 内容。
- 静态分页只在对应文章数量达到后生成，不能返回 soft 404。
- 已发布文章的 SEO 标题不超过 65 字符，描述保持在 100–170 字符，并有可解析尺寸的社交图片。
- 生成产物中的首页、Blog 列表、分页和详情页均具备 title、description、canonical、robots、Open Graph 与 Twitter 元数据。
