// Packages
const { app } = require("electron");
const prepareNext = require("electron-next");

// Windows
const { createMainWindow } = require("./windows/main");

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");
  createMainWindow();
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
