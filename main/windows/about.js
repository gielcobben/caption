// Native
const { format } = require("url");

// Packages
const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const { resolve } = require("app-root-path");

const createAboutWindow = () => {
  const aboutWindow = new BrowserWindow({
    width: 260,
    height: 340,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    vibrancy: "sidebar",
    titleBarStyle: "hidden-inset",
    show: false,
    center: true,
    autoHideMenuBar: true,
    acceptFirstMouse: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true
    }
  });

  const devPath = "http://localhost:8000/about";

  const prodPath = format({
    pathname: resolve("renderer/out/about/index.html"),
    protocol: "file:",
    slashes: true
  });

  const url = isDev ? devPath : prodPath;
  aboutWindow.loadURL(url);

  aboutWindow.webContents.on("did-finish-load", () => {
    aboutWindow.show();
    aboutWindow.focus();
  });

  return aboutWindow;
};

module.exports = { createAboutWindow };
