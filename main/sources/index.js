const { flatMap } = require("lodash");
const addic7ed = require("./addic7ed");
const opensubtitles = require("./opensubtitles");

const downloadSubtitles = files => {
  // ipcRenderer.send("download-subtitle", false, { files });
};

const textSearch = async (files, language, limit) => {
  const addic7edRef = addic7ed.textSearch(files, language, limit);
  const opensubtitlesRef = opensubtitles.textSearch(files, language, limit);

  const sources = await Promise.all([opensubtitlesRef, addic7edRef]);
  const results = sources.filter(
    source => source !== undefined && source.length > 0
  );
  const subtitles = flatMap(results);

  return subtitles;
};

const fileSearch = async (files, language, limit) => {
  const opensubtitlesRef = opensubtitles.fileSearch(files, language, limit);
  const result = await Promise.race([opensubtitlesRef]);
  downloadSubtitles(result);
};

module.exports = { textSearch, fileSearch };
