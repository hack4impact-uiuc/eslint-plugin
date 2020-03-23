import { Rule } from "eslint";
import {
  BlockStatement,
  CallExpression,
  Function,
  Identifier,
  Node,
  ObjectExpression,
} from "estree";
import { getRuleMetaData } from "../utils";
import { simpleTraverse, TSESTree } from "@typescript-eslint/typescript-estree";

export = {
  meta: getRuleMetaData(
    "no-access-state-after-set",
    "disallows access of React state variables after they have been set in a useEffect function body"
  ),

  create: (context: Rule.RuleContext): Rule.RuleListener =>
    ({
      "ClassDeclaration :matches(CallExpression[callee.property.name='setState'], CallExpression[callee.name='setState'])": (
        node: CallExpression
      ): void => {
        // helpers to track which state fields have been modified
        const modifiedState: Set<string> = new Set();
        const addModifiedState = (
          state: ObjectExpression,
          modifiedState: Set<string>
        ): void => {
          state.properties.forEach((property) => {
            const { key } = property;
            if (key.type === "Literal") {
              modifiedState.add(key.value as string);
            } else if (key.type === "Identifier") {
              modifiedState.add(key.name);
            }
          });
        };

        // add modified state fields
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
                child.type === "ObjectExpression" &&
                (parent === undefined || parent.type === "ReturnStatement")
              ) {
                addModifiedState(child as ObjectExpression, modifiedState);
              }
            },
          });
        }

        // find the function containing the setState call
        const ancestors = context.getAncestors();
        const func: Function = ancestors
          .reverse()
          .find(
            (ancestor) =>
              ancestor.type === "FunctionDeclaration" ||
              ancestor.type === "FunctionExpression" ||
              ancestor.type === "ArrowFunctionExpression"
          ) as Function;
        const block = func.body as BlockStatement;
        const { body } = block;

        // isolate the part of the function body after the setState call
        const setStateIndex = body.findIndex((bodyItem) =>
          ancestors.includes(bodyItem)
        );
        const postSetStateBody = body.slice(setStateIndex + 1);

        // if it follows the pattern '...state.<field>', report if field is modified
        postSetStateBody.forEach((bodyItem) => {
          simpleTraverse(bodyItem as TSESTree.Node, {
            enter: (child, parent) => {
              if (
                child.type === "Identifier" &&
                parent?.type === "MemberExpression" &&
                modifiedState.has(child.name)
              ) {
                // account for thisExpressions, nested objects and destructuring
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
                      "state fields modified by a setState call should not be accessed afterwards in the same block",
                  });
                }
              }
            },
          });
        });
      },

      ":matches(Program, ExportDefaultDeclaration, ExportNamedDeclaration) > :matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression) ReturnStatement :matches(JSXElement, JSXFragment)": (): void => {
        // find the component function
        const func: Function = context
          .getAncestors()
          .find(
            (ancestor) =>
              ancestor.type === "FunctionDeclaration" ||
              ancestor.type === "FunctionExpression" ||
              ancestor.type === "ArrowFunctionExpression"
          ) as Function;
        const block = func.body;
        if (block.type !== "BlockStatement") {
          return;
        }
        const { body } = block;

        // set up state trackers
        const stateSetters: Set<string> = new Set();
        const stateDict: Record<string, string> = {};

        // number of returned items from useState
        const useStateArrayLength = 2;

        // look for all useState declarations and add them to state trackers
        body.forEach((statement) => {
          if (statement.type === "VariableDeclaration") {
            statement.declarations.forEach((declaration) => {
              if (
                declaration.init?.type === "CallExpression" &&
                declaration.init.callee.type === "Identifier" &&
                declaration.init.callee.name === "useState" &&
                declaration.id.type === "ArrayPattern" &&
                declaration.id.elements.length === useStateArrayLength &&
                declaration.id.elements[0].type === "Identifier" &&
                declaration.id.elements[1].type === "Identifier"
              ) {
                const fieldName = declaration.id.elements[0].name;
                const setterName = declaration.id.elements[1].name;
                stateSetters.add(setterName);
                stateDict[setterName] = fieldName;
              }
            });
          }
        });

        // helper to be called on function body containing state setters
        const functionTraverse = (
          child: TSESTree.Node,
          parent: TSESTree.Node | undefined
        ): void => {
          // if its a useState setter
          if (
            child.type === "Identifier" &&
            stateSetters.has(child.name) &&
            parent !== undefined &&
            parent.type !== "ArrowFunctionExpression"
          ) {
            const modifiedField = stateDict[child.name];

            // traverse to function body and statement containing useState setter call
            let next = parent;
            let prev: TSESTree.Node = child;
            while (
              next.parent !== undefined &&
              next.parent.type !== "FunctionDeclaration" &&
              next.parent.type !== "FunctionExpression" &&
              next.parent.type !== "ArrowFunctionExpression"
            ) {
              prev = next;
              next = next.parent;
            }

            if (next.type !== "BlockStatement") {
              return;
            }

            const { body } = next;
            // isolate function body after useState setter call
            const useStateIndex = body.indexOf(prev as TSESTree.Statement);
            const postUseState = body.slice(useStateIndex + 1);

            // if identifier shares name with modified field, report
            postUseState.forEach((statement) =>
              simpleTraverse(statement as TSESTree.Node, {
                enter: (postChild) => {
                  if (
                    postChild.type === "Identifier" &&
                    postChild.name === modifiedField
                  ) {
                    context.report({
                      node: postChild,
                      message:
                        "state fields modified by a useState setter call should not be accessed afterwards in the same block",
                    });
                  }
                },
              })
            );
          }
        };

        // account for different function syntax
        body.forEach((statement) => {
          if (statement.type === "FunctionDeclaration") {
            simpleTraverse(statement.body as TSESTree.Node, {
              enter: (child, parent) => functionTraverse(child, parent),
            });
          } else if (
            statement.type === "ExpressionStatement" &&
            statement.expression.type === "CallExpression" &&
            statement.expression.callee.type === "Identifier" &&
            statement.expression.callee.name === "useEffect"
          ) {
            simpleTraverse(statement.expression.arguments[0] as TSESTree.Node, {
              enter: (child, parent) => functionTraverse(child, parent),
            });
          } else if (statement.type === "VariableDeclaration") {
            statement.declarations.forEach((declaration) => {
              if (
                declaration.init?.type === "FunctionExpression" ||
                declaration.init?.type === "ArrowFunctionExpression"
              ) {
                simpleTraverse(declaration.init.body as TSESTree.Node, {
                  enter: (child, parent) => functionTraverse(child, parent),
                });
              }
            });
          }
        });
      },
    } as Rule.RuleListener),
};
