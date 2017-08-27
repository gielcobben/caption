// Packages
const path = require("path");
const { app, ipcMain } = require("electron");
const prepareNext = require("electron-next");
const { download } = require("electron-dl");

// Windows
const { createMainWindow } = require("./windows/main");

async function downloadSubtitles(event, args, mainWindow) {
  args.files.map(async function({ dialog, subtitle, file }) {
    if (dialog) {
      const options = {
        saveAs: true,
        openFolderWhenDone: true,
      };
      const dl = await download(mainWindow, subtitle.url, options);
    } else {
      // Download file and put in dropped file folder
      const downloadLocation = path.dirname(file.path);
      const filename = file.name.replace(/\.[^/.]+$/, "");

      console.log('filename', filename);

      const options = {
        saveAs: false,
        directory: downloadLocation,
        filename: `${filename}.srt`,
      };

      const dl = await download(mainWindow, subtitle.url, options);
      console.log(dl.getSavePath());
    }
  });
}

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");
  const mainWindow = createMainWindow();

  ipcMain.on("download-subtitle", (e, args) =>
    downloadSubtitles(e, args, mainWindow),
  );
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
