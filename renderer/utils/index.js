import fs from "fs";

const processFiles = rawFiles => {
  const files = [];

  rawFiles.map(file => {
    const extention = file.name.substr(file.name.lastIndexOf(".") + 1);

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

export { processFiles, fileSizeReadable };
