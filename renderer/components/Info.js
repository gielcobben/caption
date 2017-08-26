import Loading from "./Loading";

const Info = ({ results, loading }) =>
  <div>
    {!loading &&
      <span>
        {results.length} Results
      </span>}
    {loading && <Loading />}
    <style jsx>{`
      div {
        width: 100%;
        height: 16px;
        display: flex;
        justify-content: flex-end;
      }
    `}</style>
  </div>;

export default Info;
