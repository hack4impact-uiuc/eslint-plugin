import { Rule } from "eslint";
import { ConditionalExpression } from "estree";
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
      "MethodDefinition[key.name='render'] ConditionalExpression[alternate.type='Literal'][alternate.value=null]": (
        node: ConditionalExpression
      ): void =>
        context.report({
          node,
          message:
            "unnecessary ternary conditional, use {condition} && {consequent} instead",
          fix: (fixer: Rule.RuleFixer): Rule.Fix =>
            fixer.replaceText(
              node,
              `${sourceCode.getText(node.test)} && ${sourceCode.getText(
                node.consequent
              )}`
            )
        }),

      // look for null on left-hand side
      "MethodDefinition[key.name='render'] ConditionalExpression[consequent.type='Literal'][consequent.value=null]": (
        node: ConditionalExpression
      ): void =>
        context.report({
          node,
          message:
            "unnecessary ternary conditional, use !{condition} && {consequent} instead",
          fix: (fixer: Rule.RuleFixer): Rule.Fix =>
            fixer.replaceText(
              node,
              `!${sourceCode.getText(node.test)} && ${sourceCode.getText(
                node.alternate
              )}`
            )
        })
    } as Rule.RuleListener;
  }
};
