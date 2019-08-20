# no-anonymous-parameterless-props.md

Requires that parameterless functions used as props be passed in through their identifiers, not using an anonymous function.

This rule is fixable using the `--fix` option.

## Examples

### Good

```js
class Example extends Component {
  render() {
    return <Button onClick={this.toggle}>Close</Button>;
  }
}
```

```ts
class Example extends Component {
  render() {
    return (
      <Button onClick={() => this.setState({ modal: !this.state.modal })}>
        Close
      </Button>
    );
  }
}
```

### Bad

```ts
class Example extends Component {
  render() {
    return <Button onClick={() => this.toggle()}>Close</Button>;
  }
}
```
