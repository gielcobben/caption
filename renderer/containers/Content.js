import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import Content from "./../components/Content";
import { dropFiles } from "./../actions";

const mapStateToProps = ({ search }) => ({
  searchQuery: search.searchQuery,
  files: search.files,
  results: search.results,
  loading: search.loading,
});

const mapDispatchToProps = {
  onDrop: rawFiles => async dispatch => {
    const droppedItems = [];

    rawFiles.map(file => droppedItems.push(file.path));

    ipcRenderer.send("processFiles", droppedItems);

    ipcRenderer.on("processedFiles", (event, files) => {
      dispatch(dropFiles(files));
    });
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
