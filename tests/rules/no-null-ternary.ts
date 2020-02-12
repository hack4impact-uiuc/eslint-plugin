import rule from "../../src/rules/no-null-ternary";
import { ruleTester } from "../tester";

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

const validNotRender = `class Example extends Component {
  notRender() {
    return (
      <>
        {condition ? "Example" : null}
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
    },
    {
      code: validNotRender
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
