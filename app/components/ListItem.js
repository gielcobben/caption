import "./ListItem.scss";
import React, { Component } from "react";
import { shell } from "electron";
import { humanFileSize } from "../scripts/Utility";
import { opensubtitles, addic7ed } from "../sources";
import Loading from "./Loading";

export default class ListItem extends Component {
  constructor(props) {
    super(props);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  handleDoubleClick() {
    const { item } = this.props;

    // Check if it's a textsearch or filesearch with a variable (item.title)
    if (item.title) {
      switch (item.source) {
        case "opensubtitles":
          return opensubtitles.downloadQuery(item);
        case "addic7ed":
          return addic7ed.downloadQuery(item);
        default:
          return null;
      }
    } else {
      // FileSearch so open or show the file when doubleclick
      const extention = item.path.substr(item.path.lastIndexOf(".") + 1);

      if (extention === "mp4" || extention === "mkv" || extention === "avi") {
        shell.openItem(item.path);
      } else {
        shell.showItemInFolder(item.path);
      }
    }
  }

  render() {
    let title;
    let status;
    const {
      handleClick,
      handleContextMenu,
      item,
      selected,
      index
    } = this.props;
    const successIcon = (
      <svg width="12" height="10">
        <path
          fill="#4BD964"
          d="M4.172 6.414l-2.83-2.828L-.07 5 4.17 9.243l7.07-7.07L9.83.756"
        />
      </svg>
    );
    const failedIcon = (
      <svg width="10" height="10">
        <path
          fill="#FF3B30"
          d="M6.414 5l2.83-2.828L7.827.757 5 3.587 2.172.756.757 2.172 3.587 5 .756 7.828l1.415 1.415L5 6.413l2.828 2.83 1.415-1.415"
        />
      </svg>
    );

    // Title is the name of the subtitle files (movie release name)
    if (item.title) {
      title = item.title;
    } else {
      // Title is the name of the dropped files
      title = item.name;
    }

    // Check status of file
    if (item.status === "done") {
      status = <span className="status done">{successIcon}</span>;
    } else if (item.status === "failed") {
      status = <span className="status failed">{failedIcon}</span>;
    } else if (item.status === "loading") {
      status = <Loading small={true} />;
    } else {
      status = "";
    }

    return (
      <li
        className={`list-item ${index == selected ? "selected" : ""}`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onDoubleClick={this.handleDoubleClick}
      >
        {title}
        {item.size &&
          <span className="size">
            {item.extention}
            <span className="dot" />
            {humanFileSize(item.size, true)}
          </span>}
        {status}
      </li>
    );
  }
}
