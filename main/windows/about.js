const { format } = require("url");
const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const { resolve } = require("app-root-path");

let aboutWindow;

const createAboutWindow = () => {
  aboutWindow = new BrowserWindow({
    width: 260,
    height: 340,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    vibrancy: "sidebar",
    title: "About",
    titleBarStyle: "hidden-inset",
    show: false,
    center: true,
    autoHideMenuBar: true,
    acceptFirstMouse: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
    },
  });

  const devPath = "http://localhost:8000/about";
  const prodPath = format({
    pathname: resolve("renderer/out/about/index.html"),
    protocol: "file:",
    slashes: true,
  });
  const url = isDev ? devPath : prodPath;
  aboutWindow.loadURL(url);

  return aboutWindow;
};

const showAboutWindow = () => {
  aboutWindow.show();
  aboutWindow.focus();
};

const closeAboutWindow = (event, willQuitApp) => {
  if (willQuitApp) {
    aboutWindow = null;
    return;
  }

  event.preventDefault();
  aboutWindow.hide();
};

module.exports = { createAboutWindow, showAboutWindow, closeAboutWindow };
