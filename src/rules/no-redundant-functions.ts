import { Rule } from "eslint";
import {
  ArrowFunctionExpression,
  CallExpression,
  Identifier,
  FunctionDeclaration,
  FunctionExpression,
} from "estree";
import { getRuleMetaData } from "../utils";

export = {
  meta: getRuleMetaData(
    "no-redundant-functions",
    "require parameterless functions used as props to be passed in by their identifiers",
    "code"
  ),

  create: (context: Rule.RuleContext): Rule.RuleListener =>
    ({
      ":matches(FunctionDeclaration, FunctionExpression)": (
        node: FunctionDeclaration | FunctionExpression
      ): void => {
        const { body } = node.body;
        const { params } = node;
        const [statement] = body;
        if (
          body.length === 1 &&
          (statement.type === "ExpressionStatement" ||
            statement.type === "ReturnStatement") &&
          params.every((param) => param.type === "Identifier")
        ) {
          const paramIdentifiers = params as Identifier[];
          const paramNames = paramIdentifiers.map((param) => param.name);

          let caller: CallExpression | null = null;

          if (
            statement.type === "ExpressionStatement" &&
            statement.expression.type === "CallExpression"
          ) {
            caller = statement.expression;
          } else if (
            statement.type === "ReturnStatement" &&
            statement.argument?.type === "CallExpression"
          ) {
            caller = statement.argument;
          }

          if (
            caller !== null &&
            caller.arguments.length === params.length &&
            caller.arguments.every((argument) => argument.type === "Identifier")
          ) {
            const argumentIdentifiers = caller.arguments as Identifier[];
            const argumentNames = argumentIdentifiers.map(
              (argument) => argument.name
            );

            if (
              argumentNames.every(
                (argumentName, idx) => paramNames[idx] === argumentName
              )
            ) {
              context.report({
                node,
                message: `function is redundant, use called method in function body instead`,
              });
              //report
            }
          }
        }
      },

      // if the prop is a CallExpression
      ":matches(JSXElement, JSXFragment) ArrowFunctionExpression[body.type='CallExpression']": (
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
              fixer.replaceText(node, `this.${functionIdentifier.name}`),
          });
        } else if (callee.type === "Identifier") {
          // () => foo()
          context.report({
            node,
            message: reportMessage,
            fix: (fixer: Rule.RuleFixer): Rule.Fix =>
              fixer.replaceText(node, callee.name),
          });
        }
      },
    } as Rule.RuleListener),
};
