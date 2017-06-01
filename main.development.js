import os from "os";
import path from "path";
import {
  app,
  autoUpdater,
  BrowserWindow,
  Menu,
  shell,
  ipcMain,
  dialog,
  Tray
} from "electron";
import { moveToApplications } from "electron-lets-move";
import pkg from "./package.json";
import Storage from "electron-json-storage";
import windowStateKeeper from "electron-window-state";

/*
* Basics
*/
let menu;
let mainWindow = null;
let settingsWindow = null;
let nothingFoundWindowValue;

if (process.env.NODE_ENV === "development") {
  require("electron-debug")();
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/*
* autoUpdater
*/
let firstRun = true;
const platform = os.platform() + "_" + os.arch(); // darwin_x64
const updateURL = `https://download.getcaption.co/update/${platform}/${pkg.version}`;

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for updates...");
});

autoUpdater.on("update-not-available", () => {
  if (!firstRun) {
    const options = {
      type: "info",
      buttons: ["OK"],
      title: "Caption",
      message: `Caption is up to date`,
      detail: `It looks like you're already rocking the latest version!`
    };
    dialog.showMessageBox(options);
  }
  firstRun = false;
  console.log(`You've got the latest version.`);
});

autoUpdater.on(
  "update-downloaded",
  (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
    const options = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Caption",
      message: `The new version has been downloaded. Please restart the application to apply the updates.`,
      detail: releaseName + "\n\n" + releaseNotes
    };
    const index = dialog.showMessageBox(options);

    if (index === 1) {
      return;
    }

    quitAndUpdate();
    firstRun = false;
  }
);

autoUpdater.on("error", error => {
  console.log(error);
  firstRun = false;
});

autoUpdater.on("update-available", () => {
  console.log("update available");
  firstRun = false;

  // setInterval(() => {
  //     console.log(autoUpdater.status);
  // }, 5000);
});

try {
  autoUpdater.setFeedURL(updateURL);
  autoUpdater.checkForUpdates();
} catch (error) {
  console.log(error);
}

/*
* Extentions
*/
const installExtensions = async () => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-line global-require
    const installer = require("electron-devtools-installer");

    const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) {} // eslint-disable-line
    }
  }
};

/*
* Create Main Window
*/
const createMainWindow = () => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 360,
    defaultHeight: 440
  });

  let transparent = true;
  let backgroundColor = "none";
  const osVersion = os.release().split(".").join("");

  if (osVersion < 1400) {
    transparent = false;
    backgroundColor = "#474748";
  }

  // Create the windows
  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    show: false,
    minWidth: 300,
    minHeight: 300,
    vibrancy: "dark",
    transparent: transparent,
    titleBarStyle: "hidden-inset",
    backgroundColor: backgroundColor,
    webPreferences: {
      scrollBounce: true
    }
  });

  console.log("ELECTRON VERSION: " + process.versions.electron);

  // Manage window state
  mainWindowState.manage(mainWindow);

  // Set URL
  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

  // Events
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    app.quit();
  });
};

app.on("ready", async () => {
  if (process.env.NODE_ENV !== "development") {
    /*
        * Let's Move
        */

    Storage.has("moveApp", async (error, value) => {
      if (!value) {
        try {
          const moved = await moveToApplications();
          if (!moved) {
            Storage.set("moveApp", false);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        Storage.get("moveApp", async (error, value) => {
          if (value) {
            try {
              const moved = await moveToApplications();
            } catch (error) {
              console.log(error);
            }
          } else {
            console.log("user choosed to not move the app!");
          }
        });
      }
    });

    // Set default property for nothing-found-window
    Storage.has("noting-found-window", (error, hasKey) => {
      if (error) throw error;
      if (!hasKey) {
        Storage.set("noting-found-window", true, error => {
          if (error) throw error;
          nothingFoundWindowValue = true;
        });
      }
    });
  }

  app.setAboutPanelOptions({
    applicationName: "Caption",
    applicationVersion: pkg.version,
    copyright: "Made with 💖 by Giel Cobben. \n www.gielcobben.com",
    credits: `With the invaluable help of: \n OpenSubtitles.org and Addic7ed.com`,
    version: pkg.version
  });

  await installExtensions();

  /*
    * MainWindow
    */
  createMainWindow();

  /*
    * IPC's
    */
  ipcMain.on("close-main", () => {
    mainWindow.close();
    app.quit();
  });

  ipcMain.on("lang-changed", () => {
    mainWindow.webContents.send("change-language");
  });

  /*
    * Downloads
    */
  mainWindow.webContents.session.on(
    "will-download",
    (event, item, webContents) => {
      item.on("updated", (event, state) => {
        if (state === "interrupted") {
          console.log("Download is interrupted but can be resumed");
        } else if (state === "progressing") {
          if (item.isPaused()) {
            console.log("Download is paused");
          } else {
            console.log(`Received bytes: ${item.getReceivedBytes()}`);
          }
        }
      });

      item.once("done", (event, state) => {
        if (state === "completed") {
          console.log("Download successfully");
        } else {
          console.log(`Download failed: ${state}`);
        }
      });
    }
  );

  /*
    * Development
    */
  if (process.env.NODE_ENV === "development") {
    mainWindow.openDevTools();
    mainWindow.webContents.on("context-menu", (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: "Inspect element",
          click() {
            mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(mainWindow);
    });
  }

  /*
    * Menu
    */
  const template = [
    {
      label: "Caption",
      submenu: [
        {
          label: "About Caption",
          selector: "orderFrontStandardAboutPanel:"
        },
        {
          label: "Check for Updates...",
          click() {
            autoUpdater.checkForUpdates();
          }
        },
        {
          type: "separator"
        },
        {
          label: "Services",
          submenu: []
        },
        {
          type: "separator"
        },
        {
          label: "Hide Caption",
          accelerator: "Command+H",
          selector: "hide:"
        },
        {
          label: "Hide Others",
          accelerator: "Command+Shift+H",
          selector: "hideOtherApplications:"
        },
        {
          label: "Show All",
          selector: "unhideAllApplications:"
        },
        {
          type: "separator"
        },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "Command+Z",
          selector: "undo:"
        },
        {
          label: "Redo",
          accelerator: "Shift+Command+Z",
          selector: "redo:"
        },
        {
          type: "separator"
        },
        {
          label: "Cut",
          accelerator: "Command+X",
          selector: "cut:"
        },
        {
          label: "Copy",
          accelerator: "Command+C",
          selector: "copy:"
        },
        {
          label: "Paste",
          accelerator: "Command+V",
          selector: "paste:"
        },
        {
          label: "Select All",
          accelerator: "Command+A",
          selector: "selectAll:"
        }
      ]
    },
    {
      label: "View",
      submenu: process.env.NODE_ENV === "development"
        ? [
            {
              label: "Reload",
              accelerator: "Command+R",
              click() {
                mainWindow.webContents.reload();
              }
            },
            {
              label: "Toggle Full Screen",
              accelerator: "Ctrl+Command+F",
              click() {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
              }
            },
            {
              label: "Show nothing found window",
              type: "checkbox",
              checked: nothingFoundWindowValue,
              click: () => {
                if (nothingFoundWindowValue) {
                  nothingFoundWindowValue = false;

                  Storage.set("noting-found-window", false, error => {
                    if (error) throw error;
                  });
                } else {
                  nothingFoundWindowValue = true;

                  Storage.set("noting-found-window", true, error => {
                    if (error) throw error;
                  });
                }
                console.log("toggle nothing found window");
              }
            }
          ]
        : [
            {
              label: "Toggle Full Screen",
              accelerator: "Ctrl+Command+F",
              click() {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
              }
            },
            {
              label: "Show nothing found window",
              type: "checkbox",
              checked: nothingFoundWindowValue,
              click: () => {
                if (nothingFoundWindowValue) {
                  nothingFoundWindowValue = false;

                  Storage.set("noting-found-window", false, error => {
                    if (error) throw error;
                  });
                } else {
                  nothingFoundWindowValue = true;

                  Storage.set("noting-found-window", true, error => {
                    if (error) throw error;
                  });
                }
                console.log("toggle nothing found window");
              }
            }
          ]
    },
    {
      label: "Window",
      submenu: [
        {
          label: "Minimize",
          accelerator: "Command+M",
          selector: "performMiniaturize:"
        },
        {
          label: "Close",
          accelerator: "Command+W",
          click() {
            app.quit();
          }
        },
        {
          type: "separator"
        },
        {
          label: "Bring All to Front",
          selector: "arrangeInFront:"
        }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Learn More",
          click() {
            shell.openExternal("https://getcaption.co/");
          }
        },
        {
          label: "Support",
          click() {
            shell.openExternal("https://twitter.com/gielcobben");
          }
        },
        {
          label: "Report Issue",
          click() {
            shell.openExternal("https://github.com/gielcobben/Caption/issues");
          }
        },
        {
          label: "Search Issues",
          click() {
            shell.openExternal("https://github.com/gielcobben/Caption/issues");
          }
        }
      ]
    }
  ];

  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});
