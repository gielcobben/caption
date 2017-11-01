const prepareNext = require("electron-next");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const isDev = require("electron-is-dev");
const Store = require("electron-store");
const { autoUpdater } = require("electron-updater");

const { textSearch, fileSearch } = require("./sources");
const buildMenu = require("./menu");
const { createMainWindow } = require("./main");
const { createAboutWindow } = require("./about");
const { singleDownload } = require("./download");
const { download } = require("./sources/addic7ed");

let aboutWindow;
let mainWindow;
let willQuitApp = false;
const store = new Store();

const sendStatusToWindow = text => {
  mainWindow.webContents.send("messageFromMain", text);
};

autoUpdater.allowPrerelease = true;

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});

autoUpdater.on("update-available", info => {
  sendStatusToWindow("Update available.");
});

autoUpdater.on("update-not-available", info => {
  sendStatusToWindow("Update not available.");
});

autoUpdater.on("error", (event, error) => {
  sendStatusToWindow("Error in auto-updater.");
  dialog.showErrorBox(
    "Error: ",
    error == null ? "unknown" : (error.stack || error).toString()
  );
});

autoUpdater.on("download-progress", progressObj => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  sendStatusToWindow(log_message);
});

autoUpdater.on("update-downloaded", info => {
  sendStatusToWindow("Update downloaded; will install in 5 seconds");
  autoUpdater.quitAndInstall();
});

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
  //   autoUpdater.checkForUpdates();
  // }, 10000);
  autoUpdater.checkForUpdates();
});

// Quit the app once all windows are closed
app.on("before-quit", () => (willQuitApp = true));
app.on("window-all-closed", app.quit);
