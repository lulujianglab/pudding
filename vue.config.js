const productName = '布丁笔记'

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/style/element-variables.scss";`
      }
    }
  },
  productionSourceMap: false,
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      externals: ['got'],
      mainProcessFile: 'src/background/background.js',
      mainProcessWatch: ['src/background'],
      builderOptions: {
        productName: productName,
        win: {
          icon: './public/app/pudding.png',
        },
        mac: {
          icon: './public/app/pudding.png',
        },
        linux: {
          icon: './public/app/pudding.png',
        },
        asar: true,
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: productName, // 图标名称
        }
      }
    }
  },
  // configureWebpack: {
  //   plugins: [
  //     new MonacoEditorPlugin({
  //       // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
  //       // Include a subset of languages support
  //       // Some language extensions like typescript are so huge that may impact build performance
  //       // e.g. Build full languages support with webpack 4.0 takes over 80 seconds
  //       // Languages are loaded on demand at runtime
  //       // languages: ['markdown', 'javascript', 'css', 'html'],
  //       features: features,
  //       languages: ['javascript']
  //     })
  //   ]
  // }
}
