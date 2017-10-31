const fs = require("fs");
const path = require("path");
const { BrowserWindow, webContents } = require("electron");
const { download } = require("electron-dl");
const { getMainWindow } = require("./main");

const MAINWINDOW = getMainWindow();

const rename = subtitles => {
  subtitles.map(subtitle => {
    fs.rename(subtitle.savePath, subtitle.filename, () => {
      console.log("done");
    });
  });

  MAINWINDOW.webContents.send("download-complete", subtitles);
};

const multipleDownload = async files => {
  const items = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const { file, subtitle } = files[i];
      const downloadLocation = path.dirname(file.path);
      const originalFileName = file.name;
      const subtitleFilename = originalFileName.replace(/\.[^/.]+$/, "");

      const options = {
        saveAs: false,
        directory: downloadLocation
      };

      const dl = await download(MAINWINDOW, subtitle.url, options);

      const downloadedItem = {
        savePath: dl.getSavePath(),
        filename: `${downloadLocation}/${subtitleFilename}.srt`
      };

      items.push(downloadedItem);
    }
  } catch (error) {
    console.log(error);
  }

  rename(items);
};

const singleDownload = async item => {
  const options = {
    saveAs: true
  };
  const dl = await download(MAINWINDOW, item.download, options);
};

module.exports = { multipleDownload, singleDownload };
