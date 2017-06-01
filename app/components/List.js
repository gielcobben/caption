import "./List.scss";
import React, { Component } from "react";
import ListItem from "./ListItem";
import { remote, shell } from "electron";
import { checkExtention, downloadSubtitleFile } from "../scripts/Utility";

const { Menu, MenuItem } = remote;

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  componentWillMount() {
    window.addEventListener("contextmenu", event => {
      event.preventDefault();
    });
  }

  handleClick(index) {
    this.setState({
      selected: index
    });
  }

  handleContextMenu(index) {
    const { results } = this.props;
    const item = results[index];

    this.setState({
      selected: index
    });

    // If TextSearch
    if (item.title) {
      // Menu with Download
      Menu.buildFromTemplate([
        {
          label: "Download",
          click: () => {
            // window.location.assign(item.ZipDownloadLink)
            downloadSubtitleFile(item);
          }
        }
      ]).popup(remote.getCurrentWindow());
    } else {
      // Else DroppedFiles
      // FileSearch so open or show the file when doubleclick
      const extention = item.path.substr(item.path.lastIndexOf(".") + 1);

      if (extention === "mp4" || extention === "mkv" || extention === "avi") {
        // Menu with Play and Reveal in Finder
        Menu.buildFromTemplate([
          {
            label: "Play",
            click: () => {
              shell.openItem(item.path);
            }
          },
          {
            label: "Reveal in Finder",
            click: () => {
              shell.showItemInFolder(item.path);
            }
          }
        ]).popup(remote.getCurrentWindow());
      } else {
        // Menu with Reveal in Finder
        Menu.buildFromTemplate([
          {
            label: "Reveal in Finder",
            click: () => {
              shell.showItemInFolder(item.path);
            }
          }
        ]).popup(remote.getCurrentWindow());
      }
    }
  }

  render() {
    const { textSearch, fileSearch, results, resetList, onDrop } = this.props;

    return (
      <div className="inner" onDrop={onDrop}>
        <ul className={`list ${textSearch ? "text" : "file"}`}>
          {textSearch &&
            results.map((result, index) => {
              return (
                <ListItem
                  key={index}
                  item={result}
                  handleClick={this.handleClick.bind(this, index)}
                  handleContextMenu={this.handleContextMenu.bind(this, index)}
                  selected={this.state.selected}
                  index={index}
                />
              );
            })}

          {fileSearch &&
            results.map((file, index) => {
              return (
                <ListItem
                  key={index}
                  item={file}
                  handleClick={this.handleClick.bind(this, index)}
                  handleContextMenu={this.handleContextMenu.bind(this, index)}
                  selected={this.state.selected}
                  index={index}
                />
              );
            })}
        </ul>
      </div>
    );
  }
}
