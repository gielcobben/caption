const { flatMap } = require("lodash");
const Promise = require("bluebird");
const addic7ed = require("./addic7ed");
const opensubtitles = require("./opensubtitles");
const { multipleDownload } = require("../download");

const textSearch = async (files, language, limit) => {
  const mainWindow = global.windows.mainWindow;
  const addic7edRef = addic7ed.textSearch(files, language, limit);
  const opensubtitlesRef = opensubtitles.textSearch(files, language, limit);

  // Wait for first source to finish downloading, return first set of results to renderer.
  Promise.any([opensubtitlesRef, addic7edRef]).then(results => {
    const subtitles = {
      results,
      isFinished: false,
    };

    mainWindow.webContents.send("results", subtitles);
  });

  // Check whether all sources have been checked. Return to renderer and hide loading spinner.
  Promise.all([opensubtitlesRef, addic7edRef]).then(results => {
    const emptyResultSet = results.filter(result => result.length > 0);

    if (emptyResultSet.length === 0) {
      const subtitles = {
        results: [],
        isFinished: true,
      };

      return mainWindow.webContents.send("results", subtitles);
    }

    const subtitles = {
      results: flatMap(results),
      isFinished: true,
    };

    return mainWindow.webContents.send("results", subtitles);
  });
};

const fileSearch = async (files, language, limit) => {
  const opensubtitlesRef = opensubtitles.fileSearch(files, language, limit);
  const result = await Promise.race([opensubtitlesRef]);
  multipleDownload(result);
};

module.exports = { textSearch, fileSearch };
