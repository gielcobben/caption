import languages from "../languages.json";

const languageToggle = ({ language, onLanguageChange }) =>
  <select value={language} onChange={onLanguageChange}>
    {languages.map((lang, index) => {
      return (
        <option key={index} value={lang.code}>
          {lang.name}
        </option>
      );
    })}
    <style jsx>{`
      select {
        appearence: none;
        border: none;
        background: none;
        outline: none;
        padding: 0;
        margin: 0;
      }
    `}</style>
  </select>;

export default languageToggle;
