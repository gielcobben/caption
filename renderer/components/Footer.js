import LanguageToggle from "./LanguageToggle";
import Info from "./Info";

const Footer = ({
  results = [],
  language,
  loading,
  onLanguageChange,
  showResults,
  isFileSearch,
  totalFiles,
  foundFiles,
}) => (
  <footer>
    <LanguageToggle
      language={language}
      onLanguageChange={event => onLanguageChange(event.target.value)}
    />

    {showResults && (
      <Info
        results={results}
        loading={loading}
        isFileSearch={isFileSearch}
        totalFiles={totalFiles}
        foundFiles={foundFiles}
      />
    )}

    <style jsx>
      {`
        footer {
          background: rgba(255, 255, 255, 0.5);
          height: 40px;
          box-shadow: 0px -0.5px 0px #cacbcc;
          padding: 13px 12px;
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.4);
        }
      `}
    </style>
  </footer>
);

export default Footer;
