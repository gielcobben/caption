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
  onDrop: rawFiles => () => {
    const droppedItems = [];
    rawFiles.map(file => droppedItems.push(file.path));
    ipcRenderer.send("processFiles", droppedItems);
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
