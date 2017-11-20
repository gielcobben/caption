const { format } = require("url");
const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const { resolve } = require("app-root-path");

const createProgressWindow = () => {
  const progressWindow = new BrowserWindow({
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
    backgroundColor: "#ECECEC",
    webPreferences: {
      backgroundThrottling: false,
      webSecurity: false,
    },
  });

  const devPath = "http://localhost:8000/progress";

  const prodPath = format({
    pathname: resolve("renderer/out/progress/index.html"),
    protocol: "file:",
    slashes: true,
  });

  const url = isDev ? devPath : prodPath;
  progressWindow.loadURL(url);

  return progressWindow;
};

const showProgressWindow = () => {
  const { progressWindow } = global.windows;
  progressWindow.show();
  progressWindow.focus();
};

const closeProgressWindow = (event, willQuitApp) => {
  const { progressWindow } = global.windows;

  if (willQuitApp) {
    global.windows.progressWindow = null;
    return;
  }

  event.preventDefault();
  progressWindow.hide();
};

module.exports = {
  createProgressWindow,
  showProgressWindow,
  closeProgressWindow,
};
