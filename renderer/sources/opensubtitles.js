// Packages
import { ipcRenderer } from "electron";
import OS from "opensubtitles-api";
const OpenSubtitles = new OS("OSTestUserAgentTemp");

// Functions
const searchQuery = async (query, language, limit) => {
  const options = {
    sublanguageid: language,
    limit: limit,
    query: query
  };

  const results = await OpenSubtitles.search(options);
  const subtitles = results.en;

  return subtitles;
};

const searchFiles = async (files, language, limit) => {
  files.map(async file => {
    const info = await OpenSubtitles.identify({
      path: file.path,
      extend: true
    });

    const options = {
      sublanguageid: language,
      limit: limit,
      hash: info.moviehash,
      filesize: info.moviebytesize,
      path: file.path,
      filename: file.filename
    };

    if (info && info.metadata && info.metadata.imdbid) {
      options["imdbid"] = info.metadata.imdbid;
    }

    const result = await OpenSubtitles.search(options);
    const firstItem = Object.keys(result)[0];
    const subtitle = result[firstItem];

    downloadSubtitle(file, subtitle, false);
  });
};

const downloadSubtitle = (file, subtitle, dialog) => {
  ipcRenderer.send("download-subtitle", { file, subtitle, dialog });
};

// Exports
export { searchQuery, searchFiles, downloadSubtitle };
