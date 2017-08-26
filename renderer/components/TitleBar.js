import Title from "./Title";

const TitleBar = () =>
  <header>
    <Title title="Caption" />

    <style jsx>{`
      header {
        background: #fff;
        height: 38px;
        -webkit-app-region: drag;
      }
    `}</style>
  </header>;

export default TitleBar;
