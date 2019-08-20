export = {
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript"
  ],
  rules: {
    "@h4iuiuc/no-null-ternary": "error",
    "@h4iuiuc/no-anonymous-parameterless-props": "error",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        allowExpressions: true
      }
    ],
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-magic-numbers": [
      "error",
      {
        ignore: [0, 1]
      }
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-magic-numbers": "off"
  }
};
