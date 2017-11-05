const Store = require("electron-store");

const store = new Store();

const initSettings = () => {
  if (!store.has("language")) {
    store.set("language", "eng");
  }

  ipcMain.on("getStore", (event, setting) => {
    if (setting === "language") {
      const { mainWindow } = global.windows;
      const language = store.get("language");
      mainWindow.webContents.send("language", language);
    }
  });

  ipcMain.on("setStore", (event, key, value) => {
    store.set(key, value);
  });
};

module.exports = initSettings;
