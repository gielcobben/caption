import Layout from "../components/Layout";
import TitleBar from "../components/TitleBar";
import Meta from "../components/Meta";
import Credits from "../components/Credits";
import FooterAbout from "../components/FooterAbout";

const About = () => (
  <Layout>
    <TitleBar title="About" />
    <Meta />
    <Credits />
    <FooterAbout />
  </Layout>
);

export default About;
