// Packages
import { Menu, MenuItem, remote, shell, ipcRenderer } from "electron";

// Components
import ListItem from "./ListItem";

// Global variables
const ARROW_DOWN_KEY = 40;
const ARROW_UP_KEY = 38;
const ENTER_KEY = 13;

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
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

    if (event.keyCode === ENTER_KEY && event.target.nodeName !== "INPUT") {
      this.onDoubleClick();
    }
  }

  onArrowDown() {
    const { results } = this.props;
    const currentSelected = this.state.selected;
    const { length } = results;
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

    // Nothing selected.
    if (!selected) {
      return;
    }

    const item = results[selected];

    // If size is specified, the file is dropped.
    if (item.size) {
      shell.openItem(item.path);
    } else {
      ipcRenderer.send("downloadSubtitle", item);
    }
  }

  onContextMenu(clicked) {
    let template;
    const { Menu } = remote;
    const { results } = this.props;
    const item = results[clicked];

    // If size is specified, the file is dropped.
    if (item.size) {
      template = Menu.buildFromTemplate([
        {
          label: "Open",
          click: () => {
            shell.openItem(item.path);
          },
        },
        {
          label: "Reveal in Folder...",
          click: () => {
            shell.showItemInFolder(item.path);
          },
        },
      ]);
    } else {
      template = Menu.buildFromTemplate([
        {
          label: "Download",
          click: () => {
            ipcRenderer.send("downloadSubtitle", item);
          },
        },
      ]);
    }

    // Wait till state is set.
    this.setState({ selected: clicked }, () => {
      setTimeout(() => {
        template.popup(remote.getCurrentWindow());
      }, 10);
    });
  }

  onDragStart(event, index) {
    event.dataTransfer.effectAllowed = "copy";
    const item = this.props.results[index];
    if (item) {
      ipcRenderer.send("startDrag", item);
    }
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
            onContextMenu={() => this.onContextMenu(index)}
            onDragStart={(event) => this.onDragStart(event, index)}
          />
        ))}

        <style jsx>
          {`
            ul {
              height: 100%;
              overflow-y: scroll;
            }
          `}
        </style>
      </ul>
    );
  }
}

export default List;
