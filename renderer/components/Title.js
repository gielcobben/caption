const Title = ({ title }) =>
  <h1>
    {title}

    <style jsx>{`
      h1 {
        width: 100%;
        text-align: center;
        padding: 11px 0;
        font-size: 14px;
        font-weight: 400;
      }
    `}</style>
  </h1>;

export default Title;
