// Packages
import addic7ed from "addic7ed-api";

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
    console.log("no subtitles found");
    return;
  }

  const subtitles = [];
  const serie = query.replace(splitQuery[0], "");
  const season = parseInt(splitQuery[1], 10);
  const episode = parseInt(splitQuery[2], 10);
  const items = await addic7ed.search(serie, season, episode, language);
  const results = transform(query, items);

  return results;
};

const fileSearch = async (files, language, limit) => {};

// Exports
export { textSearch };
