import { Rule } from "eslint";
import { ConditionalExpression, Literal } from "estree";
import { getRuleMetaData } from "../utils";

export = {
  meta: getRuleMetaData(
    "no-null-ternary",
    "forbid ternary conditional operators where one side is null",
    "code"
  ),

  create: (context: Rule.RuleContext): Rule.RuleListener => {
    const sourceCode = context.getSourceCode();
    return {
      // look for null on right-hand side
      "ConditionalExpression[alternate.type='Literal']": (
        node: ConditionalExpression
      ): void => {
        const alternate = node.alternate as Literal;
        if (alternate.value === null) {
          context.report({
            node: node,
            message:
              "unnecessary ternary conditional, use {condition} && {consequent} instead",
            fix: (fixer: Rule.RuleFixer): Rule.Fix =>
              fixer.replaceText(
                node,
                `${sourceCode.getText(node.test)} && ${sourceCode.getText(
                  node.consequent
                )}`
              )
          });
        }
      },

      // look for null on left-hand side
      "ConditionalExpression[consequent.type='Literal']": (
        node: ConditionalExpression
      ): void => {
        const consequent = node.consequent as Literal;
        if (consequent.value === null) {
          context.report({
            node: node,
            message:
              "unnecessary ternary conditional, use !{condition} && {consequent} instead",
            fix: (fixer: Rule.RuleFixer): Rule.Fix =>
              fixer.replaceText(
                node,
                `!${sourceCode.getText(node.test)} && ${sourceCode.getText(
                  node.alternate
                )}`
              )
          });
        }
      }
    } as Rule.RuleListener;
  }
};