// Packages
import fs from "fs";
import movieExtentsion from "../data/extenstions";

// Process files
const processFiles = rawFiles => {
  const files = [];

  rawFiles.map(file => {
    const extention = file.name.substr(file.name.lastIndexOf(".") + 1);

    if (movieExtentsion.indexOf(extention) < 0) {
      return;
    }

    const fileObject = {
      extention,
      size: file.size,
      name: file.name,
      path: file.path,
      status: "loading"
    };

    files.push(fileObject);
  });

  return files;
};

// File size readable
const fileSizeReadable = size => {
  if (size >= 1000000000) {
    return Math.ceil(size / 1000000000) + "GB";
  } else if (size >= 1000000) {
    return Math.ceil(size / 1000000) + "MB";
  } else if (size >= 1000) {
    return Math.ceil(size / 1000) + "kB";
  } else {
    return Math.ceil(size) + "B";
  }
};

// Export
export { processFiles, fileSizeReadable };
