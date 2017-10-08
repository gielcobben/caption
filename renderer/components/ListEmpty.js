class ListEmpty extends React.Component {
  constructor(props) {
    super(props);
    this.state = { amount: 10 };
    this.setAmount = this.setAmount.bind(this);
  }

  setAmount() {
    if (typeof window !== "undefined") {
      const amount = Math.ceil((window.innerHeight - 125) / 30);
      this.setState({ amount });
    }
  }

  componentWillMount() {
    if (typeof window !== "undefined") {
      this.setAmount();
      window.addEventListener("resize", this.setAmount);
    }
  }

  componentWillUnMount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.setAmount);
    }
  }

  render() {
    const list = [...Array(this.state.amount).keys()];

    return (
      <ul>
        {list.map((li, index) => {
          return <li key={index} />;
        })}

        <style jsx>{`
          ul {
            height: 100%;
          }

          li {
            display: block;
            height: 35px;
            width: 100vw;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          li:nth-child(even) {
            background: rgba(255, 255, 255, .3);
          }
        `}</style>
      </ul>
    );
  }
}

export default ListEmpty;
