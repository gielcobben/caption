const prepareNext = require("electron-next");
const { app, ipcMain } = require("electron");
const Store = require("electron-store");

const { textSearch, fileSearch } = require("./sources");
const buildMenu = require("./menu");
const { createMainWindow } = require("./main");
const { createAboutWindow } = require("./about");
const { singleDownload } = require("./download");
const { download } = require("./sources/addic7ed");
const { checkForUpdates } = require("./updater");

let aboutWindow;
let mainWindow;
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
  mainWindow = createMainWindow();
  aboutWindow = createAboutWindow();
  const menu = buildMenu(aboutWindow, showAboutWindow);
  aboutWindow.on("close", event => onCloseAboutWindow(event));

  initSettings();

  ipcMain.on("downloadSubtitle", (event, item) => {
    if (item.source === "addic7ed") {
      return download(item);
    }

    return singleDownload(item);
  });

  ipcMain.on("textSearch", async (event, query, language) =>
    textSearch(query, language, "all")
  );

  ipcMain.on("fileSearch", async (event, files, language) => {
    fileSearch(files, language, "best");
  });

  // setTimeout(() => {
  //   checkForUpdates();
  // }, 10000);
  checkForUpdates();
});

// Quit the app once all windows are closed
app.on("before-quit", () => (willQuitApp = true));
app.on("window-all-closed", app.quit);
