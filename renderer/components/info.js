const info = ({ results }) =>
  <div>
    {results.length} Results
    <style jsx>{`
      div {
        width: 100%;
        text-align: right;
      }
    `}</style>
  </div>;

export default info;
