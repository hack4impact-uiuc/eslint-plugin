import rule from "../../src/rules/no-null-ternary";
import { ruleTester } from "../tester";

const validClassTernary = `class Example extends Component {
  render() {
    return (
      <>
        {condition ? "Example" : "Other example"}
      </>
    )
  }
}`;

const validFunctionTernary = `function Example() {
  return (
    <>
      {condition ? "Example" : "Other example"}
    </>
  )
}`;

const validClassPositive = `class Example extends Component {
  render() {
    return (
      <>
        {condition && "Example"}
      </>
    )
  }
}`;

const validFunctionPositive = `function Example() {
  return (
    <>
      {condition && "Example"}
    </>
  )
}`;

const validClassNegative = `class Example extends Component {
  render() {
    return (
      <>
        {!condition && "Example"}
      </>
    )
  }
}`;

const validFunctionNegative = `function Example() {
  return (
    <>
      {!condition && "Example"}
    </>
  )
}`;

const invalidClassPositive = `class Example extends Component {
  render() {
    return (
      <>
        {condition ? "Example" : null}
      </>
    )
  }
}`;

const invalidFunctionPositive = `function Example() {
  return (
    <>
      {condition ? "Example" : null}
    </>
  )
}`;

const invalidClassNegative = `class Example extends Component {
  render() {
    return (
      <>
        {condition ? null : "Example"}
      </>
    )
  }
}`;

const invalidFunctionNegative = `function Example() {
  return (
    <>
      {condition ? null : "Example"}
    </>
  )
}`;

const positiveError = {
  message:
    "unnecessary ternary conditional, use {condition} && {consequent} instead"
};

const negativeError = {
  message:
    "unnecessary ternary conditional, use !{condition} && {consequent} instead"
};

ruleTester.run("no-null-ternary", rule, {
  valid: [
    {
      code: validClassTernary
    },
    { code: validFunctionTernary },
    {
      code: validClassPositive
    },
    { code: validFunctionPositive },
    {
      code: validClassNegative
    },
    { code: validFunctionNegative }
  ],
  invalid: [
    {
      code: invalidClassPositive,
      errors: [positiveError],
      output: validClassPositive
    },
    {
      code: invalidFunctionPositive,
      errors: [positiveError],
      output: validFunctionPositive
    },
    {
      code: invalidClassNegative,
      errors: [negativeError],
      output: validClassNegative
    },
    {
      code: invalidFunctionNegative,
      errors: [negativeError],
      output: validFunctionNegative
    }
  ]
});
