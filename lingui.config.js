/** @type {import("@lingui/conf").LinguiConfig} */
module.exports = {
  locales: ["en", "zh-CN", "ko", "ja"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
      // 文章内容(content)与未挂载的 V4 遗留组件不进入翻译目录
      exclude: [
        "**/node_modules/**",
        "**/src/content/**",
        "**/src/components/v4/**",
        "**/src/components/memory-demo/**",
        "**/src/locales/**",
      ],
    },
  ],
  format: "po",
  compileNamespace: "ts",
};
