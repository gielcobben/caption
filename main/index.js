const prepareNext = require("electron-next");
const { app, ipcMain, dialog } = require("electron");
const Store = require("electron-store");

const { createMainWindow } = require("./main");
const { createAboutWindow } = require("./about");
const { createProgressWindow } = require("./progress");

const { textSearch, fileSearch } = require("./sources");
const buildMenu = require("./menu");
const { singleDownload } = require("./download");
const { download } = require("./sources/addic7ed");

let aboutWindow;
let mainWindow;
let progressWindow;
let willQuitApp = false;
const store = new Store();

const showAboutWindow = () => {
  aboutWindow.show();
  aboutWindow.focus();
};

const onCloseAboutWindow = event => {
  if (willQuitApp) {
    aboutWindow = null;
    return;
  }

  event.preventDefault();
  aboutWindow.hide();
};

const initSettings = () => {
  // Set default language
  if (!store.has("language")) {
    store.set("language", "eng");
  }

  // Get settings
  ipcMain.on("getStore", (event, setting) => {
    if (setting === "language") {
      const language = store.get("language");
      mainWindow.webContents.send("language", language);
    }
  });

  // Set settings
  ipcMain.on("setStore", (event, key, value) => {
    store.set(key, value);
  });
};

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  // Windows
  mainWindow = createMainWindow();
  aboutWindow = createAboutWindow();
  progressWindow = createProgressWindow();

  // Menu
  const menu = buildMenu(aboutWindow, showAboutWindow);
  aboutWindow.on("close", event => onCloseAboutWindow(event));

  // Setting globals
  global.windows = {
    mainWindow,
    aboutWindow,
    progressWindow,
  };
  global.updater = {
    onStartup: true,
  };

  initSettings();

  ipcMain.on("downloadSubtitle", (event, item) => {
    if (!item) {
      return false;
    }

    if (item.source === "addic7ed") {
      return download(item);
    }

    return singleDownload(item);
  });

  ipcMain.on("textSearch", async (event, query, language) =>
    textSearch(query, language, "all"));

  ipcMain.on("fileSearch", async (event, files, language) => {
    fileSearch(files, language, "best");
  });

  ipcMain.on("online", (event, online) => {
    if (!online) {
      dialog.showErrorBox(
        "Oops, something went wrong",
        "It seems like your computer is offline! Please connect to the internet to use Caption.",
      );
    }
  });
});

// Quit the app once all windows are closed
app.on("before-quit", () => (willQuitApp = true));
app.on("window-all-closed", app.quit);
