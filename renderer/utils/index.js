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

export { processFiles };
