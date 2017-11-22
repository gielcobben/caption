import languages from "../data/languages";

const LanguageToggle = ({ language, onLanguageChange }) => (
  <select value={language} onChange={onLanguageChange}>
    {languages.map((lang, index) => (
      <option key={lang.code} value={lang.code}>
        {lang.name
          .replace(/(?!\w|\s)./g, "")
          .replace(/\s+/g, " ")
          .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, "$2")}
      </option>
    ))}

    <style jsx>{`
      select {
        -webkit-appearance: none;
        appearence: none;
        background: none;
        outline: none;
        border: none;
        padding: 0;
        margin: 0;
        font-size: 12px;
        color: rgba(0, 0, 0, 1);
      }
    `}
    </style>
  </select>
);

export default LanguageToggle;
