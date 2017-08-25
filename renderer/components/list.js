import ListItem from "./listItem";

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown(event) {
    if (event.keyCode === 40) {
      const { results } = this.props;
      const currentSelected = this.state.selected;
      const length = results.length;
      const selected = currentSelected !== null ? currentSelected + 1 : 0;

      if (length !== selected) {
        this.setState({ selected });
      }
    }

    if (event.keyCode === 38) {
      const currentSelected = this.state.selected;
      const selected = currentSelected - 1;

      if (currentSelected !== 0) {
        this.setState({ selected });
      }
    }
  }

  render() {
    const { results } = this.props;
    const { selected } = this.state;

    return (
      <ul>
        {results.map((item, index) =>
          <ListItem
            key={index}
            item={item}
            selected={selected === index ? true : ""}
            onClick={() => this.setState({ selected: index })}
          />
        )}

        <style jsx>{`
          ul {
            height: 100%;
          }
        `}</style>
      </ul>
    );
  }
}

export default List;
