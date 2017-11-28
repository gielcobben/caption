class Drop extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dragging: false };
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }

  onDragEnter() {
    this.setState({
      dragging: true,
    });
  }

  onDragLeave() {
    if (this.state.dragging) {
      this.setState({
        dragging: false,
      });
    }
  }

  onDragOver() {
    if (!this.state.dragging) {
      this.setState({
        dragging: true,
      });
    }
  }

  render() {
    const { dragging } = this.state;

    return (
      <div
        className="drop"
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
      >
        <div className={`zone ${dragging ? "dragging" : ""}`}>
          <p>Drop an episode or season.</p>
        </div>

        <style jsx>
          {`
            .drop {
              position: relative;
              height: 100%;
              padding: 13px;
              font-size: 13px;
              color: rgba(0, 0, 0, 0.6);
            }

            .zone {
              border: 1px dashed rgba(202, 203, 204, 1);
              border-radius: 5px;
              width: 100%;
              height: 100%;
              transition: all 0.2s ease-out;
            }

            .zone.dragging {
              border: 1px dashed #0095ff;
            }

            p {
              position: absolute;
              top: 50%;
              left: 0;
              width: 100%;
              text-align: center;
            }
          `}
        </style>
      </div>
    );
  }
}

export default Drop;
