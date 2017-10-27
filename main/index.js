const prepareNext = require("electron-next");
const { app, BrowserWindow, ipcMain } = require("electron");
const Store = require("electron-store");
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

const showAboutWindow = () => {
  aboutWindow.show();
  aboutWindow.focus();
};

const onCloseAboutWindow = event => {
  if (willQuitApp) {
    aboutWindow = null;
  } else {
    event.preventDefault();
    aboutWindow.hide();
  }
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

  BrowserWindow.addDevToolsExtension(
    "/Users/gielcobben/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/2.5.2_0"
  );

  initSettings();

  ipcMain.on("downloadSubtitle", (event, item) => {
    console.log(item);

    if (item.source === "addic7ed") {
      download(item);
    } else {
      singleDownload(item);
    }
  });

  ipcMain.on("textSearch", async (event, query, language) => {
    const results = await textSearch(query, language, "all");
    mainWindow.webContents.send("results", results);
  });

  ipcMain.on("fileSearch", async (event, files, language) => {
    const results = await fileSearch(files, language, "best");
  });
});

// Quit the app once all windows are closed
app.on("before-quit", () => (willQuitApp = true));
app.on("window-all-closed", app.quit);
