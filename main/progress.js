// Native
const { format } = require("url");

// Packages
const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const { resolve } = require("app-root-path");

let progressWindow;

const createProgressWindow = () => {
  progressWindow = new BrowserWindow({
    width: 400,
    height: 130,
    title: "Updating Caption",
    center: true,
    show: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    fullscreenable: false,
    backgroundColor: "#ECECEC"
  });

  const devPath = "http://localhost:8000/progress";

  const prodPath = format({
    pathname: resolve("renderer/out/progress/index.html"),
    protocol: "file:",
    slashes: true
  });

  const url = isDev ? devPath : prodPath;
  progressWindow.loadURL(url);

  return progressWindow;
};

const showProgressWindow = () => {
  progressWindow.show();
  progressWindow.focus();
};

module.exports = { createProgressWindow, showProgressWindow };
