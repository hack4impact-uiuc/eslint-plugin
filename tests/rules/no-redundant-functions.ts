import rule from "../../src/rules/no-redundant-functions";
import { ruleTester } from "../tester";

const generateTest = (
  componentType: "class" | "function",
  body: string
): string =>
  componentType === "class"
    ? `class Example extends Component {
  render() {
    return <Button onClick={${body}}>Close</Button>;
  }
}`
    : `function Example() {
  return <Button onClick={${body}}>Close</Button>;
}`;

const classValidIdentifier = generateTest("class", "this.toggle");

const functionValidIdentifier = generateTest("function", "toggle");

const classValidAnonymous = generateTest(
  "class",
  "() => this.setState({modal: !this.state.modal})"
);

const functionValidAnonymous = generateTest(
  "function",
  "() => setModal(!modal)"
);

const classValidPreventDefault = generateTest(
  "class",
  "e => e.preventDefault()"
);

const functionValidPreventDefault = generateTest(
  "function",
  "e => e.preventDefault()"
);

const classValidNoThis = generateTest("class", "toggle");

const classInvalid = generateTest("class", "() => this.toggle()");

const functionInvalid = generateTest("function", "() => toggle()");

const classInvalidNoThis = generateTest("class", "() => toggle()");

const error = {
  message:
    "parameterless functions used as props should be passed in by their identifiers",
};

ruleTester.run("no-anonymous-parameterless-props", rule, {
  valid: [
    {
      code: classValidIdentifier,
    },
    { code: functionValidIdentifier },
    {
      code: classValidAnonymous,
    },
    { code: functionValidAnonymous },
    { code: classValidPreventDefault },
    { code: functionValidPreventDefault },
    { code: classValidNoThis },
  ],
  invalid: [
    {
      code: classInvalid,
      errors: [error],
      output: classValidIdentifier,
    },
    {
      code: functionInvalid,
      errors: [error],
      output: functionValidIdentifier,
    },
    {
      code: classInvalidNoThis,
      errors: [error],
      output: classValidNoThis,
    },
  ],
});
