# no-anonymous-parameterless-props

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

```js
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

```js
class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ['One', 'Two', 'Three'],
      currentItem: null
    };
  }

  render() {
    return (
      <>
        <h1>Current Item: {this.state.currentItem}</h1>
        {this.state.items.map(item => (
          <Button onClick={() => this.setState({ currentItem: item })}>
            Close
          </Button>
        ))}
      </>
    );
  }
}
```

### Bad

```js
class Example extends Component {
  render() {
    return <Button onClick={() => this.toggle()}>Close</Button>;
  }
}
```
