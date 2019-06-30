// const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

// var features = ['accessibilityHelp', 'bracketMatching', 'caretOperations', 'clipboard', 'codeAction', 'codelens', 'colorDetector', 'comment', 'contextmenu', 'coreCommands', 'cursorUndo', 'dnd', 'find', 'folding', 'fontZoom', 'format', 'goToDefinitionCommands', 'goToDefinitionMouse', 'gotoError', 'gotoLine', 'hover', 'inPlaceReplace', 'inspectTokens', 'iPadShowKeyboard', 'linesOperations', 'links', 'multicursor', 'parameterHints', 'quickCommand', 'quickOutline', 'referenceSearch', 'rename', 'smartSelect', 'snippets', 'suggest', 'toggleHighContrast', 'toggleTabFocusMode', 'transpose', 'wordHighlighter', 'wordOperations', 'wordPartOperations']

// features = features.map(item => `!${item}`)

// console.log(1111, features)

// console.log(features)
const productName = '布丁笔记'

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/style/element-variables.scss";`
      }
    }
  },
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      externals: [],
      mainProcessFile: 'src/background.js',
      mainProcessWatch: ['src/main'],
      builderOptions: {
        productName: productName,
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
