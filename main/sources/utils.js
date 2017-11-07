const addic7ed = require("addic7ed-api");
const { dialog } = require("electron");

const downloadAddic7ed = async item => {
  const { mainWindow } = global.windows;
  const path = await new Promise(resolve => {
    dialog.showSaveDialog(
      mainWindow,
      {
        title: "Download",
        defaultPath: `${item.name}.srt`,
      },
      resolve,
    );
  });

  if (!path) {
    return;
  }

  await addic7ed.download(item.download, path);
};

module.exports = {
  downloadAddic7ed,
};
