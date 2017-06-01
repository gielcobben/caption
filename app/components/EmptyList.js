import "./EmptyList.scss";
import React, { Component } from "react";

export default class EmptyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 10
    };
    this.setAmount = this.setAmount.bind(this);
  }

  setAmount() {
    this.setState({
      amount: Math.ceil((window.innerHeight - 125) / 30)
    });
  }

  componentWillMount() {
    this.setAmount();
    window.addEventListener("resize", this.setAmount);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setAmount);
  }

  render() {
    const list = [...Array(this.state.amount).keys()];

    return (
      <ul className="list">
        {list.map((li, index) => {
          return <li key={index} />;
        })}
      </ul>
    );
  }
}
