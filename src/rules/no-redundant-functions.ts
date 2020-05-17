import { Rule } from "eslint";
import {
  ArrowFunctionExpression,
  CallExpression,
  Identifier,
  FunctionDeclaration,
  FunctionExpression,
} from "estree";
import { getRuleMetaData } from "../utils";

const isFunctionRedundant = (
  caller: CallExpression,
  paramNames: string[]
): boolean => {
  if (
    caller !== null &&
    caller.arguments.length === paramNames.length &&
    caller.arguments.every((argument) => argument.type === "Identifier")
  ) {
    const argumentIdentifiers = caller.arguments as Identifier[];
    const argumentNames = argumentIdentifiers.map((argument) => argument.name);

    return argumentNames.every(
      (argumentName, idx) => paramNames[idx] === argumentName
    );
  }
  return false;
};

export = {
  meta: getRuleMetaData(
    "no-redundant-functions",
    "require parameterless functions used as props to be passed in by their identifiers"
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

          if (caller !== null && isFunctionRedundant(caller, paramNames)) {
            context.report({
              node,
              message: `function is redundant, use called method in function body instead`,
            });
          }
        }
      },

      ArrowFunctionExpression: (node: ArrowFunctionExpression): void => {
        const { params, body } = node;
        if (params.every((param) => param.type === "Identifier")) {
          const paramIdentifiers = params as Identifier[];
          const paramNames = paramIdentifiers.map((param) => param.name);

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

          if (caller !== null && isFunctionRedundant(caller, paramNames)) {
            context.report({
              node,
              message: `function is redundant, use called method in function body instead`,
            });
          }
        }
      },
    } as Rule.RuleListener),
};
