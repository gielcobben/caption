import { connect } from "react-redux";

import Search from "./../components/Search";

import { updateSearchQuery } from "./../actions";

const mapStateToProps = ({ search }) => ({
  value: search.searchQuery,
  placeholder: search.placeholder,
});
const mapDispatchToProps = {
  onChange: event => (dispatch) => {
    const searchQuery = event.target.value;
    dispatch(updateSearchQuery(searchQuery));
  },
};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(Search);
