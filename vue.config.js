const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 配置跨域请求
  devServer: {
    port: 8080, //项目运行的端口号
    host: "127.0.0.1",
    open: true,
    https: false,
    proxy: {
      "/api": {
        target: "http://121.37.102.50:3006/", //服务端的接口地址
        ws: true,
        changeOrigin: true, //开启跨域
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
})
