import { MAGIC_NUMBERS } from "../utils";

export = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es6: true,
    es2017: true,
    es2020: true,
    node: true,
  },
  plugins: ["import"],
  extends: ["eslint:recommended", "plugin:import/recommended"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    "arrow-body-style": ["error", "as-needed"],
    curly: "error",
    eqeqeq: "error",
    "no-console": "off",
    "no-duplicate-imports": "error",
    "no-else-return": "error",
    "no-empty-function": "error",
    "no-lone-blocks": "error",
    "no-magic-numbers": ["error", { ignore: MAGIC_NUMBERS }],
    "no-multi-spaces": "error",
    "no-nested-ternary": "error",
    "no-redeclare": "error",
    "no-sequences": "error",
    "no-useless-escape": "off",
    "no-useless-constructor": "error",
    "no-template-curly-in-string": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    "require-await": "error",
  },
};