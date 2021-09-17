module.exports = {
  css: { extract: false },
  lintOnSave: false,
  configureWebpack: {
    output: {
      libraryExport: "default",
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => ({
        ...options,
        compilerOptions: {
          // treat any tag that starts with ion- as custom elements
          isCustomElement: (tag) =>
            tag.startsWith("copyable-") ||
            tag.startsWith("mwc-") ||
            tag.startsWith("sl-"),
        },
      }));
  },
};
