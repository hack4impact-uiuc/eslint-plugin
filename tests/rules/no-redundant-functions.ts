import rule from "../../src/rules/no-redundant-functions";
import { ruleTester } from "../tester";
import { RuleTester } from "eslint";

type FunctionType = "arrow" | "declaration" | "expression";
const functionTypes: FunctionType[] = ["arrow", "declaration", "expression"];

const functionTemplates = {
  arrow: (params: string, args: string): string =>
    `const example = (${params}) => callee(${args});`,
  declaration: (
    params: string,
    args: string,
    returns?: boolean
  ): string => `function example(${params}) {
    ${returns ? "return " : ""}callee(${args});
  };`,
  expression: (
    params: string,
    args: string,
    returns?: boolean
  ): string => `const example = function(${params}) {
    ${returns ? "return " : ""}callee(${args});
  };`,
};

const generateValidTests = (
  params: string,
  args: string,
  returns?: boolean
): RuleTester.ValidTestCase[] =>
  functionTypes.map((functionType): any => ({
    code: functionTemplates[functionType](params, args, returns),
  }));

const generateInvalidTests = (
  params: string,
  args: string,
  returns?: boolean
): RuleTester.InvalidTestCase[] =>
  functionTypes.map((functionType): any => ({
    code: functionTemplates[functionType](params, args, returns),
    errors: [
      {
        message:
          "function is redundant, use called method in function body instead",
      },
    ],
  }));

const validArrowMember = `const example = () => console.log("example");`;
const validHook = `useEffect(() => foo());`;

ruleTester.run("no-redundant-functions", rule, {
  valid: [
    ...generateValidTests("", "foo"),
    ...generateValidTests("foo", ""),
    ...generateValidTests("foo", "{foo}"),
    ...generateValidTests("{foo}", "foo"),
    ...generateValidTests("foo", "[foo]"),
    ...generateValidTests("[foo]", "foo"),
    ...generateValidTests("[foo], bar", "[foo]"),
    ...generateValidTests("{foo}, bar", "{foo}"),
    ...generateValidTests("foo, bar", "foo"),
    ...generateValidTests("foo", "foo, bar"),
    ...generateValidTests("foo, bar", "bar, foo"),
    ...generateValidTests("{foo, bar}", "{bar, foo}"),
    ...generateValidTests("[foo, bar]", "[bar, foo]"),
    ...generateValidTests("{foo, bar}", "{foo}"),
    { code: validArrowMember },
    { code: validHook },
  ],
  invalid: [
    ...generateInvalidTests("", ""),
    ...generateInvalidTests("foo", "foo"),
    ...generateInvalidTests("{foo}", "{foo}"),
    ...generateInvalidTests("[foo]", "[foo]"),
    ...generateInvalidTests("foo, bar", "foo, bar"),
    ...generateInvalidTests("foo,bar", "foo, bar"),
  ],
});
