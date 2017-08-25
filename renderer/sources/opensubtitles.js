// Packages
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

// Exports
export { searchQuery };
