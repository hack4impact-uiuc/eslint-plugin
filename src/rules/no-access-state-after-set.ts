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

  create: (context: Rule.RuleContext): Rule.RuleListener => {
    const seenFunctions: Set<Function> = new Set();

    return {
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
            if (property.type === "SpreadElement") {
              return;
            }

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
        const ancestors = context.getAncestors().reverse();

        // find all block statements in the ancestors - anything after these must not contain the state
        const blockAncestors = ancestors
          .slice(
            0,
            ancestors.findIndex(
              (ancestor) => ancestor.type === "ClassDeclaration"
            )
          )
          .filter(
            (ancestor) => ancestor.type === "BlockStatement"
          ) as BlockStatement[];

        // skip things outside the current block if it includes a return statement
        let shouldContinue = true;

        // TODO: search for instances of calling top-level function
        blockAncestors.forEach((block) => {
          if (shouldContinue) {
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
                      const parentProperty = parent.object
                        .property as Identifier;
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

            // break loop if return statement found
            if (
              postSetStateBody.some(
                (statement) => statement.type === "ReturnStatement"
              )
            ) {
              shouldContinue = false;
            }
          }
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

        // check to see if component has been evaluated already
        if (seenFunctions.has(func)) {
          return;
        }
        seenFunctions.add(func);

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

            const ancestors: Node[] = [];

            // traverse to function body and statement containing useState setter call
            let next = parent as TSESTree.Node;
            let prev: TSESTree.Node = child;
            while (next.parent !== undefined && next.parent !== func) {
              prev = next;
              next = next.parent;
              ancestors.push(prev as Node);
            }

            if (next.type !== "BlockStatement") {
              return;
            }

            const blockAncestors = ancestors.filter(
              (ancestor) => ancestor.type === "BlockStatement"
            ) as BlockStatement[];

            // skip things outside the current block if it includes a return statement
            let shouldContinue = true;

            blockAncestors.forEach((block) => {
              if (shouldContinue) {
                const { body } = block;

                // isolate function body after useState setter call
                const useStateIndex = body.findIndex((statement) =>
                  ancestors.includes(statement)
                );
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

                // break loop if return statement found
                if (
                  postUseState.some(
                    (statement) => statement.type === "ReturnStatement"
                  )
                ) {
                  shouldContinue = false;
                }
              }
            });
          }
        };

        // account for different function syntax
        body.forEach((statement) => {
          if (statement.type === "FunctionDeclaration") {
            simpleTraverse(statement.body as TSESTree.Node, {
              enter: functionTraverse,
            });
          } else if (
            statement.type === "ExpressionStatement" &&
            statement.expression.type === "CallExpression" &&
            statement.expression.callee.type === "Identifier" &&
            statement.expression.callee.name === "useEffect"
          ) {
            simpleTraverse(statement.expression.arguments[0] as TSESTree.Node, {
              enter: functionTraverse,
            });
          } else if (statement.type === "VariableDeclaration") {
            statement.declarations.forEach((declaration) => {
              if (
                declaration.init?.type === "FunctionExpression" ||
                declaration.init?.type === "ArrowFunctionExpression"
              ) {
                simpleTraverse(declaration.init.body as TSESTree.Node, {
                  enter: functionTraverse,
                });
              }
            });
          }
        });
      },
    } as Rule.RuleListener;
  },
};
