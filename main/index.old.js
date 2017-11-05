const prepareNext = require("electron-next");
const { app, ipcMain, dialog } = require("electron");
const Store = require("electron-store");
const { createMainWindow } = require("./main");

const {
  createAboutWindow,
  showAboutWindow,
  closeAboutWindow,
} = require("./about");
const { createProgressWindow, closeProgressWindow } = require("./progress");

const { textSearch, fileSearch } = require("./sources");
const { singleDownload } = require("./download");
const { download } = require("./sources/addic7ed");
const buildMenu = require("./menu");

let aboutWindow;
let mainWindow;
let progressWindow;
let willQuitApp = false;
const store = new Store();

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

  aboutWindow.on("close", event => {
    closeAboutWindow(event, willQuitApp);
    console.log("quit? ", willQuitApp);
  });
  progressWindow.on("close", event => closeProgressWindow(event, willQuitApp));

  // Menu
  buildMenu(aboutWindow, showAboutWindow);

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
app.on("before-quit", () => {
  willQuitApp = true;
  mainWindow = null;
  aboutWindow = null;
  progressWindow = null;
});

app.on("window-all-closed", () => {
  console.log("closing...");
  app.quit();
});
