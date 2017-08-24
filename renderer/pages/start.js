// Components
import Layout from "../components/Layout";
import TitleBar from "../components/TitleBar";
import Search from "../components/Search";
import Content from "../components/Content";
import Footer from "../components/Footer";

export default class MainApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
      placeholder: "Search for a show...",
      files: []
    };

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onChange(event) {
    const searchQuery = event.target.value;
    this.setState({ searchQuery });
  }

  onFocus() {
    const placeholder = "";
    this.setState({ placeholder });
  }

  onBlur() {
    const placeholder = "Search for a show...";
    this.setState({ placeholder });
  }

  onDrop(files) {
    this.setState({ files });
  }

  render() {
    const { placeholder, searchQuery } = this.state;

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
        <Content searchQuery={searchQuery} onDrop={this.onDrop} />
        <Footer />
      </Layout>
    );
  }
}
