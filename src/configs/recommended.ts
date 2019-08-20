export = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["@typescript-eslint", "import", "jsx-a11y", "react"],
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "@h4iuiuc/no-anonymous-parameterless-functions": "error",
    "arrow-body-style": ["error", "as-needed"],
    curly: "error",
    eqeqeq: "error",
    "no-console": "off",
    "no-duplicate-imports": "error",
    "no-else-return": "error",
    "no-empty-function": "error",
    "no-lone-blocks": "error",
    "no-magic-numbers": ["error", { ignore: [0, 1] }],
    "no-multi-spaces": "error",
    "no-redeclare": "error",
    "no-sequences": "error",
    "no-useless-escape": "off",
    "no-useless-constructor": "error",
    "no-template-curly-in-string": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    "react/no-unescaped-entities": "off",
    "require-await": "error"
  }
};
