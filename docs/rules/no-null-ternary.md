# no-null-ternary

Forbids placing `null` on one side of a ternary operator inside a component's `render` method.

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

```js
class Example extends Component {
  render() {
    return (
      <>
        {!condition && "Example"}
      </>
    )
  }
}
```

```js
class Example extends Component {
  notRender() {
    return <>{condition ? "Example" : null}</>;
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
