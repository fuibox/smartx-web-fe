import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // 图片优化第二轮再开（需要 remotePatterns 白名单），先保持与静态导出一致的行为。
  images: {
    unoptimized: true,
  },
  experimental: {
    swcPlugins: [["@lingui/swc-plugin", {}]],
  },
};

export default nextConfig;
