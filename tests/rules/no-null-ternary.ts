import rule from "../../src/rules/no-null-ternary";
import { RuleTester } from "eslint";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  }
});

const validTernary = `class Example extends Component {
  render() {
    return (
      <>
        {condition ? "Example" : "Other example"}
      </>
    )
  }
}`;

const validPositive = `class Example extends Component {
  render() {
    return (
      <>
        {condition && "Example"}
      </>
    )
  }
}`;

const validNegative = `class Example extends Component {
  render() {
    return (
      <>
        {!condition && "Example"}
      </>
    )
  }
}`;

const invalidPositive = `class Example extends Component {
  render() {
    return (
      <>
        {condition ? "Example" : null}
      </>
    )
  }
}`;

const invalidNegative = `class Example extends Component {
  render() {
    return (
      <>
        {condition ? null : "Example"}
      </>
    )
  }
}`;

ruleTester.run("no-null-ternary", rule, {
  valid: [
    {
      code: validTernary
    },
    {
      code: validPositive
    },
    {
      code: validNegative
    }
  ],
  invalid: [
    {
      code: invalidPositive,
      errors: [
        {
          message:
            "unnecessary ternary conditional, use {condition} && {consequent} instead"
        }
      ],
      output: validPositive
    },
    {
      code: invalidNegative,
      errors: [
        {
          message:
            "unnecessary ternary conditional, use !{condition} && {consequent} instead"
        }
      ],
      output: validNegative
    }
  ]
});
