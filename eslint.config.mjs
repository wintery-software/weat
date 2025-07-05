import { FlatCompat } from "@eslint/eslintrc";
import drizzlePlugin from "eslint-plugin-drizzle";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    plugins: {
      drizzle: drizzlePlugin,
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.extends("plugin:@typescript-eslint/recommended"),
  ...compat.extends("plugin:drizzle/recommended"),
  {
    rules: {
      // Enforce arrow function components for React
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      // Enforce arrow functions for all function expressions
      "prefer-arrow-callback": "error",
      // Enforce arrow functions for function declarations when possible
      "func-style": ["error", "expression"],
      // Forbid function declarations (force arrow functions)
      "no-func-assign": "error",
      // Forbid all TypeScript namespaces
      "@typescript-eslint/no-namespace": "error",
      // Forbid all namespace imports (import * as ...)
      "import/no-namespace": "error",
      // Enforce padding with blank lines
      "padding-line-between-statements": [
        "error",
        // Enforce blank line before return statements
        { blankLine: "always", prev: "*", next: "return" },
        // Enforce blank line before throw statements
        { blankLine: "always", prev: "*", next: "throw" },
        // Enforce blank line before break statements
        { blankLine: "always", prev: "*", next: "break" },
        // Enforce blank line before continue statements
        { blankLine: "always", prev: "*", next: "continue" },
        // Enforce blank line before function declarations
        { blankLine: "always", prev: "*", next: "function" },
        // Enforce blank line before class declarations
        { blankLine: "always", prev: "*", next: "class" },
        // Enforce blank line before export statements
        { blankLine: "always", prev: "*", next: "export" },
        // Enforce blank line after import statements
        { blankLine: "always", prev: "import", next: "*" },
        // Enforce no blank line between import statements
        { blankLine: "never", prev: "import", next: "import" },
        // Enforce blank line before multiline blocks
        { blankLine: "always", prev: "*", next: "multiline-block-like" },
        // Enforce blank line after multiline blocks
        { blankLine: "always", prev: "multiline-block-like", next: "*" },
      ],
      // Enforce blank lines around blocks
      "lines-around-comment": [
        "error",
        {
          beforeBlockComment: true,
          afterBlockComment: false,
          beforeLineComment: false,
          afterLineComment: false,
          allowBlockStart: true,
          allowBlockEnd: true,
          allowClassStart: true,
          allowClassEnd: true,
          allowObjectStart: true,
          allowObjectEnd: true,
          allowArrayStart: true,
          allowArrayEnd: true,
        },
      ],
      // Enforce blank lines between class members
      "lines-between-class-members": [
        "error",
        "always",
        { exceptAfterSingleLine: true },
      ],
    },
  },
  {
    files: ["components/ui/**/*"],
    rules: {
      // Allow namespace imports in UI components
      "import/no-namespace": "off",
    },
  },
];

export default eslintConfig;
