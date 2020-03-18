import { Rule } from "eslint";
import {
  BlockStatement,
  CallExpression,
  ObjectExpression,
  Identifier,
  Node
} from "estree";
import { getRuleMetaData } from "../utils";
import { simpleTraverse, TSESTree } from "@typescript-eslint/typescript-estree";

const addModifiedState = (
  state: ObjectExpression,
  modifiedState: Set<string>
): void => {
  state.properties.forEach(property => {
    const { key } = property;
    if (key.type === "Literal") {
      modifiedState.add(key.value as string);
    } else if (key.type === "Identifier") {
      modifiedState.add(key.name);
    }
  });
};

export default {
  meta: getRuleMetaData(
    "no-get-state-after-set",
    "disallows access of React state variables after they have been set in a useEffect function body",
    "code"
  ),

  create: (context: Rule.RuleContext): Rule.RuleListener =>
    ({
      /*
      Class component - (class) -> function -> usage of setState - any access to modified values in function body afterwards forbidden
      Function component - (function -> useState) -> collect all state variables -> look in all useEffects and declarations - then same as above but look at state variables
      */

      "BlockStatement CallExpression[callee.name='setState']": (
        node: CallExpression
      ): void => {
        const modifiedState: Set<string> = new Set();

        const [stateArg] = node.arguments;
        if (stateArg.type === "ObjectExpression") {
          addModifiedState(stateArg, modifiedState);
        } else if (
          stateArg.type === "FunctionExpression" ||
          stateArg.type === "ArrowFunctionExpression"
        ) {
          simpleTraverse(stateArg.body as TSESTree.Node, {
            enter: (child, parent) => {
              if (
                child.type !== "ObjectExpression" ||
                (parent?.type !== "ReturnStatement" && parent !== stateArg.body)
              ) {
                addModifiedState(child as ObjectExpression, modifiedState);
              }
            }
          });
        }

        const ancestors = context.getAncestors();

        const block: BlockStatement = ancestors.find(
          ancestor => ancestor.type === "BlockStatement"
        ) as BlockStatement;
        const { body } = block;

        const setStateIndex = body.findIndex(bodyItem =>
          ancestors.includes(bodyItem)
        );
        const postSetStateBody = body.slice(setStateIndex);

        postSetStateBody.forEach(bodyItem => {
          simpleTraverse(bodyItem as TSESTree.Node, {
            enter: (child, parent) => {
              if (
                child.type === "Identifier" &&
                parent?.type === "MemberExpression" &&
                modifiedState.has(child.name)
              ) {
                let parentName = undefined;
                if (parent.object.type === "MemberExpression") {
                  const parentProperty = parent.object.property as Identifier;
                  parentName = parentProperty.name;
                } else if (parent.object.type === "Identifier") {
                  parentName = parent.object.name;
                }

                if (parentName === "state") {
                  context.report({
                    node: parent as Node,
                    message:
                      "state fields modified in a setState call should not be accessed afterwards in the same block"
                  });
                }
              }
            }
          });
        });
      }
    } as Rule.RuleListener)
};
