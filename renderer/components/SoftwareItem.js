const arrowRight = (
  <svg
    width="6"
    height="6"
    viewBox="0 0 5 6"
    xmlns="http://www.w3.org/2000/svg"
    fill="#808080"
  >
    <path d="M0 0l5 3-5 3" fill-rule="evenodd" />
  </svg>
);

const arrowDown = (
  <svg
    width="6"
    height="6"
    viewBox="0 0 6 5"
    xmlns="http://www.w3.org/2000/svg"
    fill="#808080"
  >
    <path d="M6 0L3 5 0 0" fill-rule="evenodd" />
  </svg>
);

class SoftwareItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  render() {
    const { pkg } = this.props;
    const { open } = this.state;

    return (
      <li>
        {open && arrowDown}
        {!open && arrowRight}
        <span
          onClick={() => {
            this.setState({ open: !open });
          }}
        >
          {pkg.name}
        </span>

        {open &&
          <p>
            {pkg.description}
          </p>}

        <style jsx>{`
          span {
            margin-left: 8px;
          }

          p {
            margin: 8px 0;
            line-height: 1.4;
            font-size: 12px;
            color: rgba(0, 0, 0, .8);
            user-select: text;
            cursor: default;
          }

          li {
            margin: 8px 0;
          }

          li:hover span {
            color: #000;
          }
        `}</style>
      </li>
    );
  }
}

export default SoftwareItem;
