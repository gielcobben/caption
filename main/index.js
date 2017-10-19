// Packages
const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
// const autoUpdater = require("electron-updater").autoUpdater;
const prepareNext = require("electron-next");
const { download } = require("electron-dl");

const buildMenu = require("./menu");

const { createMainWindow } = require("./windows/main");
const { createAboutWindow } = require("./windows/about");

let aboutWindow;
let mainWindow;
let willQuitApp = false;

const renameSubtitles = subtitles => {
  subtitles.map(subtitle => {
    fs.rename(subtitle.savePath, subtitle.filename, () => {
      console.log("done");
    });
  });

  mainWindow.webContents.send("download-complete", subtitles);
};

const downloadSingleSubtitle = async (item, mainWindow) => {
  const options = {
    saveAs: true
  };
  const dl = await download(mainWindow, item.download, options);
};

const downloadMultipleSubtitles = async (item, mainWindow) => {
  const files = item.files;
  const items = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const { file, subtitle } = files[i];
      const downloadLocation = path.dirname(file.path);
      const originalFileName = file.name;
      const subtitleFilename = originalFileName.replace(/\.[^/.]+$/, "");

      const options = {
        saveAs: false,
        directory: downloadLocation
      };

      const dl = await download(mainWindow, subtitle.url, options);

      const downloadedItem = {
        savePath: dl.getSavePath(),
        filename: `${downloadLocation}/${subtitleFilename}.srt`
      };

      items.push(downloadedItem);
    }
  } catch (error) {
    console.log(error);
  }

  renameSubtitles(items);
};

const downloadSubtitles = (event, dialog, item, mainWindow) => {
  if (dialog) {
    downloadSingleSubtitle(item, mainWindow);
  } else {
    downloadMultipleSubtitles(item, mainWindow);
  }
};

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

  ipcMain.on("download-subtitle", (event, dialog, item) =>
    downloadSubtitles(event, dialog, item, mainWindow)
  );
});

// Quit the app once all windows are closed
app.on("before-quit", () => (willQuitApp = true));
app.on("window-all-closed", app.quit);
