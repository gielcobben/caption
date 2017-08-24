import ListItem from "./listItem";

const listFiles = ({ files }) =>
  <ul>
    {files.map((file, index) => <ListItem file={file} />)}

    <style jsx>{`
      ul {
        height: 100%;
      }
    `}</style>
  </ul>;

export default listFiles;
