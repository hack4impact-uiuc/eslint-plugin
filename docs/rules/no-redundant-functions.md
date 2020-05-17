# no-redundant-functions

Requires that parameterless functions used as props be passed in through their identifiers, not using an anonymous function.

## Examples

### Correct

```js
class Example extends Component {
  render() {
    return <Button onClick={this.toggle}>Close</Button>;
  }
}

function Example() {
  return <Button onClick={toggle}>Close</Button>;
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

function Example() {
  return <Button onClick={() => setModal(!modal)}>Close</Button>;
}
```

```js
class Example extends Component {
  render() {
    return <Button onClick={(e) => e.preventDefault()}>Submit</Button>;
  }
}

function Example() {
  return <Button onClick={(e) => e.preventDefault()}>Submit</Button>;
}
```

### Incorrect

```js
class Example extends Component {
  render() {
    return <Button onClick={() => this.toggle()}>Close</Button>;
  }
}

function Example() {
  return <Button onClick={() => toggle()}>Close</Button>;
}
```
