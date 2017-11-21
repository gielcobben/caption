import PropTypes from "prop-types";
import Drop from "../components/Drop";
import ListEmpty from "../components/ListEmpty";
import List from "../components/List";

const Content = ({
  searchQuery = "",
  files = [],
  results = [],
  loading,
  onDrop,
}) => (
  <section className={loading ? "loading" : ""} onDrop={onDrop}>
    {searchQuery !== "" && results.length === 0 && <ListEmpty />}
    {searchQuery === "" && files.length === 0 && <Drop />}
    {files.length > 0 && <List results={files} />}
    {results.length > 0 && <List results={results} />}

    <style jsx>
      {`
        section {
          height: 100%;
          overflow: hidden;
        }

        .loading {
          opacity: 0.4;
          overflow-y: hidden;
          pointer-events: none;
        }
      `}
    </style>
  </section>
);

Content.propTypes = {
  searchQuery: PropTypes.string,
  files: PropTypes.array,
  results: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
};

Content.defaultProps = {
  searchQuery: "",
  files: [],
  results: [],
};

export default Content;
