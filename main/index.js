// Packages
const path = require("path");
const { app, ipcMain } = require("electron");
const prepareNext = require("electron-next");
const { download } = require("electron-dl");

// Windows
const { createMainWindow } = require("./windows/main");

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");
  const mainWindow = createMainWindow();

  ipcMain.on("download-subtitle", async (event, args) => {
    if (args.dialog) {
      const options = {
        saveAs: true,
        openFolderWhenDone: true
      };
      const dl = await download(mainWindow, args.subtitle.url, options);
    } else {
      // Download file and put in dropped file folder
      const downloadLocation = path.dirname(args.file.path);
      const filename = args.file.name.replace(/\.[^/.]+$/, "");
      const options = {
        saveAs: false,
        directory: downloadLocation,
        filename: `${filename}.srt`
      };
      const dl = await download(mainWindow, args.subtitle.url, options);
      console.log(dl.getSavePath());
    }
  });
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
