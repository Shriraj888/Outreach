import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Enforce no `any` — the single most impactful type-safety rule
      "@typescript-eslint/no-explicit-any": "warn",
      // Catch unused variables (ignore _ prefixed args)
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Allow unused catch bindings
      "no-unused-vars": "off",
      // Allow empty catch blocks (used for JSON parse fallbacks)
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "components/ui/",
    ],
  },
];
