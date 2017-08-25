import convert from "iso-language-converter";
import languages from "../languages.json";

const Footer = ({ language, onLanguageChange }) =>
  <footer>
    <select value={language} onChange={onLanguageChange}>
      {languages.map((lang, index) => {
        return (
          <option key={index} value={lang.code}>
            {lang.name}
          </option>
        );
      })}
    </select>

    <style jsx>{`
      footer {
        background: #fff;
        height: 40px;
        font-size: 12px;
        box-shadow: 0px -0.5px 0px #cacbcc;
        padding: 13px 12px;
      }

      select {
      }

      option {
      }
    `}</style>
  </footer>;

export default Footer;
