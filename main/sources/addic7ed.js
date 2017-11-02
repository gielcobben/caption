const addic7ed = require("addic7ed-api");
const { dialog } = require("electron");

const transform = (query, items) => {
  const results = [];

  items.map(item => {
    const result = {
      name: `${query}.${item.distribution}.${item.team}`,
      download: item,
      extention: "",
      source: "addic7ed",
      size: "",
      score: 0
    };

    results.push(result);
  });

  return results;
};

const textSearch = async (query, language, limit) => {
  const splitQuery = query.match(/s([0-9]{1,2})\s*e([0-9]{1,2})/i);

  if (!splitQuery) {
    console.log(`Addic7ed: Can't parse ${query}...`);
    return [];
  }

  const subtitles = [];
  const serie = query.replace(splitQuery[0], "");
  const season = parseInt(splitQuery[1], 10);
  const episode = parseInt(splitQuery[2], 10);
  const items = await addic7ed.search(serie, season, episode, language);

  if (!items) {
    console.log("Addic7ed: Nothing found...");
    return [];
  }

  return transform(query, items);
};

const fileSearch = async (files, language, limit) => {};

const download = async item => {
  const mainWindow = global.windows.mainWindow;
  const path = await new Promise(resolve => {
    dialog.showSaveDialog(
      mainWindow,
      {
        title: "Download",
        defaultPath: `${item.name}.srt`
      },
      resolve
    );
  });

  if (!path) {
    return;
  }

  await addic7ed.download(item.download, path);
};

module.exports = { textSearch, download };
