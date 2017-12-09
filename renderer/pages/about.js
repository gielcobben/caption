import electron from "electron";
import { Component } from "react";
import isDev from "electron-is-dev";

import Layout from "../components/Layout";
import TitleBar from "../components/TitleBar";
import Meta from "../components/Meta";
import Credits from "../components/Credits";
import FooterAbout from "../components/FooterAbout";

class About extends Component {
  constructor(props) {
    super(props);

    this.state = {
      version: "0.0.0",
    };

    this.remote = electron.remote || false;
  }

  componentWillMount() {
    if (!this.remote) {
      return;
    }

    let version;

    if (isDev) {
      version = this.remote.process.env.npm_package_version;
    } else {
      version = this.remote.app.getVersion();
    }

    this.setState({
      version,
    });
  }

  render() {
    return (
      <Layout>
        <TitleBar title="About" />
        <Meta appVersion={this.state.version} />
        <Credits />
        <FooterAbout />
      </Layout>
    );
  }
}

export default About;
