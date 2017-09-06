// Packages
import { ipcRenderer } from "electron";
import OS from "opensubtitles-api";
import { head } from "lodash";

const OpenSubtitles = new OS("OSTestUserAgentTemp");

// Functions
const searchQuery = async (query, language, limit) => {
  const options = {
    sublanguageid: language,
    limit: limit,
    query: query,
  };

  const results = await OpenSubtitles.search(options);
  const firstItem = head(Object.keys(results));
  const subtitles = results[firstItem];

  return subtitles;
};

const searchFiles = async (files, language, limit) => {
  const subtitleReferences = files.map(async file => {
    console.log('file', file);

    const info = await OpenSubtitles.hash({
      path: file.path,
      extend: true,
    });

    const options = {
      sublanguageid: language,
      limit: limit,
      hash: info.moviehash,
      filesize: info.moviebytesize,
      path: file.path,
      filename: file.filename,
    };

    if (info && info.metadata && info.metadata.imdbid) {
      options["imdbid"] = info.metadata.imdbid;
    }

    const result = await OpenSubtitles.search(options);
    const firstItem = head(Object.keys(result));
    const subtitle = result[firstItem];

    return {
      file,
      subtitle,
    };
  });

  const downloadedReferences = await Promise.all(subtitleReferences);
  const subtitleResults = downloadedReferences.filter(
    ({ subtitle }) => subtitle !== undefined,
  );

  downloadSubtitles(subtitleResults);
};

const downloadSubtitles = files => {
  ipcRenderer.send("download-subtitle", { files });
};

// Exports
export { searchQuery, searchFiles, downloadSubtitles };
