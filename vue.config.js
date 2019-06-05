const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

var features = ['accessibilityHelp', 'bracketMatching', 'caretOperations', 'clipboard', 'codeAction', 'codelens', 'colorDetector', 'comment', 'contextmenu', 'coreCommands', 'cursorUndo', 'dnd', 'find', 'folding', 'fontZoom', 'format', 'goToDefinitionCommands', 'goToDefinitionMouse', 'gotoError', 'gotoLine', 'hover', 'inPlaceReplace', 'inspectTokens', 'iPadShowKeyboard', 'linesOperations', 'links', 'multicursor', 'parameterHints', 'quickCommand', 'quickOutline', 'referenceSearch', 'rename', 'smartSelect', 'snippets', 'suggest', 'toggleHighContrast', 'toggleTabFocusMode', 'transpose', 'wordHighlighter', 'wordOperations', 'wordPartOperations']

features = features.map(item => `!${item}`)

// console.log(features)

module.exports = {
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/background.js',
      mainProcessWatch: ['src/main']
    }
  },
  configureWebpack: {
    // externals: {
    //   'simple-git/promise': 'simpleGit'
    // },
    plugins: [
      new MonacoEditorPlugin({
        // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        // Include a subset of languages support
        // Some language extensions like typescript are so huge that may impact build performance
        // e.g. Build full languages support with webpack 4.0 takes over 80 seconds
        // Languages are loaded on demand at runtime
        // languages: ['markdown', 'javascript', 'css', 'html'],
        features: features
      })
    ]
  }
}
