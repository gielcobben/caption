import Drop from "../components/drop";
import ListEmpty from "../components/listEmpty";
import List from "../components/list";

export default ({ searchQuery, files, results, onDrop }) =>
  <section>
    {searchQuery !== "" && results.length === 0 && <ListEmpty />}
    {searchQuery === "" && files.length === 0 && <Drop onDrop={onDrop} />}
    {files.length > 0 && <List results={files} />}
    {results.length > 0 && <List results={results} />}

    <style jsx>{`
      section {
        height: calc(100vh - 120px);
        overflow: hidden;
        overflow-y: scroll;
      }
    `}</style>
  </section>;
