const path = require("path");
const Store = require("electron-store");
const prepareNext = require("electron-next");
const { app, ipcMain, dialog } = require("electron");
const { moveToApplications } = require("electron-lets-move");

const buildMenu = require("./menu");
const initSettings = require("./settings");
const notification = require("./notification");
const { processFiles } = require("./utils");
const { checkForUpdates } = require("./updater");
const { singleDownload, singleDownloadToTemp } = require("./download");
const { textSearch, fileSearch } = require("./sources");

// Windows
const { createMainWindow } = require("./windows/main");
const { createAboutWindow, closeAboutWindow } = require("./windows/about");
const { createCheckWindow, closeCheckWindow } = require("./windows/check");
const {
  createProgressWindow,
  closeProgressWindow,
} = require("./windows/progress");

const store = new Store();

// Window variables
let willQuitApp = false;

// Functions
const downloadSubtitle = item => {
  if (!item) {
    return false;
  }

  return singleDownload(item);
};

const showErrorDialog = online => {
  if (!online) {
    dialog.showErrorBox(
      "Oops, something went wrong",
      "It seems like your computer is offline! Please connect to the internet to use Caption.",
    );
  }
};

// App Events
app.on("before-quit", () => {
  global.windows.checkWindow = null;
  willQuitApp = true;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  const { mainWindow } = global.windows;

  if (mainWindow === null) {
    global.windows.mainWindow = createMainWindow();
  }
});

app.on("ready", async () => {
  await prepareNext("./renderer");

  if (!store.get("moved")) {
    await moveToApplications();
    store.set("moved", true);
  }

  global.store = store;

  global.updater = {
    onStartup: true,
  };

  // Windows
  global.windows = {
    mainWindow: createMainWindow(),
    aboutWindow: createAboutWindow(),
    checkWindow: createCheckWindow(),
    progressWindow: createProgressWindow(),
  };

  const {
    mainWindow,
    aboutWindow,
    checkWindow,
    progressWindow,
  } = global.windows;

  mainWindow.on("close", () => {
    global.windows = null;
    app.exit();
    app.quit();
  });
  aboutWindow.on("close", event => closeAboutWindow(event, willQuitApp));
  checkWindow.on("close", event => closeCheckWindow(event, willQuitApp));
  progressWindow.on("close", event => closeProgressWindow(event, willQuitApp));

  // Setup
  buildMenu();
  initSettings();
  checkForUpdates();

  // IPC events
  ipcMain.on("textSearch", (event, query, language) => {
    textSearch(query, language, "all");
  });

  ipcMain.on("fileSearch", (event, files, language) => {
    fileSearch(files, language, "best");
  });

  ipcMain.on("downloadSubtitle", (event, item) => {
    downloadSubtitle(item);
  });

  ipcMain.on("online", (event, online) => {
    showErrorDialog(online);
  });

  ipcMain.on("notification", (event, message) => {
    notification(message);
  });

  ipcMain.on("processFiles", (event, droppedItems) => {
    processFiles(droppedItems);
  });

  ipcMain.on("startDrag",  async (event, item) => {
    event.sender.startDrag({
      file: await singleDownloadToTemp(item),
      icon: path.join(__dirname, "../renderer/static/icon.iconset/icon_32x32.png"),
    });
  });
});
