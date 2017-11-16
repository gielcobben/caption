const fs = require("fs");
const path = require("path");
const movieExtension = require("./data/extenstions");

const transform = filePaths =>
  filePaths.map(file => {
    const extension = file.substr(file.lastIndexOf(".") + 1);
    const { size } = fs.statSync(file);
    const name = file.replace(/^.*[\\\/]/, "");

    return {
      extension,
      size,
      name,
      path: file,
      status: "loading",
    };
  });

const readDir = dir =>
  fs
    .readdirSync(dir)
    .filter(file => {
      const isDirectory = fs.statSync(path.join(dir, file)).isDirectory();
      const extension = file.substr(file.lastIndexOf(".") + 1);

      if (isDirectory) {
        return true;
      }

      return movieExtension.indexOf(extension) > 0;
    })
    .reduce((files, file) => {
      const isDirectory = fs.statSync(path.join(dir, file)).isDirectory();

      if (isDirectory) {
        return files.concat(readDir(path.join(dir, file)));
      }

      return files.concat(path.join(dir, file));
    }, []);

const processFiles = droppedItems => {
  const { mainWindow } = global.windows;
  const filePaths = [];

  droppedItems.forEach(item => {
    if (fs.statSync(item).isDirectory()) {
      filePaths.push(...filePaths.concat(readDir(item)));
    } else {
      filePaths.push(item);
    }
  });

  const transformedObject = transform(filePaths);

  console.log(transformedObject);

  mainWindow.webContents.send("processedFiles", transformedObject);
};

module.exports = processFiles;
