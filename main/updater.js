const { BrowserWindow, dialog, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");
const { showProgressWindow } = require("./progress");

ipcMain.on("cancelUpdate", event => {
  cancelUpdater();
});

ipcMain.on("installUpdate", event => {
  autoUpdater.quitAndInstall();
});

// UPDATER
autoUpdater.allowPrerelease = isDev;
autoUpdater.autoDownload = false;

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
});

autoUpdater.on("update-available", info => {
  console.log(info);
  showProgressWindow();
  const downloader = autoUpdater.downloadUpdate(
    global.updater.cancellationToken
  );
});

autoUpdater.on("update-not-available", info => {
  console.log(`Update not available. ${info}`);

  if (!global.updater.onStartup) {
    const options = {
      type: "info",
      message: "Caption is up to date",
      detail: "It looks like you're already rocking the latest version!"
    };

    dialog.showMessageBox(null, options);
  }
});

autoUpdater.on("error", (event, error) => {
  console.log(error);
});

autoUpdater.on("download-progress", progressObj => {
  const progressWindow = global.windows.progressWindow;
  progressWindow.webContents.send("progress", progressObj);
});

autoUpdater.on("update-downloaded", info => {
  console.log(`Update downloaded; will install in 5 seconds. ${info}`);
});

const cancelUpdater = () => {
  const progressWindow = global.windows.progressWindow;
  global.updater.cancellationToken.cancel();
  progressWindow.hide();
};

const checkForUpdates = async () => {
  console.log(autoUpdater.autoDownload);
  const checking = await autoUpdater.checkForUpdates();
  const { cancellationToken } = checking;

  global.updater = {
    cancellationToken,
    onStartup: false
  };
};

module.exports = { checkForUpdates };
