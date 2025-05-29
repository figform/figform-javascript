import eslint from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default tseslint.config(
  globalIgnores(["build/**/*", "coverage/**/*", "dist/**/*"]),
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      "no-duplicate-imports": "error",
    },
  },
  prettierRecommended,
);
