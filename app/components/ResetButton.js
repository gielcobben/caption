import "./ResetButton.scss";
import React from "react";

const resetIcon = (
  <svg
    x="0px"
    y="0px"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    data-radium="true"
  >
    <circle cx="7" cy="7" r="7" fill="gray" />
    <path
      fill="#FFF"
      d="M8 7l2-2-1-1-2 2-2-2-1 1 2 2-2 2 1 1 2-2 2 2 1-1-2-2z"
    />
  </svg>
);

const ResetButton = ({ resetList }) => {
  return <span className="reset-button" onClick={resetList}>{resetIcon}</span>;
};

export default ResetButton;
