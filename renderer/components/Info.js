import Loading from "./Loading";

const Info = ({
  results = [],
  loading = false,
  isFileSearch = false,
  totalFiles = 0,
  foundFiles = 0,
}) => (
  <div>
    {!loading &&
      !isFileSearch && (
        <span>
          {results.length <= 0 ? `Nothing Found` : `${results.length} Results`}
        </span>
      )}

    {!loading &&
      isFileSearch && (
        <span>{`${foundFiles} / ${totalFiles} Subtitles found`}</span>
      )}

    {loading && <Loading />}
    <style jsx>
      {`
        div {
          width: 100%;
          height: 16px;
          display: flex;
          justify-content: flex-end;
          font-size: 12px;
          padding: 2px 0;
        }
      `}
    </style>
  </div>
);

export default Info;
