export = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    es6: true,
    node: true
  },
  plugins: ["import", "jsx-a11y", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  settings: {
    react: {
      version: "detect"
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    "@h4iuiuc/no-null-ternary": "error",
    "@h4iuiuc/no-anonymous-parameterless-props": "error",
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
    "no-nested-ternary": "error",
    "no-redeclare": "error",
    "no-sequences": "error",
    "no-useless-escape": "off",
    "no-useless-constructor": "error",
    "no-template-curly-in-string": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    "react/destructuring-assignment": "always",
    "react/jsx-boolean-value": ["warn", "never"],
    "react/jsx-filename-extension": "warn",
    "react/jsx-pascal-case": "warn",
    "react/no-typos": "error",
    "react/no-unescaped-entities": "off",
    "react/prop-types": "off",
    "react/style-prop-object": "error",
    "require-await": "error"
  }
};
