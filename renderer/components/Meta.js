import { remote } from "electron";

import Logo from "./Logo";

const Meta = ({ appVersion }) =>
  <section>
    <Logo />
    <div>
      <h1>Caption</h1>
      Version: <span>{appVersion}</span>
    </div>

    <style jsx>{`
      section {
        background: #fff;
        padding-bottom: 12px;
        box-shadow: 0px 0.5px 0px #cacbcc;
      }

      div {
        width: 100%;
        text-align: center;
        font-size: 11.5px;
        color: rgba(0, 0, 0, .5);
      }

      h1 {
        width: 100%;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        color: #000;
        padding: 8px 0;
      }

      span {
        font-weight: 500;
        color: #000;
      }
    `}
    </style>
  </section>;

export default Meta;
