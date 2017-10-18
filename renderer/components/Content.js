import Drop from "../components/Drop";
import ListEmpty from "../components/ListEmpty";
import List from "../components/List";

const Content = ({
  searchQuery,
  files = [],
  results = [],
  loading,
  onDrop,
  onDoubleClick,
  onContextMenu
}) => (
  <section className={loading ? "loading" : ""}>
    {searchQuery !== "" && results.length === 0 && <ListEmpty />}

    {searchQuery === "" && files.length === 0 && <Drop onDrop={onDrop} />}

    {files.length > 0 && (
      <List
        results={files}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      />
    )}
    {results.length > 0 && (
      <List
        results={results}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      />
    )}

    <style jsx>{`
      section {
        height: calc(100vh - 120px);
        overflow: hidden;
        overflow-y: scroll;
      }

      .loading {
        opacity: 0.4;
        overflow-y: hidden;
        pointer-events: none;
      }
    `}</style>
  </section>
);

export default Content;
