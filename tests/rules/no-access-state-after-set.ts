import rule from "../../src/rules/no-access-state-after-set";
import { ruleTester } from "../tester";

const classValid = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({example});
    console.log(example);
  }
  
  render() {
    return <></>;
  }
}`;

const functionValid = `function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    const newExample = "Example";
    setExample(newExample);
    console.log(newExample);
  }, [setExample]);

  return <></>;
}`;

const classValidNested = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    if (Math.random() > 0.5) {
      this.setState({example});
    }
    console.log(example);
  }
  
  render() {
    return <></>;
  }
}`;

const functionValidNested = `function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    const newExample = "Example";
    if (Math.random() > 0.5) {
      setExample(newExample);
    }
    console.log(newExample);
  }, [setExample]);

  return <></>;
}`;

const classValidOutside = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({example});
  }

  componentDidUpdate() {
    console.log(this.state.example)
  }
  
  render() {
    return <></>;
  }
}`;

const functionValidOutside = `function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    const newExample = "Example";
    setExample(newExample);
  }, [setExample]);

  useEffect(() => console.log(example), [example]);

  return <></>;
}`;

const classValidBefore = `class Example extends Component {
  componentDidMount() {
    console.log(this.state.example);
    const example = "Example";
    this.setState({example});
  }
  
  render() {
    return <></>;
  }
}`;

const functionValidBefore = `function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    console.log(example);
    const newExample = "Example";
    setExample(newExample);
  }, [example, setExample]);

  return <></>;
}`;

const classValidMultiple = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    const count = 1
    this.setState({example, count});
    console.log(example);
    console.log(count);
  }
  
  render() {
    return <></>;
  }
}`;

const functionValidMultiple = `function Example() {
  const [example, setExample] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const newExample = "Example";
    const newCount = 1;
    setExample(newExample);
    setCount(newCount);
    console.log(newExample);
    console.log(newCount)
  }, [setExample, setCount]);

  return <></>;
}`;

const classValidDestructureSetstate = `class Example extends Component {
  componentDidMount() {
    const { setState } = this;
    const example = "Example";
    setState({example});
    console.log(example);
  }
  
  render() {
    return <></>;
  }
}`;

const classValidUpdater = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState(prevState => ({example}));
    console.log(example);
  }
  
  render() {
    return <></>;
  }
}`;

const functionValidDeclaration = `function Example() {
  const [example, setExample] = useState(null);

  function updateExample();{
    const newExample = "Example";
    setExample(newExample);
    console.log(newExample);
  };

  return <></>;
}`;

const functionValidExpression = `function Example() {
  const [example, setExample] = useState(null);

  const updateExample = function() {
    const newExample = "Example";
    setExample(newExample);
    console.log(newExample);
  };

  return <></>;
}`;

const functionValidArrowExpression = `function Example() {
  const [example, setExample] = useState(null);

  const updateExample = () => {
    const newExample = "Example";
    setExample(newExample);
    console.log(newExample);
  };

  return <></>;
}`;

const functionValidSetterGet = `function Example() {
  const [example, setExample] = useState(true);

  const updateExample = () => {
    setExample(!example);
  };

  return <></>;
}`;

const classInvalid = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({example});
    console.log(this.state.example);
  }
  
  render() {
    return <></>;
  }
}`;

const functionInvalid = `function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    const newExample = "Example";
    setExample(newExample);
    console.log(example);
  }, [example, setExample]);

  return <></>;
}`;

const classInvalidNested = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    if (Math.random() > 0.5) {
      this.setState({example});
    }
    console.log(this.state.example);
  }
  
  render() {
    return <></>;
  }
}`;

const functionInvalidNested = `function Example() {
  const [example, setExample] = useState(null);

  useEffect(() => {
    const newExample = "Example";
    if (Math.random() > 0.5) {
      setExample(newExample);
    }
    console.log(example);
  }, [example, setExample]);

  return <></>;
}`;

const classInvalidMultiple = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({example, count: 1});
    console.log(this.state.example);
    console.log(this.state.count);
  }
  
  render() {
    return <></>;
  }
}`;

const functionInvalidMultiple = `function Example() {
  const [example, setExample] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const newExample = "Example";
    const newCount = 1;
    setExample(newExample);
    setCount(newCount);
    console.log(example);
    console.log(count)
  }, [example, count, setExample, setCount]);

  return <></>;
}`;

const classInvalidDestructureSetstate = `class Example extends Component {
  componentDidMount() {
    const { setState } = this;
    const example = "Example";
    setState({example});
    console.log(this.state.example);
  }
  
  render() {
    return <></>;
  }
}`;

const classInvalidDestructureState = `class Example extends Component {
  componentDidMount() {
    const { state } = this;
    const example = "Example";
    this.setState({example});
    console.log(state.example);
  }
  
  render() {
    return <></>;
  }
}`;

const classInvalidUpdater = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState(prevState => ({example}));
    console.log(this.state.example);
  }
  
  render() {
    return <></>;
  }
}`;

const functionInvalidDeclaration = `function Example() {
  const [example, setExample] = useState(null);

  function updateExample() {
    const newExample = "Example";
    setExample(newExample);
    console.log(example);
  };

  return <></>;
}`;

const functionInvalidExpression = `function Example() {
  const [example, setExample] = useState(null);

  const updateExample = function() {
    const newExample = "Example";
    setExample(newExample);
    console.log(example);
  };

  return <></>;
}`;

const functionInvalidArrowExpression = `function Example() {
  const [example, setExample] = useState(null);
  
  const updateExample = () => {
    const newExample = "Example";
    setExample(newExample);
    console.log(example);
  };

  return <></>;
}`;

const classError = {
  message:
    "state fields modified by a setState call should not be accessed afterwards in the same block"
};

const functionError = {
  message:
    "state fields modified by a useState setter call should not be accessed afterwards in the same block"
};

ruleTester.run("no-access-state-after-set", rule, {
  valid: [
    { code: classValid },
    { code: functionValid },
    { code: classValidNested },
    { code: functionValidNested },
    { code: classValidOutside },
    { code: functionValidOutside },
    { code: classValidBefore },
    { code: functionValidBefore },
    { code: classValidMultiple },
    { code: functionValidMultiple },
    { code: classValidDestructureSetstate },
    { code: classValidUpdater },
    { code: functionValidDeclaration },
    { code: functionValidExpression },
    { code: functionValidArrowExpression },
    { code: functionValidSetterGet }
  ],
  invalid: [
    {
      code: classInvalid,
      errors: [classError]
    },
    { code: functionInvalid, errors: [functionError] },
    { code: classInvalidNested, errors: [classError] },
    { code: functionInvalidNested, errors: [functionError] },
    {
      code: classInvalidMultiple,
      errors: [classError, classError]
    },
    { code: functionInvalidMultiple, errors: [functionError, functionError] },
    {
      code: classInvalidDestructureSetstate,
      errors: [classError]
    },
    {
      code: classInvalidDestructureState,
      errors: [classError]
    },
    { code: classInvalidUpdater, errors: [classError] },
    { code: functionInvalidDeclaration, errors: [functionError] },
    { code: functionInvalidExpression, errors: [functionError] },
    { code: functionInvalidArrowExpression, errors: [functionError] }
  ]
});
