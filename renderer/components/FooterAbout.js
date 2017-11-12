import { shell } from "electron";

const FooterAbout = () => (
  <footer>
    <span onClick={() => shell.openExternal("https://twitter.com/gielcobben")}>
      Made with 💝 by Giel Cobben
    </span>
    <style jsx>{`
      footer {
        background: rgba(255, 255, 255, 0.5);
        width: 100%;
        height: 40px;
        font-size: 11.5px;
        box-shadow: 0px -0.5px 0px #cacbcc;
        padding: 15px 12px;
        color: rgba(0, 0, 0, 0.8);
        text-align: center;
      }
    `}
    </style>
  </footer>
);

export default FooterAbout;
