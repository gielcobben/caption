import Drop from "../components/drop";
import ListEmpty from "../components/listEmpty";
import ListFiles from "../components/listFiles";

export default ({ searchQuery, files, onDrop }) =>
  <section>
    {searchQuery !== "" && <ListEmpty />}
    {searchQuery === "" && files.length === 0 && <Drop onDrop={onDrop} />}
    {files.length > 0 && <ListFiles files={files} />}

    <style jsx>{`
      section {
        height: calc(100vh - 120px);
        overflow: hidden;
      }
    `}</style>
  </section>;
