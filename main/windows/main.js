const { format } = require("url");
const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const { resolve } = require("app-root-path");
const windowStateKeeper = require("electron-window-state");

const touchBar = require('./../touchbar');

const createMainWindow = () => {
  const windowState = windowStateKeeper({
    defaultWidth: 360,
    defaultHeight: 440,
  });

  const mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    title: "Caption",
    minWidth: 300,
    minHeight: 300,
    vibrancy: "sidebar",
    titleBarStyle: "hidden-inset",
    show: false,
    center: true,
    autoHideMenuBar: true,
    acceptFirstMouse: true,
    webPreferences: {
      backgroundThrottling: false,
      webSecurity: true,
    },
  });

  windowState.manage(mainWindow);

  const devPath = "http://localhost:8000/start";
  const prodPath = format({
    pathname: resolve("renderer/out/start/index.html"),
    protocol: "file:",
    slashes: true,
  });
  const url = isDev ? devPath : prodPath;
  mainWindow.loadURL(url);

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Add Touchbar support for MacOS
  if (process.platform === "darwin") {
    mainWindow.setTouchBar(touchBar);
  }

  return mainWindow;
};

module.exports = { createMainWindow };
