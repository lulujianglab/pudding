import path from 'path'
import url from 'url'

async function initEditor() {
  return new Promise(async resolve => {
    await sleep(100)
    var protocol = 'file:'
    var baseVS = protocol + '//' + path.join(__static, 'vs')
    console.log('baseVS', baseVS)
    amdRequire.config({ paths: { 'vs': baseVS }})
    amdRequire(['vs/editor/editor.main'], () => {
      const monaco = window.monaco
      initTheme(monaco)
      resolve(monaco)
    })
  })
}

async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

function initTheme(monaco) {
  // https://bitwiser.in/monaco-themes/
  const themeData = {
    "base": "vs",
    "inherit": true,
    "rules": [
      { token: '', foreground: '333333', background: 'ffffff' },
      { token: 'strong', fontStyle: 'bold', foreground: '333333' },
      {
        "background": "e2e9ff",
        "token": "text.html source.active4d"
      },
      {
        "foreground": "000000",
        "token": "text.xml"
      },
      {
        "foreground": "af82d4",
        "token": "comment.line"
      },
      {
        "foreground": "af82d4",
        "token": "comment.block"
      },
      {
        "foreground": "666666",
        "token": "string"
      },
      {
        "foreground": "66ccff",
        "fontStyle": "bold",
        "token": "string.interpolated variable"
      },
      {
        "foreground": "a8017e",
        "token": "constant.numeric"
      },
      {
        "foreground": "66ccff",
        "fontStyle": "bold",
        "token": "constant.other.date"
      },
      {
        "foreground": "66ccff",
        "fontStyle": "bold",
        "token": "constant.other.time"
      },
      {
        "foreground": "a535ae",
        "token": "constant.language"
      },
      {
        "foreground": "6392ff",
        "fontStyle": "bold",
        "token": "variable.other.local"
      },
      {
        // inline code
        "foreground": "333333",
        "fontStyle": "bold",
        "token": "variable"
      },
      {
        "foreground": "6988ae",
        "token": "variable.other.table-field"
      },
      {
        // 列表前面 + 标题
        "foreground": "333333",
        "fontStyle": "bold",
        "token": "keyword"
      },
      {
        "foreground": "ff5600",
        "token": "storage"
      },
      {
        "foreground": "21439c",
        "token": "entity.name.type"
      },
      {
        "foreground": "21439c",
        "token": "entity.name.function"
      },
      {
        "foreground": "7a7a7a",
        "token": "meta.tag"
      },
      {
        "foreground": "016cff",
        "token": "entity.name.tag"
      },
      {
        "foreground": "963dff",
        "token": "entity.other.attribute-name"
      },
      {
        "foreground": "45ae34",
        "fontStyle": "bold",
        "token": "support.function"
      },
      {
        "foreground": "b7734c",
        "token": "support.constant"
      },
      {
        "foreground": "a535ae",
        "token": "support.type"
      },
      {
        "foreground": "a535ae",
        "token": "support.class"
      },
      {
        "foreground": "a535ae",
        "token": "support.variable"
      },
      {
        "foreground": "ffffff",
        "background": "990000",
        "token": "invalid"
      },
      {
        "foreground": "ffffff",
        "background": "656565",
        "token": "meta.diff"
      },
      {
        "foreground": "ffffff",
        "background": "1b63ff",
        "token": "meta.diff.range"
      },
      {
        "foreground": "000000",
        "background": "ff7880",
        "token": "markup.deleted.diff"
      },
      {
        "foreground": "000000",
        "background": "98ff9a",
        "token": "markup.inserted.diff"
      },
      {
        "foreground": "5e5e5e",
        "token": "source.diff"
      }
    ],
    "colors": {
      "editor.foreground": "#3B3B3B",
      "editor.background": "#ffffff",
      "editor.selectionBackground": "#BAD6FD",
      "editor.lineHighlightBackground": "#000000",
      "editorCursor.foreground": "#000000",
      "editorWhitespace.foreground": "#BFBFBF"
    }
  }

  monaco.editor.defineTheme('pudding', themeData)
}

export {
  sleep,
  initEditor
}
