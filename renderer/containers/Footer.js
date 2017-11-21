import { connect } from "react-redux";

import { setLanguage } from "./../actions";
import Footer from "./../components/Footer";

const mapStateToProps = ({ ui, search }) => ({
  language: ui.language,
  loading: !search.searchCompleted,
  results: search.results,
  showResults: search.searchAttempts > 0,
  isFileSearch: search.files.length > 0,
  totalFiles: search.files.length,
  foundFiles: search.files.filter(({ status }) => status === "done").length,
});
const mapDispatchToProps = {
  onLanguageChange: setLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
