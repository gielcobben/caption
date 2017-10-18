const Logo = () => (
  <div>
    <img src="/static/icon.png" draggable="false" />

    <style jsx>{`
      div {
        background: #fff;
      }

      img {
        display: block;
        margin: 0 auto;
        width: 80px;
        height: 80px;
      }
    `}</style>
  </div>
);

export default Logo;
