import { HTTP_STATUS_CODES } from "../utils";

export = {
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
  ],
  rules: {
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        allowExpressions: true,
      },
    ],
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-magic-numbers": [
      "error",
      {
        ignore: [0, 1, 60, ...HTTP_STATUS_CODES],
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-magic-numbers": "off",
  },
};
