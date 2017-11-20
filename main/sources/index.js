const { multiDownload } = require("../download");
const Caption = require("caption-core");

const textSearch = async (...args) => {
  const { mainWindow } = global.windows;

  Caption.searchByQuery(...args)
    .on("fastest", results => {
      const subtitles = {
        results,
        isFinished: false,
      };

      mainWindow.webContents.send("results", subtitles);
    })
    .on("completed", results => {
      const subtitles = {
        results,
        isFinished: true,
      };

      mainWindow.webContents.send("results", subtitles);
    });
};

const fileSearch = async (...args) => {
  Caption.searchByFiles(...args).on("completed", results =>
    multiDownload(results));
};

module.exports = { textSearch, fileSearch };
