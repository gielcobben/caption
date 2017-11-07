const { dialog, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");
const { showCheckWindow, closeCheckWindow } = require("./windows/check");
const { showProgressWindow } = require("./windows/progress");

// Functions
const cancelUpdater = () => {
  const { progressWindow } = global.windows;
  const { cancellationToken } = global.updater;

  cancellationToken.cancel();
  progressWindow.hide();
};

const checkForUpdates = async () => {
  const checking = await autoUpdater.checkForUpdates();
  const { cancellationToken } = checking;

  global.updater = {
    cancellationToken,
    onStartup: false,
  };
};

// IPC Events
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
  const { onStartup } = global.updater;
  if (!onStartup) {
    showCheckWindow();
  }
});

autoUpdater.on("update-available", info => {
  console.log("available  ", info);
  const { cancellationToken } = global.updater;
  closeCheckWindow();
  showProgressWindow();
  autoUpdater.downloadUpdate(cancellationToken);
});

autoUpdater.on("update-not-available", info => {
  console.log(`Update not available`, info);
  const { onStartup } = global.updater;
  closeCheckWindow();

  if (!onStartup) {
    const options = {
      type: "info",
      message: "Caption is up to date",
      detail: "It looks like you're already rocking the latest version!",
    };

    dialog.showMessageBox(null, options);
  }
});

autoUpdater.on("error", (event, error) => {
  console.log(error);
  closeCheckWindow();
});

autoUpdater.on("download-progress", progressObj => {
  const { progressWindow } = global.windows;
  progressWindow.webContents.send("progress", progressObj);
});

autoUpdater.on("update-downloaded", info => {
  console.log(`Update downloaded; will install in 5 seconds.`, info);
});

module.exports = { checkForUpdates };
