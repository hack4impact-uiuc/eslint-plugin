# no-null-ternary

Forbids placing `null` on one side of a ternary operator inside a JSX section.

## Examples

### Correct

```js
class Example extends Component {
  render() {
    return <>{condition ? "Example" : "Other example"}</>;
  }
}

function Example() {
  return <>{condition ? "Example" : "Other example"}</>;
}
```

```js
class Example extends Component {
  render() {
    return <>{condition && "Example"}</>;
  }
}

function Example() {
  return <>{condition && "Example"}</>;
}
```

```js
class Example extends Component {
  render() {
    return <>{!condition && "Example"}</>;
  }
}

function Example() {
  return <>{!condition && "Example"}</>;
}
```

### Incorrect

```js
class Example extends Component {
  render() {
    return <>{condition ? "Example" : null}</>;
  }
}

function Example() {
  return <>{condition ? "Example" : null}</>;
}
```

```js
class Example extends Component {
  render() {
    return <>{condition ? null : "Example"}</>;
  }
}

function Example() {
  return <>{condition ? null : "Example"}</>;
}
```
