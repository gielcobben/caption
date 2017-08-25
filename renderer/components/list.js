// Packages
import { shell } from "electron";

// Components
import ListItem from "./listItem";
import { opensubtitles } from "../sources";

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onArrowUp = this.onArrowUp.bind(this);
    this.onArrowDown = this.onArrowDown.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown(event) {
    if (event.keyCode === 40) {
      this.onArrowDown();
    }

    if (event.keyCode === 38) {
      this.onArrowUp();
    }

    if (event.keyCode === 13) {
      this.onDoubleClick();
    }
  }

  onArrowDown() {
    const { results } = this.props;
    const currentSelected = this.state.selected;
    const length = results.length;
    const selected = currentSelected !== null ? currentSelected + 1 : 0;

    if (length !== selected) {
      this.setState({ selected });
    }
  }

  onArrowUp() {
    const currentSelected = this.state.selected;
    const selected = currentSelected - 1;

    if (currentSelected !== 0) {
      this.setState({ selected });
    }
  }

  onDoubleClick() {
    const { results } = this.props;
    const { selected } = this.state;
    const item = results[selected];

    // text search
    if (item.filename) {
      opensubtitles.downloadSubtitle(null, item, true);
    } else {
      shell.showItemInFolder(item.path);
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
            onDoubleClick={this.onDoubleClick}
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
