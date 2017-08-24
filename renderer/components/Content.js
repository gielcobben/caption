import Drop from "../components/Drop";
import ListEmpty from "../components/ListEmpty";

export default ({ searchQuery, onDrop }) =>
  <section>
    {searchQuery !== "" && <ListEmpty />}
    {searchQuery === "" && <Drop onDrop={onDrop} />}

    <style jsx>{`
      section {
        height: calc(100vh - 120px);
        overflow: hidden;
      }
    `}</style>
  </section>;
