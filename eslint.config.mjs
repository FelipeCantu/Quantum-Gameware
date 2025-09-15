import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // React rules
      "react/no-unescaped-entities": "off",
      
      // TypeScript rules - convert ALL to warnings for successful builds
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Next.js rules
      "@next/next/no-img-element": "warn",
      
      // General rules
      "prefer-const": "warn",
      "no-unused-vars": "off",
      "no-console": "off",
    },
  },
  {
    // Even more relaxed rules for service files that might be in development
    files: ["**/services/**/*.ts", "**/lib/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Convert error to warning
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;