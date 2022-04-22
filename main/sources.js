const { multiDownload } = require("./download");
const Caption = require("caption-core");

const textSearch = async (...args) => {
  const { mainWindow } = global.windows;

  Caption.searchByQuery(...args)
    .on("fastest", results => {
      const subtitles = {
        results: JSON.parse(JSON.stringify(results)),
        isFinished: false,
      };

      mainWindow.webContents.send("results", subtitles);
    })
    .on("completed", results => {
      const subtitles = {
        results: JSON.parse(JSON.stringify(results)),
        isFinished: true,
      };

      mainWindow.webContents.send("results", subtitles);
    });
};

const markFilesNotFound = files => {
  const { mainWindow } = global.windows;

  files.forEach(file => {
    mainWindow.webContents.send("updateFileSearchStatus", {
      filePath: file.path,
      status: "not_found",
    });
  });
};

const fileSearch = async (files, ...args) => {
  Caption.searchByFiles(files, ...args).on("completed", results => {
    const foundFilePaths = results.map(({ file }) => file.path);
    const notFound = files.filter(({ path }) => !foundFilePaths.includes(path));

    markFilesNotFound(notFound);
    multiDownload(results);
  });
};

module.exports = { textSearch, fileSearch };
