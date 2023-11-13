const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    webSocketServer: false,
    proxy: {
      "/api": {
        target: process.env.VUE_APP_BACKEND_HOST,
      },
    },
  },
});
