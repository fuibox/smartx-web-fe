import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".next-build/**",
      ".test-dist/**",
      ".claude/**",
      ".impeccable/**",
      ".playwright-cli/**",
      ".vercel/**",
      "audit/**",
      "node_modules/**",
      "out/**",
      "output/**",
      "public/**",
      "next-env.d.ts",
      "src/locales/**/messages.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
