// Packages
import { ipcRenderer } from "electron";
import withRedux from "next-redux-wrapper";

// Utils
import { processFiles } from "../utils";

// Components
import Layout from "../components/Layout";
import TitleBar from "../components/TitleBar";
import Search from "../components/Search";
import Content from "../components/Content";
import Footer from "../containers/Footer";

// Redux store
import initStore from "./../store";

// Redux action creators
import { setLanguage } from "./../actions";

// Global variables
const ESC_KEY = 27;

class MainApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      results: [],
      loading: false,
      searchCompleted: true,
      searchQuery: "",
      placeholder: "Search for a show..."
    };

    this.onLanguageChange = this.onLanguageChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onFinishedDownloads = this.onFinishedDownloads.bind(this);

    this.searchQuery = this.searchQuery.bind(this);
    this.searchFile = this.searchFile.bind(this);
  }

  // handling escape close
  componentDidMount() {
    ipcRenderer.once("download-complete", (event, downloadedItems) => {
      this.onFinishedDownloads(downloadedItems);
    });

    ipcRenderer.on("results", (event, { results, isFinished }) => {
      this.setState({
        results,
        loading: false,
        searchCompleted: isFinished
      });
    });

    ipcRenderer.on("language", (event, language) => {
      this.props.setLanguage(language);
    });

    ipcRenderer.send("getStore", "language");

    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown(event) {
    if (event.keyCode >= 48 && event.keyCode <= 90) {
      this.onFocus();
    }

    if (event.keyCode === ESC_KEY) {
      this.onReset();
    }
  }

  onChange(event) {
    const searchQuery = event.target.value;
    const files = [];
    const results = [];
    this.setState({ searchQuery, files, results });
  }

  onFocus() {
    const placeholder = "";
    this.setState({ placeholder });
    this.search.textInput.focus();
  }

  onBlur() {
    const placeholder = "Search for a show...";
    this.setState({ placeholder });
    this.search.textInput.blur();
  }

  async onDrop(rawFiles) {
    const files = await processFiles(rawFiles);
    this.setState({ files });
    this.onSearch();
  }

  onReset() {
    this.setState({
      placeholder: "Search for a show...",
      searchQuery: "",
      files: [],
      results: [],
      loading: false,
      searchCompleted: true
    });

    this.onBlur();
  }

  onLanguageChange(event) {
    const { results, files } = this.state;
    const language = event.target.value;

    // this.setState({ language }, () => {
    //   if (results.length > 0 || files.length > 0) {
    //     this.onSearch();
    //   }
    // });

    this.props.setLanguage(language);
    if (results.length > 0 || files.length > 0) {
      this.onSearch();
    }
  }

  onSearch(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ loading: true, searchCompleted: false });

    const { searchQuery, files } = this.state;

    if (searchQuery !== "") {
      return this.searchQuery();
    }

    if (files.length > 0) {
      return this.searchFile();
    }

    this.onReset();
  }

  onFinishedDownloads(items) {
    this.setState({ loading: false });
  }

  async searchQuery() {
    const { searchQuery } = this.state;
    const { language } = this.props;
    ipcRenderer.send("textSearch", searchQuery, language);
  }

  async searchFile() {
    const { files } = this.state;
    const { language } = this.props;
    ipcRenderer.send("fileSearch", files, language);
  }

  render() {
    const {
      placeholder,
      searchQuery,
      files,
      results,
      loading,
      searchCompleted
    } = this.state;

    return (
      <Layout>
        <TitleBar title="Caption" />
        <Search
          placeholder={placeholder}
          value={searchQuery}
          onSubmit={this.onSearch}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          ref={search => {
            this.search = search;
          }}
        />
        <Content
          searchQuery={searchQuery}
          files={files}
          results={results}
          loading={loading}
          onDrop={this.onDrop}
        />
        <Footer loading={!searchCompleted} results={results} />
      </Layout>
    );
  }
}

const mapStateToProps = ({ ui }) => ({ language: ui.language });
const mapDispatchToProps = {
  setLanguage
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(
  MainApp
);
