// Packages
import Store from "electron-settings";

// Utils
import { processFiles } from "../utils";
import { opensubtitles } from "../sources";

// Components
import Layout from "../components/layout";
import TitleBar from "../components/titleBar";
import Search from "../components/search";
import Content from "../components/content";
import Footer from "../components/footer";

export default class MainApp extends React.Component {
  static async getInitialProps({ req }) {
    if (!Store.has("settings")) {
      const language = "eng";
      Store.set("settings", { language });
    }

    const settings = Store.get("settings");

    return { settings };
  }

  constructor(props) {
    super(props);

    const { language } = this.props.settings;

    this.state = {
      files: [],
      results: [],
      language: language,
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

    this.searchQuery = this.searchQuery.bind(this);
    this.searchFile = this.searchFile.bind(this);
  }

  // handling escape close
  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown(event) {
    if (event.keyCode >= 48 && event.keyCode <= 90) {
      this.search.textInput.focus();
    }

    if (event.keyCode === 27) {
      this.onReset();
    }
  }

  onChange(event) {
    const searchQuery = event.target.value;
    const files = [];
    this.setState({ searchQuery, files });
  }

  onFocus() {
    const placeholder = "";
    this.setState({ placeholder });
  }

  onBlur() {
    const placeholder = "Search for a show...";
    this.setState({ placeholder });
  }

  async onDrop(rawFiles) {
    const files = await processFiles(rawFiles);
    this.setState({ files });
    this.onSearch();
  }

  onReset() {
    const placeholder = "Search for a show...";
    const searchQuery = "";
    const files = [];
    const results = [];
    this.setState({ placeholder, searchQuery, files, results });
    this.search.textInput.blur();
  }

  onLanguageChange(event) {
    const { results, files } = this.state;
    const language = event.target.value;

    this.setState({ language }, () => {
      if (results.length > 0 || files.length > 0) {
        this.onSearch();
      }
    });

    Store.set("settings", { language });
  }

  onSearch(event) {
    if (event) {
      event.preventDefault();
    }

    const { searchQuery, files } = this.state;

    if (searchQuery !== "") {
      this.searchQuery();
    }

    if (files.length > 0) {
      this.searchFile();
    }
  }

  async searchQuery() {
    const { searchQuery, language } = this.state;
    const results = await opensubtitles.searchQuery(
      searchQuery,
      language,
      "all"
    );
    this.setState({ results });
  }

  async searchFile() {
    const { files, language } = this.state;
    const results = await opensubtitles.searchFiles(files, language, "best");
  }

  render() {
    const { placeholder, searchQuery, files, results, language } = this.state;

    return (
      <Layout>
        <TitleBar />
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
          onDrop={this.onDrop}
        />
        <Footer
          results={results}
          language={language}
          onLanguageChange={this.onLanguageChange}
        />
      </Layout>
    );
  }
}
