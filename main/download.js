const fs = require("fs");
const path = require("path");
const { download } = require("electron-dl");
const { dialog } = require("electron");
const notification = require("./notification");
const Caption = require("caption-core");

const rename = subtitles => {
  const { mainWindow } = global.windows;

  subtitles.map(subtitle =>
    fs.rename(subtitle.savePath, subtitle.filename, () => console.log("done")));

  if (subtitles.length > 0) {
    notification(`${subtitles.length} subtitles downloaded successfully!`);
  }

  mainWindow.webContents.send("download-complete", subtitles);
};

const multipleDownload = async files => {
  const { mainWindow } = global.windows;
  const items = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const { file, subtitle } = files[i];
      const downloadLocation = path.dirname(file.path);
      const originalFileName = file.name;
      const subtitleFilename = originalFileName.replace(/\.[^/.]+$/, "");

      const options = {
        saveAs: false,
        directory: downloadLocation,
      };

      const dl = await download(mainWindow, subtitle.url, options);

      const downloadedItem = {
        savePath: dl.getSavePath(),
        filename: `${downloadLocation}/${subtitleFilename}.srt`,
      };

      items.push(downloadedItem);
    }
  } catch (error) {
    console.log(error);
  }

  rename(items);
};

const singleDownload = async item => {
  const hasExtension = item.name.includes(".srt");
  const filename = hasExtension ? item.name : `${item.name}.srt`;
  const { mainWindow } = global.windows;
  const saveToPath = await new Promise(resolve => {
    dialog.showSaveDialog(
      mainWindow,
      {
        title: "Download",
        defaultPath: filename,
      },
      resolve,
    );
  });

  if (!saveToPath) {
    return;
  }

  try {
    Caption.download(item, item.source, saveToPath)
      .then(() => {
        notification(`${item.name} is successfully downloaded!`);
        mainWindow.webContents.send("singleDownloadSuccesfull", item);
      })
      .catch(err => console.log("error", err));
  } catch (err) {
    console.log("err", err);
  }
};

module.exports = { multipleDownload, singleDownload };
