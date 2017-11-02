const Logo = ({ size = 80, margin = "0 auto" }) => (
  <div>
    <img src="/static/icon.png" draggable="false" />

    <style jsx>{`
      img {
        display: block;
        margin: ${margin};
        width: ${size}px;
        height: ${size}px;
      }
    `}</style>
  </div>
);

export default Logo;
