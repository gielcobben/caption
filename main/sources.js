const { multiDownload } = require("./download");
const Caption = require("caption-core");

const textSearch = async (...args) => new Promise(resolve => {
  const { mainWindow } = global.windows;

  Caption.searchByQuery(...args)
    .on("fastest", results => {
      const subtitles = {
        results: JSON.parse(JSON.stringify(results)),
        isFinished: false,
      };

      mainWindow.webContents.send("results", subtitles);
      resolve(subtitles);
    })
    .on("completed", results => {
      const subtitles = {
        results: JSON.parse(JSON.stringify(results)),
        isFinished: true,
      };

      mainWindow.webContents.send("results", subtitles);
      resolve(subtitles);
    });
});

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
  Caption.searchByFiles(files, ...args).on("completed", async results => {
    if (results.length) {
      const foundFilePaths = results.map(({ file }) => file.path);
      const notFound = files.filter(({ path }) => !foundFilePaths.includes(path));

      markFilesNotFound(notFound);
      multiDownload(results);
    } else {
      const queryResults = (
        await Promise.all(files.map(file =>
          textSearch(file.name)
            .then(subtitles => ({ file, subtitle: subtitles.results[0] }))))
      ).filter(result => !!result.subtitle);

      if (queryResults.length) {
        multiDownload(queryResults);
      }
    }

  });
};

module.exports = { textSearch, fileSearch };
