const fs = require("fs");
const path = require("path");
const os = require("os");
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
          // Some revisions of Caption.download() may expect a "downloadUrl" attribute.
          { downloadUrl: item.subtitle.url },
          // Some revisions of Caption.fileSearch() may return an empty source, default to "opensubtitles".
          item.subtitle.source || "opensubtitles",
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
        triggerDonateWindow();
      })
      .catch(err => console.log("error", err));
  } catch (err) {
    console.log("err", err);
  }
};

const singleDownloadToTemp = async (item) => {
  const hasExtension = item.name.includes(".srt");
  const filename = hasExtension ? item.name : `${item.name}.srt`;

  const tempFile = path.join(os.tmpdir(), filename);
  if (!fs.existsSync(tempFile)) {
    // Make sure the temp file exists.
    fs.closeSync(fs.openSync(tempFile, 'w'));
    // Start downloading with caption-core.
    Caption.download(item, item.source, tempFile);
  }
  // Add a barely noticeable timeout here, that seems to fix failure to drop occasionally.
  // More: https://stackoverflow.com/questions/51194816/electron-drag-and-drop-remote-files-on-desktop
  await new Promise(resolve => setTimeout(resolve, 150));

  return tempFile;
};

module.exports = { multiDownload, singleDownload, singleDownloadToTemp };
