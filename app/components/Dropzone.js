import "./Dropzone.scss";
import React, { Component } from "react";

const Dropzone = ({
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
  dragging
}) => {
  let text;

  if (dragging) {
    text = "Drop files…";
  } else {
    text = "Drop an episode or season…";
  }

  return (
    <section
      className="dropzone"
      className={`dropzone ${dragging ? "dragging" : ""}`}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
    >
      <div className="zone">
        <h2>{text}</h2>
      </div>
    </section>
  );
};

export default Dropzone;
