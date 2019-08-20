import { Rule } from "eslint";

/**
 * Defines rule metadata.
 * @param ruleName the name of the rule.
 * @param ruleDescription a description of the rule.
 * @param fix if the code is fixable by code or whitespace (optional).
 * @returns the metadata object.
 */
export const getRuleMetaData = (
  ruleName: string,
  ruleDescription: string,
  fix?: "code" | "whitespace"
): Rule.RuleMetaData => {
  const required = {
    type: "suggestion",
    docs: {
      description: ruleDescription,
      category: "Best Practices",
      recommended: true,
      url: `https://github.com/hack4impact-uiuc/eslint-plugin/blob/master/docs/rules/${ruleName}.md`
    },
    schema: []
  };
  return (fix !== undefined
    ? { ...required, fixable: fix }
    : required) as Rule.RuleMetaData;
};
