# eslint-plugin [![CircleCI](https://circleci.com/gh/hack4impact-uiuc/eslint-plugin.svg?style=svg)](https://circleci.com/gh/hack4impact-uiuc/eslint-plugin)

An ESLint plugin intended for use with Hack4Impact UIUC projects.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```shell
npm i eslint --save-dev
```

Next, install `@h4iuiuc/eslint-plugin`:

```shell
npm install @h4iuiuc/eslint-plugin --save-dev
```

## Usage

To enable `@h4iuiuc/eslint-plugin`, you'll need to create a `.eslintrc.json` file for ESLint configuration.

As this plugin abstracts away most of the configuration, for a JavaScript-only app all you'll need to have in your `.eslintrc.json` file is the following:

```json
{
  "plugins": ["@h4iuiuc"],
  "extends": ["plugin:@h4iuiuc/recommended"]
}
```

If your app uses TypeScript at all, you'll want to also extend the `typescript` config as follows:

```json
{
  "plugins": ["@h4iuiuc"],
  "extends": ["plugin:@h4iuiuc/recommended", "plugin:@h4iuiuc/typescript"]
}
```

If you need to modify or disable specific rules, you can do so in the `rules` section of your `.eslintrc` configuration file. For example, if you wish to disable `no-anonymous-parameterless-props`:

```json
{
  "plugins": ["@h4iuiuc"],
  "extends": ["plugin:@h4iuiuc/recommended", "plugin:@h4iuiuc/typescript"],
  "rules": {
    "@h4iuiuc/no-anonymous-parameterless-props": "off"
  }
}
```

Note that disabling rules from plugins requires prefixing them with their corresponding scope and/or plugin name.

### Fixes

Some rules (see table below) are fixable using the `--fix` ESLint option.

## Supported Rules

### Key

| Symbol                    | Meaning                     |
| ------------------------- | --------------------------- |
| :triangular_flag_on_post: | Error                       |
| :warning:                 | Warning                     |
| :heavy_multiplication_x:  | Off                         |
| :heavy_check_mark:        | Fixable and autofix-enabled |
| :x:                       | Not fixable                 |

### Rules

| Rule                                                                                    | Default                   | Fixable            |
| --------------------------------------------------------------------------------------- | ------------------------- | ------------------ |
| [**no-anonymous-parameterless-props**](/docs/rules/no-anonymous-parameterless-props.md) | :triangular_flag_on_post: | :heavy_check_mark: |
