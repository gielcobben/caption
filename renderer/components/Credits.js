// Packages
import { shell } from "electron";

// Components
import software from "../data/software";
import SoftwareItem from "../components/SoftwareItem";

const Credits = () => (
  <section>
    <h2>Special thanks to:</h2>
    <ul>
      <li onClick={() => shell.openExternal("https://twitter.com/rygu")}>
        Rick Wong
      </li>
      <li onClick={() => shell.openExternal("https://twitter.com/gelissenhuub")}>
        Huub Gelissen
      </li>
      <li onClick={() => shell.openExternal("https://www.opensubtitles.org/")}>
        Opensubtitles
      </li>
      <li onClick={() => shell.openExternal("http://www.addic7ed.com/")}>
        Addic7ed
      </li>
    </ul>

    <h2>3rd party software</h2>
    <ul>
      {software.map((pkg, index) => {
        return <SoftwareItem key={index} pkg={pkg} />;
      })}
    </ul>

    <style jsx>{`
      section {
        height: calc(100vh - 212px);
        overflow-y: scroll;
        font-size: 11.5px;
        padding: 13px;
      }

      h2 {
        text-transform: uppercase;
        margin-bottom: 12px;
        letter-spacing: 1px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.8);
      }

      ul {
        margin-bottom: 24px;
        color: rgba(0, 0, 0, 0.5);
      }

      ul:last-child {
        margin-bottom: 0;
      }

      li {
        margin: 8px 0;
      }

      li:hover {
        color: rgba(0, 0, 0, 1);
      }
    `}</style>
  </section>
);

export default Credits;
