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

const classValidIf = `class Example extends Component {
  componentDidMount() {
    if (example) {
      const example = "Example";
      this.setState({example});
      return;
    }
    console.log(this.state.example);
  }
  
  render() {
    return <></>;
  }
}`;

const functionValidIf = `function Example() {
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
}`;

const classValidProperty = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({example});
    console.log(this.state.other.example);
  }
  
  render() {
    return <></>;
  }
}`;

const functionValidProperty = `function Example() {
  const [example, setExample] = useState(true);
  const [other, setOther] = useState(true);

  const updateExample = () => {
    const newExample = "Example";
    setExample(newExample);
    console.log(other.example);
  };

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

const functionValidUseEffect = `function Example() {
  const [example, setExample] = useState(true);

  useEffect(() => {
    const newExample = !example;
    setExample(newExample);
    console.log(newExample);
  }, [example, setExample]);

  return <></>;
}`;

const functionValidDeclarationAssignment = `function Example() {
  const [example, setExample] = useState(true);

  useEffect(() => {
    function setExampleWrapper() { 
      setExample(false);
    };

    if (example) {
      console.log("hi");
    }

    setExampleWrapper();
  }, [validUser]);

  return <></>;
}`;

const functionValidArrowAssignment = `function Example() {
  const [example, setExample] = useState(true);

  useEffect(() => {
    const setExampleWrapper = () => {
      setExample(false);
    }

    if (example) {
      console.log("hi");
    }

    setExampleWrapper();
  }, [validUser]);

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

const classInvalidIf = `class Example extends Component {
  componentDidMount() {
    if (example) {
      const example = "Example";
      this.setState({example});
      console.log(this.state.example);
    }
  }
  
  render() {
    return <></>;
  }
}`;

const functionInvalidIf = `function Example() {
  const [example, setExample] = useState(true);

  const updateExample = () => {
    if (example) {
      const newExample = "Example";
      setExample(newExample);
      console.log(example);
    }
  };

  return <></>;
}`;

const classInvalidThen = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    getData().then(() => {
      this.setState({example});
    });
    console.log(this.state.example);
  }
  
  render() {
    return <></>;
  }
}`;

const functionInvalidThen = `function Example() {
  const [example, setExample] = useState(true);

  const updateExample = () => {
    const example = "Example";
    getData().then((newExample) => {
      setExample(newExample)
    });
    console.log(example);
  };

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

const functionInvalidUseEffect = `function Example() {
  const [example, setExample] = useState(true);

  useEffect(() => {
    const newExample = !example;
    setExample(newExample);
    console.log(example);
  }, [example, setExample]);

  return <></>;
}`;

const functionInvalidDeclarationAssignment = `function Example() {
  const [example, setExample] = useState(true);

  useEffect(() => {
    function setExampleWrapper() { 
      setExample(false);
      console.log(example);
    };

    if (example) {
      console.log("hi");
    }

    setExampleWrapper();
  }, [validUser]);

  return <></>;
}`;

const functionInvalidArrowAssignment = `function Example() {
  const [example, setExample] = useState(true);

  useEffect(() => {
    const setExampleWrapper = () => {
      setExample(false);
      console.log(example);
    }

    if (example) {
      console.log("hi");
    }

    setExampleWrapper();
  }, [validUser]);

  return <></>;
}`;

const classError = {
  message:
    "state fields modified by a setState call should not be accessed afterwards in the same block",
};

const functionError = {
  message:
    "state fields modified by a useState setter call should not be accessed afterwards in the same block",
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
    { code: classValidIf },
    { code: functionValidIf },
    { code: classValidProperty },
    { code: functionValidProperty },
    { code: classValidDestructureSetstate },
    { code: classValidUpdater },
    { code: functionValidDeclaration },
    { code: functionValidExpression },
    { code: functionValidArrowExpression },
    { code: functionValidSetterGet },
    { code: functionValidUseEffect },
    { code: functionValidDeclarationAssignment },
    { code: functionValidArrowAssignment },
  ],
  invalid: [
    {
      code: classInvalid,
      errors: [classError],
    },
    { code: functionInvalid, errors: [functionError] },
    { code: classInvalidNested, errors: [classError] },
    { code: functionInvalidNested, errors: [functionError] },
    {
      code: classInvalidMultiple,
      errors: [classError, classError],
    },
    { code: functionInvalidMultiple, errors: [functionError, functionError] },
    { code: classInvalidIf, errors: [classError] },
    { code: functionInvalidIf, errors: [functionError] },
    { code: classInvalidThen, errors: [classError] },
    { code: functionInvalidThen, errors: [functionError] },
    {
      code: classInvalidDestructureSetstate,
      errors: [classError],
    },
    {
      code: classInvalidDestructureState,
      errors: [classError],
    },
    { code: classInvalidUpdater, errors: [classError] },
    { code: functionInvalidDeclaration, errors: [functionError] },
    { code: functionInvalidExpression, errors: [functionError] },
    { code: functionInvalidArrowExpression, errors: [functionError] },
    { code: functionInvalidUseEffect, errors: [functionError] },
    { code: functionInvalidDeclarationAssignment, errors: [functionError] },
    { code: functionInvalidArrowAssignment, errors: [functionError] },
  ],
});
