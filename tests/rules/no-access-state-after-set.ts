import rule from "../../src/rules/no-access-state-after-set";
import { ruleTester } from "../tester";

const classValid = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({example});
    console.log(example);
  }
}`;

const classValidMultiple = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({example, count: 1});
    console.log(example);
    console.log(1);
  }
}`;

const classValidDestructureSetstate = `class Example extends Component {
  componentDidMount() {
    const { setState } = this;
    const example = "Example";
    setState({example});
    console.log(example);
  }
}`;

const classValidUpdater = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState(prevState => ({example, count: prevState.count + 1}));
    console.log(example);
  }
}`;

const classInvalid = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({example});
    console.log(this.state.example);
  }
}`;

const classInvalidMultiple = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState({example, count: 1});
    console.log(this.state.example);
    console.log(this.state.count);
  }
}`;

const classInvalidDestructureSetstate = `class Example extends Component {
  componentDidMount() {
    const { setState } = this;
    const example = "Example";
    setState({example});
    console.log(this.state.example);
  }
}`;

const classInvalidDestructureState = `class Example extends Component {
  componentDidMount() {
    const { state } = this;
    const example = "Example";
    this.setState({example});
    console.log(state.example);
  }
}`;

const classInvalidUpdater = `class Example extends Component {
  componentDidMount() {
    const example = "Example";
    this.setState(prevState => ({example, count: prevState.count + 1}));
    console.log(this.state.example);
  }
}`;

const classError = {
  message:
    "state fields modified in a setState call should not be accessed afterwards in the same block"
};

ruleTester.run("no-access-state-after-set", rule, {
  valid: [
    { code: classValid },
    { code: classValidMultiple },
    { code: classValidDestructureSetstate },
    { code: classValidUpdater }
  ],
  invalid: [
    {
      code: classInvalid,
      errors: [classError]
    },
    {
      code: classInvalidMultiple,
      errors: [classError, classError]
    },
    {
      code: classInvalidDestructureSetstate,
      errors: [classError]
    },
    {
      code: classInvalidDestructureState,
      errors: [classError]
    },
    { code: classInvalidUpdater, errors: [classError] }
  ]
});
