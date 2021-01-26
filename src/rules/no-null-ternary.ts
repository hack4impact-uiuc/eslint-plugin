import { Rule } from "eslint";
import { ConditionalExpression } from "estree";
import { getRuleMetaData } from "../utils";

export default {
  meta: getRuleMetaData(
    "no-null-ternary",
    "forbid ternary conditional operators where one side is null",
    "code"
  ),

  create: (context: Rule.RuleContext): Rule.RuleListener =>
    ({
      // look for null on right-hand side
      ":matches(JSXElement, JSXFragment) ConditionalExpression[alternate.type='Literal'][alternate.value=null]": (
        node: ConditionalExpression
      ): void =>
        context.report({
          node,
          message:
            "unnecessary ternary conditional, use {condition} && {consequent} instead",
        }),

      // look for null on left-hand side
      ":matches(JSXElement, JSXFragment) ConditionalExpression[consequent.type='Literal'][consequent.value=null]": (
        node: ConditionalExpression
      ): void =>
        context.report({
          node,
          message:
            "unnecessary ternary conditional, use !{condition} && {consequent} instead",
        }),
    } as Rule.RuleListener),
};
