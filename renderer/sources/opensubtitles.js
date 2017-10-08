// Packages
import { ipcRenderer } from "electron";
import OS from "opensubtitles-api";
import { head } from "lodash";

const OpenSubtitles = new OS("OSTestUserAgentTemp");

const transform = items => {
  const results = [];

  items.map(item => {
    const result = {
      name: item.filename,
      download: item.url,
      extention: "",
      source: "opensubtitles",
      size: "",
      score: item.score
    };

    results.push(result);
  });

  return results;
};

const textSearch = async (query, language, limit) => {
  const options = {
    sublanguageid: language,
    limit: limit,
    query: query
  };

  const items = await OpenSubtitles.search(options);
  const firstItem = head(Object.keys(items)); // firstItem is selected language: obj[language]
  const results = items[firstItem];
  const subtitles = transform(results);

  return subtitles;
};

const fileSearch = async (files, language, limit) => {
  const subtitleReferences = files.map(async file => {
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
    const firstItem = head(Object.keys(result));
    const subtitle = result[firstItem];

    return {
      file,
      subtitle
    };
  });

  const downloadedReferences = await Promise.all(subtitleReferences);
  const subtitleResults = downloadedReferences.filter(
    ({ subtitle }) => subtitle !== undefined
  );

  return subtitleResults;
};

// Exports
export { textSearch, fileSearch };
