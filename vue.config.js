module.exports = {
  css: { extract: false },
  lintOnSave: false,
  configureWebpack: {
    output: {
      libraryExport: "default",
    },
  },
};
