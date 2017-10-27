const prepareNext = require("electron-next");
const { app, BrowserWindow, ipcMain } = require("electron");
const { textSearch, fileSearch } = require("./sources");
const buildMenu = require("./menu");
const { createMainWindow } = require("./main");
const { createAboutWindow } = require("./about");

let aboutWindow;
let mainWindow;
let willQuitApp = false;

// const downloadSubtitles = (event, dialog, item, mainWindow) => {
//   if (dialog) {
//     downloadSingleSubtitle(item, mainWindow);
//   } else {
//     downloadMultipleSubtitles(item, mainWindow);
//   }
// };

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

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");
  mainWindow = createMainWindow();
  aboutWindow = createAboutWindow();
  const menu = buildMenu(aboutWindow, showAboutWindow);
  aboutWindow.on("close", event => onCloseAboutWindow(event));

  // ipcMain.on("download-subtitle", (event, dialog, item) =>
  //   downloadSubtitles(event, dialog, item, mainWindow)
  // );

  ipcMain.on("textSearch", async (event, query, language) => {
    const results = await textSearch(query, language, "all");
    mainWindow.webContents.send("results", results);
  });

  ipcMain.on("fileSearch", async (event, files, language) => {
    const results = await fileSearch(files, language, "best");
    // mainWindow.webContents.send("results", results);
  });
});

// Quit the app once all windows are closed
app.on("before-quit", () => (willQuitApp = true));
app.on("window-all-closed", app.quit);
