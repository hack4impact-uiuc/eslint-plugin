import { Rule } from "eslint";
import {
  ArrowFunctionExpression,
  CallExpression,
  FunctionDeclaration,
  FunctionExpression,
  Pattern,
} from "estree";
import { getRuleMetaData } from "../utils";

export = {
  meta: getRuleMetaData(
    "no-redundant-functions",
    "forbids redundant functions that simply pass their arguments directly to another function in the same order"
  ),

  create: (context: Rule.RuleContext): Rule.RuleListener => {
    const sourceCode = context.getSourceCode();

    const isFunctionRedundant = (
      caller: CallExpression,
      params: Pattern[]
    ): boolean => {
      const paramsString = params
        .map((param) => sourceCode.getText(param).replace(/\s/g, ""))
        .join(",");

      const argumentsString = caller.arguments
        .map((argument) => sourceCode.getText(argument).replace(/\s/g, ""))
        .join(",");

      return paramsString === argumentsString;
    };

    return {
      ":matches(FunctionDeclaration, FunctionExpression)": (
        node: FunctionDeclaration | FunctionExpression
      ): void => {
        const { body, params } = node;
        const blockBody = body.body;
        const [statement] = blockBody;

        if (
          blockBody.length === 1 &&
          (statement.type === "ExpressionStatement" ||
            statement.type === "ReturnStatement")
        ) {
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

          if (caller !== null && isFunctionRedundant(caller, params)) {
            context.report({
              node,
              message: `function is redundant, use called method in function body instead`,
            });
          }
        }
      },

      ArrowFunctionExpression: (node: ArrowFunctionExpression): void => {
        const { params, body } = node;

        let caller: CallExpression | null = null;

        if (body.type === "CallExpression") {
          caller = body;
        } else if (body.type === "BlockStatement") {
          const blockBody = body.body;
          if (blockBody.length === 1) {
            const [statement] = blockBody;
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
          }
        }

        if (caller !== null && isFunctionRedundant(caller, params)) {
          context.report({
            node,
            message: `function is redundant, use called method in function body instead`,
          });
        }
      },
    } as Rule.RuleListener;
  },
};
