import { Rule } from "eslint";
import { ArrowFunctionExpression, CallExpression, Identifier } from "estree";
import { getRuleMetaData } from "../utils";

export = {
  meta: getRuleMetaData(
    "no-anonymous-parameterless-props",
    "require parameterless functions used as props to be passed in by their identifiers",
    "code"
  ),

  create: (context: Rule.RuleContext): Rule.RuleListener =>
    ({
      // if the prop is a CallExpression
      "JSXElement ArrowFunctionExpression[body.type='CallExpression']": (
        node: ArrowFunctionExpression
      ): void => {
        const callExpression = node.body as CallExpression;
        if (node.params.length !== 0 || callExpression.arguments.length !== 0) {
          return;
        }

        const callee = callExpression.callee;
        const reportMessage =
          "parameterless functions used as props should be passed in by their identifiers";

        // () => this.foo()
        if (
          callee.type === "MemberExpression" &&
          callee.object.type === "ThisExpression" &&
          callee.property.type === "Identifier"
        ) {
          const functionIdentifier = callee.property as Identifier;
          context.report({
            node,
            message: reportMessage,
            fix: (fixer: Rule.RuleFixer): Rule.Fix =>
              fixer.replaceText(node, `this.${functionIdentifier.name}`)
          });
        } else if (callee.type === "Identifier") {
          // () => foo()
          context.report({
            node,
            message: reportMessage,
            fix: (fixer: Rule.RuleFixer): Rule.Fix =>
              fixer.replaceText(node, callee.name)
          });
        }
      }
    } as Rule.RuleListener)
};
