const path = require("path");
const { dialog } = require("electron");
const notification = require("./notification");
const Caption = require("caption-core");

const multipleDownload = async files => {
  try {
    for (let i = 0; i < files.length; i++) {
      const { file, subtitle } = files[i];
      const downloadLocation = path.dirname(file.path);
      const originalFileName = file.name;
      const subtitleFilename = originalFileName.replace(/\.[^/.]+$/, "");

      Caption.download(
        {
          downloadUrl: subtitle.url,
        },
        "opensubtitles",
        `${downloadLocation}/${subtitleFilename}.srt`,
      )
        .then(() => {
          notification(`${originalFileName} is successfully downloaded!`);
        })
        .catch(err => console.log("error", err));
    }
  } catch (error) {
    console.log(error);
  }
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
