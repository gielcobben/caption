// Packages
import { ipcRenderer } from "electron";
// import Store from "electron-settings";

// Utils
import { processFiles } from "../utils";
// import { textSearch, fileSearch } from "../sources";

// Components
import Layout from "../components/Layout";
import TitleBar from "../components/TitleBar";
import Search from "../components/Search";
import Content from "../components/Content";
import Footer from "../components/Footer";

// Global variables
const ESC_KEY = 27;

export default class MainApp extends React.Component {
  static async getInitialProps() {
    // if (!Store.has("settings")) {
    //   const language = "eng";
    //   Store.set("settings", { language });
    // }

    // const settings = Store.get("settings");

    const settings = {
      language: "eng"
    };

    return { settings };
  }

  constructor(props) {
    super(props);

    const { language } = props.settings;

    this.state = {
      language,
      files: [],
      results: [],
      loading: false,
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

    ipcRenderer.on("results", (event, results) => {
      this.setState({ results, loading: false });
    });

    ipcRenderer.on("language", (event, language) => {
      this.setState({ language });
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
      loading: false
    });

    this.onBlur();
  }

  onLanguageChange(event) {
    const { results, files } = this.state;
    const language = event.target.value;

    this.setState({ language }, () => {
      if (results.length > 0 || files.length > 0) {
        this.onSearch();
      }
    });

    ipcRenderer.send("setStore", "language", language);
  }

  onSearch(event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({ loading: true });

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
    const { searchQuery, language } = this.state;
    ipcRenderer.send("textSearch", searchQuery, language);
  }

  async searchFile() {
    const { files, language } = this.state;
    ipcRenderer.send("fileSearch", files, language);
  }

  render() {
    const {
      placeholder,
      searchQuery,
      files,
      results,
      language,
      loading
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
        <Footer
          loading={loading}
          results={results}
          language={language}
          onLanguageChange={this.onLanguageChange}
        />
      </Layout>
    );
  }
}
