const { format } = require("url");
const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const { resolve } = require("app-root-path");

let checkWindow;

const createCheckWindow = () => {
  checkWindow = new BrowserWindow({
    width: 400,
    height: 130,
    title: "Looking for Updates...",
    center: true,
    show: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    fullscreenable: false,
    backgroundColor: "#ECECEC",
  });

  const devPath = "http://localhost:8000/check";

  const prodPath = format({
    pathname: resolve("renderer/out/check/index.html"),
    protocol: "file:",
    slashes: true,
  });

  const url = isDev ? devPath : prodPath;
  checkWindow.loadURL(url);

  return checkWindow;
};

const showCheckWindow = () => {
  checkWindow.show();
  checkWindow.focus();
};

const closeCheckWindow = (event, willQuitApp) => {
  if (willQuitApp) {
    checkWindow = null;
    return;
  }

  event.preventDefault();
  checkWindow.hide();
};

module.exports = {
  createCheckWindow,
  showCheckWindow,
  closeCheckWindow,
};
