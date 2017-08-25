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
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
      placeholder: "Search for a show...",
      files: [],
      results: []
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  // handling escape close
  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown(event) {
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

  onDrop(rawFiles) {
    console.log(rawFiles);
    const files = processFiles(rawFiles);
    this.setState({ files });
  }

  onReset() {
    const placeholder = "Search for a show...";
    const searchQuery = "";
    const files = [];
    const results = [];
    this.setState({ placeholder, searchQuery, files, results });
  }

  async onSearch(event) {
    event.preventDefault();
    const { searchQuery } = this.state;

    const results = await opensubtitles.searchQuery(searchQuery, "eng", "all");

    this.setState({ results });
  }

  render() {
    const { placeholder, searchQuery, files, results } = this.state;

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
        />
        <Content
          searchQuery={searchQuery}
          files={files}
          results={results}
          onDrop={this.onDrop}
        />
        <Footer />
      </Layout>
    );
  }
}
