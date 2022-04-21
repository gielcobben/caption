const path = require("path");
const { dialog } = require("electron");
const notification = require("./notification");
const Caption = require("caption-core");
const { triggerDonateWindow } = require("./donate");

const multiDownload = files => {
  const resultSet = [];
  const { mainWindow } = global.windows;

  try {
    const downloadFiles = files.map(item =>
      new Promise(resolve => {
        const downloadLocation = path.dirname(item.file.path);
        const originalFileName = item.file.name;
        const subtitleFilename = originalFileName.replace(/\.[^/.]+$/, "");

        return Caption.download(
          item,
          item.source,
          `${downloadLocation}/${subtitleFilename}.srt`,
        ).then(() => {
          resultSet.push(`${downloadLocation}/${subtitleFilename}.srt`);
          mainWindow.webContents.send("updateFileSearchStatus", {
            filePath: item.file.path,
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

      triggerDonateWindow();
    });
  } catch (err) {
    console.log("error", err);
  }
};

const singleDownload = async item => {
  const hasExtension = item.name.includes(".srt");
  const filename = hasExtension ? item.name : `${item.name}.srt`;
  const { mainWindow } = global.windows;
  const saveDialogResult = await dialog.showSaveDialog(
    mainWindow,
    {
      title: "Download",
      defaultPath: filename,
    },
  );

  if (!saveDialogResult || saveDialogResult.canceled) {
    return;
  }

  try {
    Caption.download(item, item.source, saveDialogResult.filePath)
      .then(() => {
        notification(`${item.name} is successfully downloaded!`);
        mainWindow.webContents.send("singleDownloadSuccesfull", item);

        triggerDonateWindow();
      })
      .catch(err => console.log("error", err));
  } catch (err) {
    console.log("err", err);
  }
};

module.exports = { multiDownload, singleDownload };
