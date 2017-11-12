import { connect } from "react-redux";

import Content from "./../components/Content";
import { dropFiles } from "./../actions";

// Utils
import { processFiles } from "../utils";

const mapStateToProps = ({ search }) => ({
  searchQuery: search.searchQuery,
  files: search.files,
  results: search.results,
  loading: search.loading,
});
const mapDispatchToProps = {
  onDrop: rawFiles => async dispatch => {
    const files = await processFiles(rawFiles);
    dispatch(dropFiles(files));
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
