# no-null-ternary

Forbids placing `null` on one side of a ternary operator.

This rule is fixable using the `--fix` option.

## Examples

### Good

```js
class Example extends Component {
  render() {
    return <>{condition ? "Example" : "Other example"}</>;
  }
}
```

```js
class Example extends Component {
  render() {
    return <>{condition && "Example"}</>;
  }
}
```

### Bad

```js
class Example extends Component {
  render() {
    return <>{condition ? "Example" : null}</>;
  }
}
```

```js
class Example extends Component {
  render() {
    return <>{condition ? null : "Example"}</>;
  }
}
```
