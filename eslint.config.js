import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwind from "eslint-plugin-tailwindcss";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist", "node_modules", ".tsbuild-node"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.es2022 },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "tailwindcss": tailwind,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "tailwindcss/classnames-order": "off", // Tailwind v4 @theme doesn't need order enforcement
      "tailwindcss/no-custom-classname": "off", // Allow custom @theme classes
    },
    settings: {
      tailwindcss: {
        config: "src/styles/globals.css", // Point to our CSS file with @theme
      },
    },
  },
);
