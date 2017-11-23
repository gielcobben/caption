const { dialog, shell } = require("electron");

const getDownloadCount = () =>
  parseInt(global.store.get("download-count", 0), 10);

const increaseDownloadCounter = () => {
  const currentCount = getDownloadCount();
  global.store.set("download-count", currentCount + 1);
};

const preventFuturePopups = () =>
  global.store.set("prevent-donate-popups", true);

const allowFuturePopups = () =>
  global.store.set("prevent-donate-popups", false);

const shouldHidePopups = () => global.store.get("prevent-donate-popups", false);

const showDonatePopup = () => {
  if (shouldHidePopups()) {
    return;
  }

  const callback = (clickedButtonIndex, hideFuturePopups = false) => {
    const { mainWindow } = global.windows;

    if (clickedButtonIndex === 0) {
      shell.openExternal("https://www.paypal.me/gielcobben");
      mainWindow.webContents.send("logDonated");
    }

    if (hideFuturePopups) {
      preventFuturePopups();
    }
  };
  
  dialog.showMessageBox(
    {
      buttons: ["Donate", "Later"],
      defaultId: 0,
      title: "Thank you for using Caption!",
      message:
        "Thanks for using Caption! Caption is and will always be free. If you enjoy using it, please consider a donation to the authors.",
      checkboxLabel: "Don't show this again",
    },
    callback,
  );
};

const triggerDonateWindow = () => {
  increaseDownloadCounter();
  const currentDownloadCount = getDownloadCount();

  if (currentDownloadCount >= 9 && currentDownloadCount % 3 === 0) {
    showDonatePopup();
  }
};

module.exports = { triggerDonateWindow, allowFuturePopups };
