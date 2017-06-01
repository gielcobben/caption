module.exports = {
  // remove the following files as they are mostly

  remove: [{ file: "CHANGELOG.md" }, { file: "erb-logo.png" }],
  // clean the following files by either clearing them
  // (by specifying {clear: true}) or by removing lines
  // that match a regex pattern
  clean: [
    {
      file: "app/app.global.css",
      clear: true
    },
    {
      file: "README.md",
      clear: true
    },
    {
      file: "app/components/Home.js",
      pattern: /(h2|Link to)/
    }
  ],
  // add the following files to the project, mostly
  // related to .gitkeep for version control
  add: [{ file: "app/actions/.gitkeep" }]
};
