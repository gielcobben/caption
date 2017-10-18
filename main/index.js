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

const downloadSubtitles = async (event, args, mainWindow) => {
  const files = args.files;

  try {
    return await Promise.all(
      files.map(async ({ file, subtitle }) => {
        const downloadLocation = path.dirname(file.path);
        const originalFileName = file.name;
        const subtitleFilename = originalFileName.replace(/\.[^/.]+$/, "");

        const options = {
          saveAs: false,
          directory: downloadLocation
        };

        try {
          const item = await download(mainWindow, subtitle.url, options);
          return item;
        } catch (error) {
          console.log(error);
        }
      })
    );
  } catch (error) {
    console.log(error);
  }

  // await Promise.all(files.map())

  // args.files.map(async ({ dialog, subtitle, file }) => {
  //   if (dialog) {
  //     const options = {
  //       saveAs: true,
  //       openFolderWhenDone: true
  //     };
  //     const dl = await download(mainWindow, subtitle.url, options);
  //   } else {
  //     // Download file and put in dropped file folder
  //     const downloadLocation = path.dirname(file.path);
  //     const originalFileName = file.name;
  //     const filename = originalFileName.replace(/\.[^/.]+$/, ""); // remove extension

  //     const options = {
  //       saveAs: false,
  //       directory: downloadLocation
  //     };

  //     const dl = await download(mainWindow, subtitle.url, options);
  //     dl.setSavePath(downloadLocation);

  //     await fs.rename(
  //       `${downloadLocation}/${subtitle.filename}`,
  //       `${downloadLocation}/${filename}.srt`,
  //       error => {
  //         if (error) console.log(error);
  //       }
  //     );
  //   }
  // });
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

  ipcMain.on("download-subtitle", (e, args) =>
    downloadSubtitles(e, args, mainWindow)
  );
});

// Quit the app once all windows are closed
app.on("before-quit", () => (willQuitApp = true));
app.on("window-all-closed", app.quit);
