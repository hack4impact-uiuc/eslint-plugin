import rule from "../../src/rules/no-anonymous-parameterless-props";
import { ruleTester } from "../tester";

const classValidIdentifier = `class Example extends Component {
  render() {
    return <Button onClick={this.toggle}>Close</Button>;
  }
}`;

const functionValidIdentifier = `function Example() {
  return <Button onClick={toggle}>Close</Button>;
}`;

const classValidAnonymous = `class Example extends Component {
  render() {
    return <Button onClick={() => this.setState({modal: !this.state.modal})}>Close</Button>;
  }
}`;

const functionValidAnonymous = `function Example() {
  return <Button onClick={() => setModal(!modal)}>Close</Button>;
}`;

const classValidPreventDefault = `class Example extends Component {
  render() {
    return <Button onClick={e => e.preventDefault()}>Submit</Button>;
  }
}`;

const functionValidPreventDefault = `function Example() {
  return <Button onClick={e => e.preventDefault()}>Submit</Button>;
}`;

const classValidNoThis = `class Example extends Component {
  render() {
    return <Button onClick={toggle}>Close</Button>;
  }
}`;

const classInValid = `class Example extends Component {
  render() {
    return <Button onClick={() => this.toggle()}>Close</Button>;
  }
}`;

const functionInValid = `function Example() {
  return <Button onClick={() => toggle()}>Close</Button>;
}`;

const classInValidNoThis = `class Example extends Component {
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
      code: classValidIdentifier
    },
    { code: functionValidIdentifier },
    {
      code: classValidAnonymous
    },
    { code: functionValidAnonymous },
    { code: classValidPreventDefault },
    { code: functionValidPreventDefault },
    { code: classValidNoThis }
  ],
  invalid: [
    {
      code: classInValid,
      errors: [error],
      output: classValidIdentifier
    },
    {
      code: functionInValid,
      errors: [error],
      output: functionValidIdentifier
    },
    {
      code: classInValidNoThis,
      errors: [error],
      output: classValidNoThis
    }
  ]
});
