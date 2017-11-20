// File size readable
const fileSizeReadable = size => {
  if (size >= 1000000000) {
    return `${Math.ceil(size / 1000000000)}GB`;
  } else if (size >= 1000000) {
    return `${Math.ceil(size / 1000000)}MB`;
  } else if (size >= 1000) {
    return `${Math.ceil(size / 1000)}kB`;
  }
  return `${Math.ceil(size)}B`;
};

// Export
export { fileSizeReadable };
