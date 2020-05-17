import rule from "../../src/rules/no-null-ternary";
import { ruleTester } from "../tester";

const generateTest = (
  componentType: "class" | "function",
  body: string
): string =>
  componentType === "class"
    ? `class Example extends Component {
  render() {
    return (
      <>
        {${body}}
      </>
    )
  }
}`
    : `function Example() {
  return (
    <>
      {${body}}
    </>
  )
}`;

const classValidTernary = generateTest(
  "class",
  'condition ? "Example" : "Other example"'
);

const functionValidTernary = generateTest(
  "function",
  'condition ? "Example" : "Other example"'
);

const classValidPositive = generateTest("class", 'condition && "Example"');

const functionValidPositive = generateTest(
  "function",
  'condition && "Example"'
);

const classValidNegative = generateTest("class", '!condition && "Example"');

const functionValidNegative = generateTest(
  "function",
  '!condition && "Example"'
);

const classInvalidPositive = generateTest(
  "class",
  'condition ? "Example" : null'
);

const functionInvalidPositive = generateTest(
  "function",
  'condition ? "Example" : null'
);

const classInvalidNegative = generateTest(
  "class",
  'condition ? null : "Example"'
);

const functionInvalidNegative = generateTest(
  "function",
  'condition ? null : "Example"'
);

const positiveError = {
  message:
    "unnecessary ternary conditional, use {condition} && {consequent} instead",
};

const negativeError = {
  message:
    "unnecessary ternary conditional, use !{condition} && {consequent} instead",
};

ruleTester.run("no-null-ternary", rule, {
  valid: [
    {
      code: classValidTernary,
    },
    { code: functionValidTernary },
    {
      code: classValidPositive,
    },
    { code: functionValidPositive },
    {
      code: classValidNegative,
    },
    { code: functionValidNegative },
  ],
  invalid: [
    {
      code: classInvalidPositive,
      errors: [positiveError],
      output: classValidPositive,
    },
    {
      code: functionInvalidPositive,
      errors: [positiveError],
      output: functionValidPositive,
    },
    {
      code: classInvalidNegative,
      errors: [negativeError],
      output: classValidNegative,
    },
    {
      code: functionInvalidNegative,
      errors: [negativeError],
      output: functionValidNegative,
    },
  ],
});
