module.exports = {
  webpack(config) {
    config.target = "electron-renderer";
    return config;
  },
  exportPathMap() {
    // Let Next.js know where to find the entry page
    // when it's exporting the static bundle for the use
    // in the production version of your app
    return {
      "/start": { page: "/start" },
      "/about": { page: "/about" }
    };
  }
};
