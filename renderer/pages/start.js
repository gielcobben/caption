// Utils
import { processFiles } from "../utils";

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
      files: []
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
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
    const files = processFiles(rawFiles);
    this.setState({ files });
  }

  onReset() {
    const placeholder = "Search for a show...";
    const searchQuery = "";
    const files = [];
    this.setState({ placeholder, searchQuery, files });
  }

  render() {
    const { placeholder, searchQuery, files } = this.state;

    return (
      <Layout>
        <TitleBar />
        <Search
          placeholder={placeholder}
          value={searchQuery}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        <Content searchQuery={searchQuery} files={files} onDrop={this.onDrop} />
        <Footer />
      </Layout>
    );
  }
}
