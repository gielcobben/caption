// Packages
import Dropzone from "react-dropzone";

// Styling
const styleDefault = {
  border: "1px dashed rgba(202, 203, 204, 1)",
  borderRadius: "5px",
  width: "100%",
  height: "100%",
  transition: "all .2s ease-out",
};

const styleActive = {
  border: "1px dashed #0095ff",
};

// Component
const Drop = ({ onDrop }) => (
  <div>
    <Dropzone
      style={styleDefault}
      activeStyle={styleActive}
      onDrop={onDrop}
      preventDropOnDocument
    >
      <p>Drop an episode or season...</p>
    </Dropzone>

    <style jsx>
      {`
        div {
          position: relative;
          height: 100%;
          padding: 13px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.6);
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

export default Drop;
