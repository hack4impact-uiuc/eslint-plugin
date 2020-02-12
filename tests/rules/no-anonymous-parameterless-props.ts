import rule from "../../src/rules/no-anonymous-parameterless-props";
import { RuleTester } from "eslint";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  }
});

const validIdentifier = `class Example extends Component {
  render() {
    return <Button onClick={this.toggle}>Close</Button>;
  }
}`;

const validAnonymous = `class Example extends Component {
  render() {
    return <Button onClick={() => this.setState({modal: !this.state.modal})}>Close</Button>;
  }
}`;

const validPreventDefault = `class Example extends Component {
  render() {
    return <Button onClick={e => e.preventDefault()}>Submit</Button>;
  }
}`;

const validNoThis = `class Example extends Component {
  render() {
    return <Button onClick={toggle}>Close</Button>;
  }
}`;

const invalid = `class Example extends Component {
  render() {
    return <Button onClick={() => this.toggle()}>Close</Button>;
  }
}`;

const invalidNoThis = `class Example extends Component {
  render() {
    return <Button onClick={() => toggle()}>Close</Button>;
  }
}`;

ruleTester.run("no-anonymous-parameterless-props", rule, {
  valid: [
    {
      code: validIdentifier
    },
    {
      code: validAnonymous
    },
    { code: validPreventDefault },
    { code: validNoThis }
  ],
  invalid: [
    {
      code: invalid,
      errors: [
        {
          message:
            "parameterless functions used as props should be passed in by their identifiers"
        }
      ],
      output: validIdentifier
    },
    {
      code: invalidNoThis,
      errors: [
        {
          message:
            "parameterless functions used as props should be passed in by their identifiers"
        }
      ],
      output: validNoThis
    }
  ]
});
