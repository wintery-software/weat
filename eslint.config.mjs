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
    },
  }),
];

export default eslintConfig;
