module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2
            }
          }
        }
      })
  }
}

// "vue": {
//   "pwa": {
//     "workboxOptions": {
//       "runtimeCaching": [
//         {
//           "handler": "StaleWhileRevalidate",
//           "urlPattern": "/config.js",
//           "method": "GET"
//         }
//       ]
//     }
//   }
// }
