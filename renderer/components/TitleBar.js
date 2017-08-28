import Title from "./Title";

const TitleBar = ({ title }) =>
  <header>
    <Title title={title} />

    <style jsx>{`
      header {
        background: #fff;
        height: 38px;
        -webkit-app-region: drag;
      }
    `}</style>
  </header>;

export default TitleBar;
