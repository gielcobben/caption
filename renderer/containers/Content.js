import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import Content from "./../components/Content";

const mapStateToProps = ({ search }) => ({
  searchQuery: search.searchQuery,
  files: search.files,
  results: search.results,
  loading: search.loading,
});

const mapDispatchToProps = {
  onDrop: event => () => {
    const droppedItems = [];
    const rawFiles = event.dataTransfer
      ? event.dataTransfer.files
      : event.target.files;

    Object.keys(rawFiles).map(key => droppedItems.push(rawFiles[key].path));

    ipcRenderer.send("processFiles", droppedItems);
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
