import Layout from "../components/Layout";
import Logo from "../components/Logo";

const Check = () => (
  <Layout>
    <section>
      <Logo size={62} margin={0} />
      <div>
        <h2>Checking for updates...</h2>
        <progress value="100" max="100" />
      </div>

      <style jsx>
        {`
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
        `}
      </style>
    </section>
  </Layout>
);

export default Check;
