const path = require("path");
const { dialog } = require("electron");
const notification = require("./notification");
const Caption = require("caption-core");

const multiDownload = files => {
  const resultSet = [];
  const { mainWindow } = global.windows;

  try {
    const downloadFiles = files.map(({ file, subtitle }) =>
      new Promise(resolve => {
        const downloadLocation = path.dirname(file.path);
        const originalFileName = file.name;
        const subtitleFilename = originalFileName.replace(/\.[^/.]+$/, "");

        return Caption.download(
          {
            downloadUrl: subtitle.url,
          },
          "opensubtitles",
          `${downloadLocation}/${subtitleFilename}.srt`,
        ).then(() => {
          resultSet.push(`${downloadLocation}/${subtitleFilename}.srt`);
          mainWindow.webContents.send("updateFileSearchStatus", {
            filePath: file.path,
            status: "done",
          });
          resolve();
        });
      }));

    Promise.all(downloadFiles).then(() => {
      const message =
        resultSet.length > 0
          ? `${resultSet.length} subtitles have been successfully downloaded!`
          : "Could not find any subtitles.";

      notification(message);
      mainWindow.webContents.send("allFilesDownloaded");
    });
  } catch (err) {
    console.log("error", err);
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

module.exports = { multiDownload, singleDownload };
