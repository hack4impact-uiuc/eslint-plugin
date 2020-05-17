export = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
  },
  plugins: ["jsx-a11y", "react", "react-hooks"],
  extends: ["plugin:jsx-a11y/recommended", "plugin:react/recommended"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "@h4iuiuc/no-access-state-after-set": "error",
    "@h4iuiuc/no-null-ternary": "error",
    "@h4iuiuc/no-anonymous-parameterless-props": "error",
    "react/destructuring-assignment": ["error", "always"],
    "react/jsx-boolean-value": ["warn", "never"],
    "react/jsx-filename-extension": ["warn", { extensions: [".jsx", ".tsx"] }],
    "react/jsx-pascal-case": "warn",
    "react/no-access-state-in-setstate": "error",
    "react/no-typos": "error",
    "react/no-unescaped-entities": "off",
    "react/prop-types": "off",
    "react/style-prop-object": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
