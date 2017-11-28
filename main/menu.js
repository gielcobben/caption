const { app, shell, Menu } = require("electron");
const isDev = require("electron-is-dev");
const { checkForUpdates } = require("./updater");
const { showAboutWindow } = require("./windows/about");
const { allowFuturePopups: allowDonationPopups } = require("./donate");
const { platform } = require("os");

const isWindows = platform() === "win32";

const buildMenu = () => {
  const template = [
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteandmatchstyle" },
        { role: "delete" },
        { role: "selectall" },
      ],
    },
    {
      label: "View",
      submenu: isDev
        ? [
          { role: "reload" },
          { role: "forcereload" },
          { role: "toggledevtools" },
          { type: "separator" },
          {
            label: "Allow donation popups",
            click: () => allowDonationPopups(),
          },
          { type: "separator" },
        ]
        : [{ role: "togglefullscreen" }],
    },
    {
      role: "window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
    {
      role: "help",
      submenu: [
        isWindows
          ? { label: "Check for updates...", click: () => checkForUpdates() }
          : null,
        {
          label: "Donate",
          click: () => {
            const { mainWindow } = global.windows;
            shell.openExternal("https://www.paypal.me/gielcobben");
            mainWindow.webContents.send("logDonated");
          },
        },
        {
          label: "Learn More",
          click: () => shell.openExternal("https://getcaption.co/"),
        },
        {
          label: "Support",
          click: () => shell.openExternal("https://twitter.com/gielcobben"),
        },
        {
          label: "Report Issue",
          click: () =>
            shell.openExternal("https://github.com/gielcobben/caption/issues/new"),
        },
        {
          label: "Search Issues",
          click: () =>
            shell.openExternal("https://github.com/gielcobben/Caption/issues"),
        },
      ],
    },
  ];

  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          label: `About ${app.getName()}`,
          click: () => showAboutWindow(),
        },
        { label: "Check for updates...", click: () => checkForUpdates() },
        { type: "separator" },
        { role: "services", submenu: [] },
        { type: "separator" },
        { role: "hide" },
        { role: "hideothers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    });

    // Edit menu
    template[1].submenu.push(
      { type: "separator" },
      {
        label: "Speech",
        submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }],
      },
    );

    // Window menu
    template[3].submenu = [
      { role: "close" },
      { role: "minimize" },
      { type: "separator" },
      { role: "front" },
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

module.exports = buildMenu;
