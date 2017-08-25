import LanguageToggle from "./languageToggle";
import Info from "./info";

const Footer = ({ results, language, onLanguageChange }) =>
  <footer>
    <LanguageToggle language={language} onLanguageChange={onLanguageChange} />
    <Info results={results} />

    <style jsx>{`
      footer {
        background: #fff;
        height: 40px;
        font-size: 12px;
        box-shadow: 0px -0.5px 0px #cacbcc;
        padding: 13px 12px;
        display: flex;
        color: rgba(0, 0, 0, .4);
      }
    `}</style>
  </footer>;

export default Footer;
