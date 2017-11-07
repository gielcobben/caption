import { ipcRenderer } from "electron";
import { fileSizeReadable } from "../utils";
import Layout from "../components/Layout";
import Logo from "../components/Logo";

class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      transferred: 0,
      percent: 0,
    };
  }

  componentDidMount() {
    ipcRenderer.on("progress", (event, { transferred, total, percent }) => {
      this.setState({
        percent,
        total,
        transferred,
      });
    });
  }

  render() {
    const { total, transferred, percent } = this.state;

    return (
      <Layout>
        <section>
          <Logo size={62} margin={0} />
          <div>
            {percent !== 100 && <h2>Downloading update...</h2>}
            {percent === 100 && <h2>Ready to Install</h2>}
            <progress value={percent} max="100" />
            {percent !== 100 && (
              <footer>
                <span>
                  {fileSizeReadable(transferred)} of {fileSizeReadable(total)}
                </span>
                <button onClick={() => ipcRenderer.send("cancelUpdate")}>
                  Cancel
                </button>
              </footer>
            )}
            {percent === 100 && (
              <footer>
                <button onClick={() => ipcRenderer.send("installUpdate")}>
                  Install and Relaunch
                </button>
              </footer>
            )}
          </div>
        </section>

        <style jsx>{`
          section {
            padding: 16px 25px 10px;
            display: flex;
            font-size: 13px;
          }

          div {
            padding: 5px 0 5px 16px;
            width: 100%;
          }

          h2 {
            font-size: 14px;
            font-weight: 700;
            letter-spacing: -0.3px;
          }

          progress {
            width: 100%;
            margin: 9px 0;
          }

          footer {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          span {
            font-weight: 500;
          }

          button {
            font-size: 13px;
          }
        `}
        </style>
      </Layout>
    );
  }
}

export default Progress;
