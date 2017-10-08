// Packages
import { shell } from "electron";

// Components
import ListItem from "./ListItem";
import { opensubtitles } from "../sources";

// Global variables
const ARROW_DOWN_KEY = 40;
const ARROW_UP_KEY = 38;
const ENTER_KEY = 13;

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
    if (event.keyCode === ARROW_DOWN_KEY) {
      this.onArrowDown();
    }

    if (event.keyCode === ARROW_UP_KEY) {
      this.onArrowUp();
    }

    if (event.keyCode === ENTER_KEY) {
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

    if (!item) {
      return false;
    }

    // Text search
    if (item.filename) {
      return opensubtitles.downloadSubtitles([
        { file: null, subtitle: item, dialog: true }
      ]);
    }

    return shell.showItemInFolder(item.path);
  }

  render() {
    const { results } = this.props;
    const { selected } = this.state;

    return (
      <ul>
        {results.map((item, index) => (
          <ListItem
            key={index}
            item={item}
            selected={selected === index}
            onClick={() => this.setState({ selected: index })}
            onDoubleClick={this.onDoubleClick}
          />
        ))}

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
