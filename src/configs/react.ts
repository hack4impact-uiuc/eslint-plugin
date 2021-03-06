export default {
  plugins: ["jsx-a11y", "react", "react-hooks"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  extends: ["plugin:jsx-a11y/recommended", "plugin:react/recommended"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "@hack4impact-uiuc/no-access-state-after-set": "error",
    "@hack4impact-uiuc/no-null-ternary": "error",
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
