import { Rule } from "eslint";
import { CallExpression, ArrowFunctionExpression, Identifier } from "estree";
import { getRuleMetaData } from "../utils";

export = {
  meta: getRuleMetaData(
    "no-anonymous-parameterless-props",
    "require parameterless functions used as props to be passed in by their identifiers",
    "code"
  ),
  create: (context: Rule.RuleContext): Rule.RuleListener =>
    ({
      "JSXAttribute > JSXExpressionContainer > ArrowFunctionExpression[body.type='CallExpression']": (
        node: ArrowFunctionExpression
      ): void => {
        const callExpression = node.body as CallExpression;
        const callee = callExpression.callee;

        if (
          callee.type === "MemberExpression" &&
          callee.property.type === "Identifier" &&
          callExpression.arguments.length === 0
        ) {
          const functionIdentifier = callee.property as Identifier;
          context.report({
            node: node,
            message:
              "parameterless functions used as props should be passed in by their identifiers",
            fix: (fixer: Rule.RuleFixer): Rule.Fix =>
              fixer.replaceText(node, `this.${functionIdentifier.name}`)
          });
        }
      }
    } as Rule.RuleListener)
};
