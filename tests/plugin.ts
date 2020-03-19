import plugin from "../src";
import { describe, it, Test } from "mocha";
import { assert } from "chai";
import { existsSync, readFileSync } from "fs";

const testRule = (ruleName: string, rules: any): void => {
  describe(ruleName, (): void => {
    describe("docs", (): void => {
      const docsFilePath = `docs/rules/${ruleName}.md`;
      const fileExists = existsSync(docsFilePath);

      it(`${docsFilePath} should exist`, (): void => assert.isTrue(fileExists));

      if (fileExists) {
        const docsFileContent = readFileSync(docsFilePath, {
          encoding: "utf8"
        });

        it(`${ruleName} docs should have a header`, (): void =>
          assert.match(docsFileContent, new RegExp(`^# ${ruleName}\n\n`)));

        it(`${ruleName} docs should have examples`, (): void =>
          assert.match(docsFileContent, /## Examples\n\n/));

        it(`${ruleName} docs should have at least one correct example`, (): void =>
          assert.match(
            docsFileContent,
            /### Correct\n\n(```js(.|\n)*```\n(.|\n)*)+/
          ));

        it(`${ruleName} docs should have at least one incorrect example`, (): void =>
          assert.match(
            docsFileContent,
            /### Incorrect\n\n(```js(.|\n)*```\n(.|\n)*)+/
          ));
      }
    });

    describe("tests", (): void => {
      const testsFilePath = `tests/rules/${ruleName}.ts`;
      const fileExists = existsSync(testsFilePath);

      it(`${testsFilePath} should exist`, (): void =>
        assert.isTrue(fileExists));

      if (fileExists) {
        const testsFileContent = readFileSync(testsFilePath, {
          encoding: "utf8"
        });

        it(`${ruleName} tests use RuleTester`, (): void =>
          assert.match(testsFileContent, /ruleTester.run/));

        it(`${ruleName} tests have at least one valid test case`, (): void =>
          assert.match(
            testsFileContent,
            /valid: \[((.|\n)*{(.|\n)*}(.|\n)*)+\]/
          ));

        it(`${ruleName} tests have at least one invalid test case`, (): void =>
          assert.match(
            testsFileContent,
            /invalid: \[((.|\n)*{(.|\n)*}(.|\n)*)+\]/
          ));
      }
    });

    const rule = rules[ruleName];

    const { meta, create } = rule;

    describe("meta", (): void => {
      it(`meta should be a member of ${ruleName}`, (): void =>
        assert.property(rule, "meta", `meta is not a member of ${ruleName}`));

      const { docs, schema } = meta;

      describe("docs", (): void => {
        it("docs should be a member of meta", (): void =>
          assert.property(meta, "docs", "docs is not a member of meta"));

        const { description, category, recommended, url } = docs;

        describe("description", (): void => {
          it("description should be a member of docs", (): void =>
            assert.property(
              docs,
              "description",
              "description is not a member of docs"
            ));

          it("description should be a string", (): void =>
            assert.isString(description, "description is not a string"));
        });

        describe("category", (): void => {
          it("category should be a member of docs", (): void =>
            assert.property(
              docs,
              "category",
              "category is not a member of docs"
            ));

          it("category should be a string", (): void =>
            assert.isString(category, "category is not a string"));
        });

        describe("recommended", (): void => {
          it("recommended should be a member of docs", (): void =>
            assert.property(
              docs,
              "recommended",
              "recommended is not a member of docs"
            ));

          it("recommended should be a boolean", (): void =>
            assert.isBoolean(recommended, "recommended is not a boolean"));
        });

        describe("url", (): void => {
          it("url should be a member of docs", (): void =>
            assert.property(docs, "url", "url is not a member of docs"));

          it("url should be a string", (): void =>
            assert.isString(url, "url is not a string"));
        });
      });

      describe("schema", (): void => {
        it("schema should be a member of meta", (): void =>
          assert.property(meta, "schema", "schema is not a member of meta"));

        it("schema should be an array", (): void =>
          assert.isArray(schema, "schema is not an array"));
      });
    });

    describe("create", (): void => {
      it(`create should be a member of ${ruleName}`, (): void =>
        assert.property(
          rule,
          "create",
          `create is not a member of ${ruleName}`
        ));

      it("create should be a function", (): void =>
        assert.isFunction(create, "create is not a function"));
    });
  });
};

describe("plugin", (): void => {
  const { rules, configs } = plugin;

  describe("rules", (): void => {
    it("rules should be a member of the plugin", (): void =>
      assert.property(plugin, "rules", "rules is not a member of the plugin"));

    Object.keys(rules).forEach(ruleName => testRule(ruleName, rules));
  });

  describe("configs", (): void => {
    it("configs should be a member of the plugin", (): void =>
      assert.property(
        plugin,
        "configs",
        "configs is not a member of the plugin"
      ));

    describe("recommended", (): Test =>
      it("recommended should be a member of configs", (): void =>
        assert.property(
          configs,
          "recommended",
          "recommended is not a member of configs"
        )));

    describe("typescript", (): Test =>
      it("typescript should be a member of configs", (): void =>
        assert.property(
          configs,
          "typescript",
          "typescript is not a member of configs"
        )));
  });
});
