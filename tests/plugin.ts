/**
 * @file Ensuring the plugin is properly structured
 */

import plugin from "../src";
import { describe, it } from "mocha";
import { assert } from "chai";

/**
 * A list of all currently supported rules
 */
const ruleList: string[] = [];

/**
 * Verifies that each inputted rule is properly structured
 * @param ruleName the name of the rule to test
 * @param rules the ESLint plugin rules object containing all rule information
 * @throws chai assert errors if the provided rule is not configured properly
 */
const testRule = (ruleName: string, rules: any): void => {
  describe(ruleName, (): void => {
    it(`${ruleName} should be a member of rules`, (): void => {
      assert.property(rules, ruleName, `${ruleName} is not a member of rules`);
    });

    const rule = rules[ruleName];

    describe("meta", (): void => {
      it(`meta should be a member of ${ruleName}`, (): void => {
        assert.property(rule, "meta", `meta is not a member of ${ruleName}`);
      });

      const meta = rule.meta;

      describe("docs", (): void => {
        it("docs should be a member of meta", (): void => {
          assert.property(meta, "docs", "docs is not a member of meta");
        });

        const docs = meta.docs;

        describe("description", (): void => {
          it("description should be a member of docs", (): void => {
            assert.property(
              docs,
              "description",
              "description is not a member of docs"
            );
          });

          const description = docs.description;

          it("description should be a string", (): void => {
            assert.isString(description, "description is not a string");
          });
        });

        describe("category", (): void => {
          it("category should be a member of docs", (): void => {
            assert.property(
              docs,
              "category",
              "category is not a member of docs"
            );
          });

          const category = docs.category;

          it("category should be a string", (): void => {
            assert.isString(category, "category is not a string");
          });
        });

        describe("recommended", (): void => {
          it("recommended should be a member of docs", (): void => {
            assert.property(
              docs,
              "recommended",
              "recommended is not a member of docs"
            );
          });

          const recommended = docs.recommended;

          it("recommended should be a boolean", (): void => {
            assert.isBoolean(recommended, "recommended is not a boolean");
          });
        });
        describe("url", (): void => {
          it("url should be a member of docs", (): void => {
            assert.property(docs, "url", "url is not a member of docs");
          });

          const url = docs.url;

          it("url should be a string", (): void => {
            assert.isString(url, "url is not a string");
          });
        });
      });
      describe("schema", (): void => {
        it("schema should be a member of meta", (): void => {
          assert.property(meta, "schema", "schema is not a member of meta");
        });

        const schema = meta.schema;

        it("schema should be an array", (): void => {
          assert.isArray(schema, "schema is not an array");
        });
      });
    });

    describe("create", (): void => {
      it(`create should be a member of ${ruleName}`, (): void => {
        assert.property(
          rule,
          "create",
          `create is not a member of ${ruleName}`
        );
      });

      const create = rule.create;

      it("create should be a function", (): void => {
        assert.isFunction(create, "create is not a function");
      });
    });
  });
};

/**
 * Verifies the structure of the plugin
 * @throws chai assert errors if the plugin is not configured properly
 */
describe("plugin", (): void => {
  describe("rules", (): void => {
    it("rules should be a member of the plugin", (): void => {
      assert.property(plugin, "rules", "rules is not a member of the plugin");
    });

    it("the number of rules should match the expected value", (): void => {
      assert.equal(Object.keys(plugin.rules).length, ruleList.length);
    });

    const rules = plugin.rules;

    ruleList.forEach((rule: string): void => {
      testRule(rule, rules);
    });
  });

  describe("configs", (): void => {
    it("configs should be a member of the plugin", (): void => {
      assert.property(
        plugin,
        "configs",
        "configs is not a member of the plugin"
      );
    });

    const configs = plugin.configs;

    describe("recommended", (): void => {
      it("recommended should be a member of configs", (): void => {
        assert.property(
          configs,
          "recommended",
          "recommended is not a member of configs"
        );
      });
    });

    describe("typescript", (): void => {
      it("typescript should be a member of configs", (): void => {
        assert.property(
          configs,
          "typescript",
          "typescript is not a member of configs"
        );
      });
    });
  });
});
