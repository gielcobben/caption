const fs = require("fs");
const path = require("path");
const { download } = require("electron-dl");
const notification = require("./notification");

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
  const { mainWindow } = global.windows;
  // const options = {
  //   saveAs: true,
  // };

  console.log("item", item);

  try {
    item
      .download(item, "/Users/vernon/Movies/test.srt")
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
