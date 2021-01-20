# no-redundant-functions

Forbids redundant functions that simply pass their arguments directly to another function in the same order.

Arrow functions with single-line CallExpressions containing MemberExpressions (e.g. `console.log`) are ignored due to inconsistencies regarding `this`.

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

````js
function Example{
  // raw functions that are opaque to react hook analysis should not be passed
  useEffect(() => foo());

  return <></>
}

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
````
