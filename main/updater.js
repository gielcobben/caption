const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const { getMainWindow } = require("./main");

const sendStatusToWindow = text => {
  const mainWindow = getMainWindow();
  mainWindow.webContents.send("messageFromMain", text);
};

autoUpdater.allowPrerelease = true;

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});

autoUpdater.on("update-available", info => {
  sendStatusToWindow("Update available.");
});

autoUpdater.on("update-not-available", info => {
  sendStatusToWindow("Update not available.");
});

autoUpdater.on("error", (event, error) => {
  sendStatusToWindow("Error in auto-updater.");
  dialog.showErrorBox(
    "Error: ",
    error == null ? "unknown" : (error.stack || error).toString()
  );
});

autoUpdater.on("download-progress", progressObj => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  sendStatusToWindow(log_message);
});

autoUpdater.on("update-downloaded", info => {
  sendStatusToWindow("Update downloaded; will install in 5 seconds");
  autoUpdater.quitAndInstall();
});

const checkForUpdates = () => {
  autoUpdater.checkForUpdates();
};

module.exports = { checkForUpdates };
