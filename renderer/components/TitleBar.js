import Title from "./Title";

const TitleBar = ({ title }) => (
  <header>
    <Title title={title} />

    <style jsx>{`
      header {
        background: #fff;
        height: 38px;
        -webkit-app-region: drag;
        border-radius: 6px 6px 0 0;
      }
    `}</style>
  </header>
);

export default TitleBar;
