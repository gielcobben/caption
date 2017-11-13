const fs = require("fs");
const path = require("path");
const movieExtentsion = require("./data/extenstions");

const transform = filePaths =>
  filePaths.map(file => ({
    extention: file.substr(file.lastIndexOf(".") + 1),
    size: fs.statSync(file).size,
    name: file.replace(/^.*[\\\/]/, ""),
    path: file,
    status: "loading",
  }));

const readDir = dir =>
  fs
    .readdirSync(dir)
    .filter(file =>
      (fs.statSync(path.join(dir, file)).isDirectory()
        ? true
        : movieExtentsion.indexOf(file.substr(file.lastIndexOf(".") + 1)) > 0))
    .reduce(
      (files, file) =>
        (fs.statSync(path.join(dir, file)).isDirectory()
          ? files.concat(readDir(path.join(dir, file)))
          : files.concat(path.join(dir, file))),
      [],
    );

const processFiles = droppedItems => {
  const { mainWindow } = global.windows;
  const filePaths = [];

  droppedItems.map(item => {
    if (fs.statSync(item).isDirectory()) {
      filePaths.push(...filePaths.concat(readDir(item)));
    } else {
      filePaths.push(item);
    }
  });

  // console.log(transform(filePaths));

  mainWindow.webContents.send("processedFiles", transform(filePaths));
};

module.exports = processFiles;
