# eslint-plugin [![npm package](https://img.shields.io/npm/v/@hack4impact-uiuc/eslint-plugin)](https://www.npmjs.com/package/@hack4impact-uiuc/eslint-plugin) [![build](https://img.shields.io/github/workflow/status/hack4impact-uiuc/eslint-plugin/CD)](https://github.com/hack4impact-uiuc/eslint-plugin/actions?query=workflow%3ACD)

An ESLint plugin intended for use with Hack4Impact UIUC projects.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```shell
npm i eslint --save-dev
```

Next, install `@hack4impact-uiuc/eslint-plugin`:

```shell
npm install @hack4impact-uiuc/eslint-plugin --save-dev
```

## Usage

To enable `@hack4impact-uiuc/eslint-plugin`, you'll need to create a `.eslintrc.json` file for ESLint configuration.

This plugin abstracts away configuration from the user, extending configs from `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, and `eslint-plugin-react-hooks` through the `recommended` config (inspired by `eslint-config-react-app`).

For a JavaScript-only app all you'll need to have in your `.eslintrc.json` file is the following:

```json
{
  "plugins": ["@hack4impact-uiuc"],
  "extends": ["plugin:@hack4impact-uiuc/recommended"]
}
```

If your app uses TypeScript at all, you'll want to use `@typescript-eslint/eslint-plugin` by extending the `typescript` config as follows:

```json
{
  "plugins": ["@hack4impact-uiuc"],
  "extends": [
    "plugin:@hack4impact-uiuc/recommended",
    "plugin:@hack4impact-uiuc/typescript"
  ]
}
```

If you need to modify or disable specific rules, you can do so in the `rules` section of your `.eslintrc.json` file. For example, if you wish to disable `no-reduntant-functions`, add the following to your `.eslintrc.json` file:

```json
{
  "rules": {
    "@hack4impact-uiuc/no-redundant-functions": "off"
  }
}
```

Note that disabling rules from plugins requires prefixing them with their corresponding scope and/or plugin name.

### Fixes

Some rules (see table below) are fixable using the `--fix` ESLint option.

## Supported Rules

### Rules

| Rule                                                                      | Default                   | Fixable            |
| ------------------------------------------------------------------------- | ------------------------- | ------------------ |
| [**no-access-state-after-set**](/docs/rules/no-access-state-after-set.md) | :triangular_flag_on_post: | :x:                |
| [**no-null-ternary**](/docs/rules/no-null-ternary.md)                     | :triangular_flag_on_post: | :heavy_check_mark: |
| [**no-redundant-functions**](/docs/rules/no-redundant-functions.md)       | :triangular_flag_on_post: | :heavy_check_mark: |

### Key

| Symbol                    | Meaning                     |
| ------------------------- | --------------------------- |
| :triangular_flag_on_post: | Error                       |
| :warning:                 | Warning                     |
| :heavy_multiplication_x:  | Off                         |
| :heavy_check_mark:        | Fixable and autofix-enabled |
| :x:                       | Not fixable                 |
