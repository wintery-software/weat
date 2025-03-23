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
      curly: "error",
      semi: "error",
      "prefer-const": "error",
    },
  }),
];

export default eslintConfig;
