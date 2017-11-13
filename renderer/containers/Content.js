import { connect } from "react-redux";

import Content from "./../components/Content";
import { dropFiles } from "./../actions";

// Utils
import { processFiles } from "../utils";
import { ipcRenderer } from "electron";

const mapStateToProps = ({ search }) => ({
  searchQuery: search.searchQuery,
  files: search.files,
  results: search.results,
  loading: search.loading,
});

const mapDispatchToProps = {
  onDrop: rawFiles => async dispatch => {

    // GIEL
    const droppedItems = [];
    rawFiles.map(file => droppedItems.push(file.path));
    ipcRenderer.send("processFiles", droppedItems);
    // END

    ipcRenderer.on("processedFiles", (event, files) => {
      console.log(files);
      dispatch(dropFiles(files));
    });

    // const files = await processFiles(rawFiles);
    // dispatch(dropFiles(files));
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
