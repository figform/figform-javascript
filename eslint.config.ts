import eslint from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default tseslint.config(
  globalIgnores(["build/**/*", "coverage/**/*"]),
  eslint.configs.all,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      "func-style": "off",
      "no-duplicate-imports": "error",
      "sort-imports": "off",
    },
  },
  prettierRecommended,
);
