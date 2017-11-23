const fs = require("fs");
const path = require("path");
const { dialog } = require("electron");
const movieExtension = require("./data/extensions");

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

const checkExtension = file => {
  const extension = file.substr(file.lastIndexOf(".") + 1);
  return movieExtension.indexOf(extension) > 0;
};

const readDir = dir =>
  fs
    .readdirSync(dir)
    .filter(file => {
      const isDirectory = fs.statSync(path.join(dir, file)).isDirectory();

      if (isDirectory) {
        return true;
      }

      return checkExtension(file);
    })
    .reduce((files, file) => {
      const isDirectory = fs.statSync(path.join(dir, file)).isDirectory();

      if (isDirectory) {
        return files.concat(readDir(path.join(dir, file)));
      }

      return files.concat(path.join(dir, file));
    }, []);

// @TODO: Filter duplicate files based on combination of path + filename.
const processFiles = droppedItems => {
  const { mainWindow } = global.windows;
  const filePaths = [];

  droppedItems.map(item => {
    if (fs.statSync(item).isDirectory()) {
      filePaths.push(...filePaths.concat(readDir(item)));
    } else if (checkExtension(item)) {
      filePaths.push(item);
    }

    return false;
  });

  const transformedObject = transform(filePaths);
  mainWindow.webContents.send("processedFiles", transformedObject);
};

const triggerDonateWindow = () => {

  const callback = () => {
    console.log("callback fired");
  };
  dialog.showMessageBox(
    {
      buttons: ["Donate", "Later"],
      defaultId: 0,
      title: "Thank you for using Caption!",
      message:
        "Thanks for using Caption! Caption is and will always be free. If you enjoy using it, please consider a donation to the authors.",
      checkboxLabel: "Don't show again for this version",
    },
    callback,
  );
};

module.exports = { processFiles, triggerDonateWindow };
