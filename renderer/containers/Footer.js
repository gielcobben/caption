import { connect } from "react-redux";

import { setLanguage } from "./../actions";
import Footer from "./../components/Footer";

const mapStateToProps = ({ ui, search }) => ({
  language: ui.language,
  loading: !search.searchCompleted,
  results: search.results,
});
const mapDispatchToProps = {
  onLanguageChange: setLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
