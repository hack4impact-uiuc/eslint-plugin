# no-access-state-after-set

This rule behaves slightly differently for class-based and function-based components.

- Class-based: forbids access of state variables after a `setState` call modifies them. This is local to the function body in which the `setState` call occurred.
- Function-based: forbids access of state variables after they are modified by a corresponding setter from `useState`. This is also local to the function body in which the `useState` setter call occurred.

## Examples

### Correct

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({ example });
    console.log(example);
  }

  render() {
    return <></>;
  }
}

function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    const newExample = "Example";
    setExample(newExample);
    console.log(newExample);
  }, [setExample]);

  return <></>;
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    if (Math.random() > 0.5) {
      this.setState({ example });
    }
    console.log(example);
  }

  render() {
    return <></>;
  }
}

function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    const newExample = "Example";
    if (Math.random() > 0.5) {
      setExample(newExample);
    }
    console.log(newExample);
  }, [setExample]);

  return <></>;
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({ example });
  }

  componentDidUpdate() {
    console.log(this.state.example);
  }

  render() {
    return <></>;
  }
}

function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    const newExample = "Example";
    setExample(newExample);
  }, [setExample]);

  useEffect(() => console.log(example), [example]);

  return <></>;
}
```

```js
class Example extends Component {
  componentDidMount() {
    console.log(this.state.example);
    const example = "Example";
    this.setState({ example });
  }

  render() {
    return <></>;
  }
}

function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    console.log(example);
    const newExample = "Example";
    setExample(newExample);
  }, [example, setExample]);

  return <></>;
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    const count = 1;
    this.setState({ example, count });
    console.log(example);
    console.log(count);
  }

  render() {
    return <></>;
  }
}

function Example() {
  const [example, setExample] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const newExample = "Example";
    const newCount = 1;
    setExample(newExample);
    setCount(newCount);
    console.log(newExample);
    console.log(newCount);
  }, [setExample, setCount]);

  return <></>;
}
```

```js
class Example extends Component {
  componentDidMount() {
    if (example) {
      const example = "Example";
      this.setState({ example });
      return;
    }
    console.log(this.state.example);
  }

  render() {
    return <></>;
  }
}

function Example() {
  const [example, setExample] = useState(true);

  const updateExample = () => {
    if (example) {
      const newExample = "Example";
      setExample(newExample);
      return;
    }
    console.log(example);
  };

  return <></>;
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

  render() {
    return <></>;
  }
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState((prevState) => ({ example }));
    console.log(example);
  }

  render() {
    return <></>;
  }
}
```

```js
function Example() {
  const [example, setExample] = useState(null);

  function updateExample();{
    const newExample = "Example";
    setExample(newExample);
    console.log(newExample);
  };

  return <></>;
}

function Example() {
  const [example, setExample] = useState(null);

  const updateExample = function() {
    const newExample = "Example";
    setExample(newExample);
    console.log(newExample);
  };

  return <></>;
}

function Example() {
  const [example, setExample] = useState(null);

  const updateExample = () => {
    const newExample = "Example";
    setExample(newExample);
    console.log(newExample);
  };

  return <></>;
}
```

```js
function Example() {
  const [example, setExample] = useState(true);

  useEffect(() => {
    function setExampleWrapper() {
      setExample(false);
    }

    if (example) {
      console.log("hi");
    }

    setExampleWrapper();
  }, [validUser]);

  return <></>;
}

function Example() {
  const [example, setExample] = useState(true);

  useEffect(() => {
    const setExampleWrapper = () => {
      setExample(false);
    };

    if (example) {
      console.log("hi");
    }

    setExampleWrapper();
  }, [validUser]);

  return <></>;
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

  render() {
    return <></>;
  }
}

function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    const newExample = "Example";
    setExample(newExample);
    console.log(example);
  }, [example, setExample]);

  return <></>;
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    if (Math.random() > 0.5) {
      this.setState({ example });
    }
    console.log(this.state.example);
  }

  render() {
    return <></>;
  }
}

function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    const newExample = "Example";
    if (Math.random() > 0.5) {
      setExample(newExample);
    }
    console.log(example);
  }, [example, setExample]);

  return <></>;
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    const count = 1;
    this.setState({ example, count });
    console.log(this.state.example);
    console.log(this.state.count);
  }

  render() {
    return <></>;
  }
}

function Example() {
  const [example, setExample] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const newExample = "Example";
    const newCount = 1;
    setExample(newExample);
    setCount(newCount);
    console.log(example);
    console.log(count);
  }, [example, count, setExample, setCount]);

  return <></>;
}
```

```js
class Example extends Component {
  componentDidMount() {
    if (example) {
      const example = "Example";
      this.setState({ example });
      console.log(this.state.example);
    }
  }

  render() {
    return <></>;
  }
}

function Example() {
  const [example, setExample] = useState(true);

  const updateExample = () => {
    if (example) {
      const newExample = "Example";
      setExample(newExample);
      console.log(example);
    }
  };

  return <></>;
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    getData().then(() => {
      this.setState({ example });
    });
    console.log(this.state.example);
  }

  render() {
    return <></>;
  }
}

function Example() {
  const [example, setExample] = useState(true);

  const updateExample = () => {
    const example = "Example";
    getData().then((newExample) => {
      setExample(newExample);
    });
    console.log(example);
  };

  return <></>;
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

  render() {
    return <></>;
  }
}

class Example extends Component {
  componentDidMount() {
    const { state } = this;
    const example = "Example";
    this.setState({ example });
    console.log(state.example);
  }

  render() {
    return <></>;
  }
}
```

```js
class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState((prevState) => ({ example }));
    console.log(this.state.example);
  }

  render() {
    return <></>;
  }
}
```

```js
function Example() {
  const [example, setExample] = useState(null);

  function updateExample() {
    const newExample = "Example";
    setExample(newExample);
    console.log(example);
  }

  return <></>;
}

function Example() {
  const [example, setExample] = useState(null);

  const updateExample = function () {
    const newExample = "Example";
    setExample(newExample);
    console.log(example);
  };

  return <></>;
}

function Example() {
  const [example, setExample] = useState(null);

  const updateExample = () => {
    const newExample = "Example";
    setExample(newExample);
    console.log(example);
  };

  return <></>;
}
```

```js
function Example() {
  const [example, setExample] = useState(true);

  useEffect(() => {
    function setExampleWrapper() {
      setExample(false);
      console.log(example);
    }

    if (example) {
      console.log("hi");
    }

    setExampleWrapper();
  }, [validUser]);

  return <></>;
}

function Example() {
  const [example, setExample] = useState(true);

  useEffect(() => {
    const setExampleWrapper = () => {
      setExample(false);
      console.log(example);
    };

    if (example) {
      console.log("hi");
    }

    setExampleWrapper();
  }, [validUser]);

  return <></>;
}
```
