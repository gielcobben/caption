const listFiles = ({ files }) =>
  <ul>
    {files.map((file, index) =>
      <li key={index}>
        {file.name}
      </li>
    )}

    <style jsx>{`
      ul {
        height: 100%;
      }
    `}</style>
  </ul>;

export default listFiles;
