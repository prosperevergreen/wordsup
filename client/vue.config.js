const path = require("path");

module.exports = {
  transpileDependencies: ["vuetify"],
  outputDir: path.resolve(__dirname, "../server/public"),
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:5000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  // chainWebpack: (config) => {
  //   config.module
  //     .rule("vue")
  //     .use("vue-loader")
  //     .loader("vue-loader")
  //     .tap((options) => {
  //       // modify the options...
  //       return options;
  //     });
  // },
};
