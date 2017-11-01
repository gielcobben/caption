import { connect } from "react-redux";

import { setLanguage } from "./../actions";
import Footer from "./../components/Footer";

const mapStateToProps = ({ ui }) => ({ language: ui.language });
const mapDispatchToProps = {
  onLanguageChange: setLanguage
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
