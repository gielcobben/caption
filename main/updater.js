const { BrowserWindow, dialog, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const { showProgressWindow } = require("./progress");

const sendStatusToWindow = text => {
  const mainWindow = global.windows.mainWindow;
  mainWindow.webContents.send("messageFromMain", text);
};

ipcMain.on("cancelUpdate", event => {
  cancelUpdater();
});

autoUpdater.allowPrerelease = true;

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});

autoUpdater.on("update-available", info => {
  sendStatusToWindow(info);
  showProgressWindow();
});

autoUpdater.on("update-not-available", info => {
  sendStatusToWindow(`Update not available. ${info}`);

  if (!global.startup) {
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
  // sendStatusToWindow("Error in auto-updater.");
  // dialog.showErrorBox(
  //   "Error: ",
  //   error == null ? "unknown" : (error.stack || error).toString()
  // );
});

autoUpdater.on("download-progress", progressObj => {
  const progressWindow = global.windows.progressWindow;
  progressWindow.webContents.send("progress", progressObj);

  // let log_message = "Download speed: " + progressObj.bytesPerSecond;
  // log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  // log_message =
  //   log_message +
  //   " (" +
  //   progressObj.transferred +
  //   "/" +
  //   progressObj.total +
  //   ")";
  // sendStatusToWindow(log_message);
});

autoUpdater.on("update-downloaded", info => {
  sendStatusToWindow(`Update downloaded; will install in 5 seconds. ${info}`);
  autoUpdater.quitAndInstall();
});

const cancelUpdater = () => {
  const progressWindow = global.windows.progressWindow;

  global.updater.cancellationToken.cancel();
  progressWindow.hide();
};

const checkForUpdates = async () => {
  const checking = await autoUpdater.checkForUpdates();
  global.updater = {
    cancellationToken: checking.cancellationToken
  };
  global.startup = false;
};

module.exports = { checkForUpdates };
