const fs = require("fs");
const path = require("path");
const { BrowserWindow, webContents } = require("electron");
const { download } = require("electron-dl");
const { mainWindow } = require("./main");

const rename = subtitles => {
  const mainWindow = BrowserWindow.getFocusedWindow();

  subtitles.map(subtitle => {
    fs.rename(subtitle.savePath, subtitle.filename, () => {
      console.log("done");
    });
  });

  mainWindow.webContents.send("download-complete", subtitles);
};

const multipleDownload = async files => {
  // const mainWindow = BrowserWindow.getFocusedWindow();

  console.log(mainWindow);

  // const items = [];

  // try {
  //   for (let i = 0; i < files.length; i++) {
  //     const { file, subtitle } = files[i];
  //     const downloadLocation = path.dirname(file.path);
  //     const originalFileName = file.name;
  //     const subtitleFilename = originalFileName.replace(/\.[^/.]+$/, "");

  //     const options = {
  //       saveAs: false,
  //       directory: downloadLocation
  //     };

  //     const dl = await download(mainWindow, subtitle.url, options);

  //     const downloadedItem = {
  //       savePath: dl.getSavePath(),
  //       filename: `${downloadLocation}/${subtitleFilename}.srt`
  //     };

  //     items.push(downloadedItem);
  //   }
  // } catch (error) {
  //   console.log(error);
  // }

  // rename(items);
};

const singleDownload = async item => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  const options = {
    saveAs: true
  };
  const dl = await download(mainWindow, item.download, options);
};

module.exports = { multipleDownload, singleDownload };
