import rule from "../../src/rules/no-null-ternary";
import { ruleTester } from "../tester";

const classValidTernary = `class Example extends Component {
  render() {
    return (
      <>
        {condition ? "Example" : "Other example"}
      </>
    )
  }
}`;

const functionValidTernary = `function Example() {
  return (
    <>
      {condition ? "Example" : "Other example"}
    </>
  )
}`;

const classValidPositive = `class Example extends Component {
  render() {
    return (
      <>
        {condition && "Example"}
      </>
    )
  }
}`;

const functionValidPositive = `function Example() {
  return (
    <>
      {condition && "Example"}
    </>
  )
}`;

const classValidNegative = `class Example extends Component {
  render() {
    return (
      <>
        {!condition && "Example"}
      </>
    )
  }
}`;

const functionValidNegative = `function Example() {
  return (
    <>
      {!condition && "Example"}
    </>
  )
}`;

const classInvalidPositive = `class Example extends Component {
  render() {
    return (
      <>
        {condition ? "Example" : null}
      </>
    )
  }
}`;

const functionInvalidPositive = `function Example() {
  return (
    <>
      {condition ? "Example" : null}
    </>
  )
}`;

const classInvalidNegative = `class Example extends Component {
  render() {
    return (
      <>
        {condition ? null : "Example"}
      </>
    )
  }
}`;

const functionInvalidNegative = `function Example() {
  return (
    <>
      {condition ? null : "Example"}
    </>
  )
}`;

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
