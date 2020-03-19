# no-access-state-after-set

Forbids access of state variables after a `setState` call modifies them. This is local to the function body in which the `setState` call occurred.

## Examples

### Correct

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({ example });
    console.log(example);
  }
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({ example, count: 1 });
    console.log(example);
    console.log(1);
  }
}
```

```js
class Example extends Component {
  componentDidMount() {
    const { setState } = this;
    const example = "Example";
    setState({ example });
    console.log(example);
  }
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState(prevState => ({ example, count: prevState.count + 1 }));
    console.log(example);
  }
}
```

### Incorrect

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({ example });
    console.log(this.state.example);
  }
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({ example, count: 1 });
    console.log(this.state.example);
    console.log(this.state.count);
  }
}
```

```js
class Example extends Component {
  componentDidMount() {
    const { setState } = this;
    const example = "Example";
    setState({ example });
    console.log(this.state.example);
  }
}
```

```js
class Example extends Component {
  componentDidMount() {
    const { state } = this;
    const example = "Example";
    this.setState({ example });
    console.log(state.example);
  }
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState(prevState => ({ example, count: prevState.count + 1 }));
    console.log(this.state.example);
  }
}
```
