// Packages
const path = require("path");
const { app, ipcMain } = require("electron");
// const autoUpdater = require("electron-updater").autoUpdater;
const prepareNext = require("electron-next");
const { download } = require("electron-dl");

const buildMenu = require("./menu");

const { createMainWindow } = require("./windows/main");
const { createAboutWindow } = require("./windows/about");

let aboutWindow;
let mainWindow;
let willQuitApp = false;

async function downloadSubtitles(event, args, mainWindow) {
  args.files.map(function({ dialog, subtitle, file, originalFileName }) {
    if (dialog) {
      const options = {
        saveAs: true,
        openFolderWhenDone: true
      };
      const dl = download(mainWindow, subtitle.url, options);
    } else {
      // Download file and put in dropped file folder
      const downloadLocation = path.dirname(file.path);
      const filename = file.name;
      const originalFileName = file.name;

      console.log("filename", filename);

      const options = {
        saveAs: false,
        directory: downloadLocation
      };

      download(mainWindow, subtitle.url, options).then(downloadItem => {
        downloadItem.setSavePath(
          downloadLocation + "/" + originalFileName + ".srt"
        );
        console.log("downloadItem", downloadItem.getSavePath());
        // console.log("dl", dl);
        // console.log(dl.getSavePath());
      });
    }
  });
}

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

  ipcMain.on("download-subtitle", (e, args) =>
    downloadSubtitles(e, args, mainWindow)
  );
});

// Quit the app once all windows are closed
app.on("before-quit", () => (willQuitApp = true));
app.on("window-all-closed", app.quit);
