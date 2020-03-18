import rule from "../../src/rules/no-anonymous-parameterless-props";
import { ruleTester } from "../tester";

const validClassIdentifier = `class Example extends Component {
  render() {
    return <Button onClick={this.toggle}>Close</Button>;
  }
}`;

const validFunctionIdentifier = `function Example() {
  return <Button onClick={toggle}>Close</Button>;
}`;

const validClassAnonymous = `class Example extends Component {
  render() {
    return <Button onClick={() => this.setState({modal: !this.state.modal})}>Close</Button>;
  }
}`;

const validFunctionAnonymous = `function Example() {
  return <Button onClick={() => setModal(!modal)}>Close</Button>;
}`;

const validClassPreventDefault = `class Example extends Component {
  render() {
    return <Button onClick={e => e.preventDefault()}>Submit</Button>;
  }
}`;

const validFunctionPreventDefault = `function Example() {
  return <Button onClick={e => e.preventDefault()}>Submit</Button>;
}`;

const validClassNoThis = `class Example extends Component {
  render() {
    return <Button onClick={toggle}>Close</Button>;
  }
}`;

const invalidClass = `class Example extends Component {
  render() {
    return <Button onClick={() => this.toggle()}>Close</Button>;
  }
}`;

const invalidFunction = `function Example() {
  return <Button onClick={() => toggle()}>Close</Button>;
}`;

const invalidClassNoThis = `class Example extends Component {
  render() {
    return <Button onClick={() => toggle()}>Close</Button>;
  }
}`;

const error = {
  message:
    "parameterless functions used as props should be passed in by their identifiers"
};

ruleTester.run("no-anonymous-parameterless-props", rule, {
  valid: [
    {
      code: validClassIdentifier
    },
    { code: validFunctionIdentifier },
    {
      code: validClassAnonymous
    },
    { code: validFunctionAnonymous },
    { code: validClassPreventDefault },
    { code: validFunctionPreventDefault },
    { code: validClassNoThis }
  ],
  invalid: [
    {
      code: invalidClass,
      errors: [error],
      output: validClassIdentifier
    },
    {
      code: invalidFunction,
      errors: [error],
      output: validFunctionIdentifier
    },
    {
      code: invalidClassNoThis,
      errors: [error],
      output: validClassNoThis
    }
  ]
});
