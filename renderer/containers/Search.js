import { connect } from "react-redux";

import Search from "./../components/Search";

import { updateSearchQuery, resetSearch } from "./../actions";

const mapStateToProps = ({ search }) => ({
  value: search.searchQuery || search.dropFilePath,
  placeholder: search.placeholder,
  dropFilePath: search.dropFilePath,
  dropFilePathClean: search.dropFilePathClean,
});

const mapDispatchToProps = {
  onChange: event => dispatch => {
    const searchQuery = event.target.value;
    dispatch(updateSearchQuery(searchQuery));
  },
  onReset: resetSearch,
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(Search);
