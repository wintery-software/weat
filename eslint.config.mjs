import { FlatCompat } from "@eslint/eslintrc";
import pluginQuery from "eslint-plugin-import";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "plugin:import/recommended", "prettier"],
    ...pluginQuery.configs["flat/recommended"],
    rules: {
      "import/no-named-as-default": "off",
      "prefer-const": "error",
      curly: "error",
      semi: "error",
      "padding-line-between-statements": [
        "error",
        // --- around all block-like statements ---
        { blankLine: "always", prev: "*", next: "block-like" },
        { blankLine: "always", prev: "block-like", next: "*" },

        // --- before every return ---
        { blankLine: "always", prev: "*", next: "return" },

        // --- *and* around any multi-line statement ---
        {
          blankLine: "always",
          prev: "*",
          next: ["multiline-expression", "multiline-block-like", "multiline-const", "multiline-let", "multiline-var"],
        },
        {
          blankLine: "always",
          prev: ["multiline-expression", "multiline-block-like", "multiline-const", "multiline-let", "multiline-var"],
          next: "*",
        },
      ],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
    },
  }),
];

export default eslintConfig;
