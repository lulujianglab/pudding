<template>
  <column class="editor-wrapper">
    <monaco-editor
      @change="edited = true"
      ref="editor"
      :options="options"
      class="editor"
      @keydown="onKeydown"
      @paste.native="handlePaste"
      v-model="post.content"
      language="markdown">
    </monaco-editor>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { clipboard, remote } from 'electron'
import fs from 'fs-extra'
import path from 'path'
import dayjs from 'dayjs'
import MonacoEditor from 'vue-monaco'
const { BrowserWindow } = require('electron').remote

export default {
  components: {
    MonacoEditor
  },
  mounted() {
    var editor = this.$refs.editor.getMonaco() // 获取实例
    window.editor = this.editor = editor
  },
  data() {
    return {
      post: {},
      edited: false,
      options: {
        automaticLayout: true, // 自动 resize
        acceptSuggestionOnCommitCharacter: false,
        acceptSuggestionOnEnter: 'off',
        accessibilitySupport: 'off',
        codeLens: false,
        colorDecorators: false,
        occurrencesHighlight: false,
        quickSuggestions: false,
        contextmenu: false,
        fontSize: 16,
        fontWeight: '400',
        useTabStops: true,
        wordBasedSuggestions: false,
        wordWrap: 'on',
        roundedSelection: false, // 不知道是啥
        scrollBeyondLastLine: false, // 不知道是啥
        fontFamily: 'Menlo, Monaco, Consolas, "Courier New", "PingFang SC", "Microsoft YaHei", monospace',
        lineNumbers: 'off', // 不要行号
        renderLineHighlight: 'none', // 不要当前高亮
        renderWhitespace: 'none', // 显示空白字符
        snippetSuggestions: 'none', // 不要各种提示
        selectionHighlight: false,
        showUnused: false,
        tabCompletion: 'off', // tab 自动补充,
      }
    }
  },
  computed: {
    name() {
      return this.$route.query.name
    },
    windowTitle() {
      var title = ['布丁笔记']
      if (this.edited) {
        title.unshift('已编辑')
      }
      if (this.name) {
        title.unshift(this.name)
      }
      return title.join(' - ')
    }
  },
  watch: {
    windowTitle: {
      handler(val) {
        const win = BrowserWindow.getAllWindows()[0]
        win.setTitle(val)
      }
    }
  },
  async created() {
    this.post = await ipc.send('/posts/detail', this.$route.query.name)
    const win = BrowserWindow.getAllWindows()[0]
    win.setRepresentedFilename(this.post.localPath)
    win.setDocumentEdited(true)
  },
  methods: {
    async savePost() {
      var post = await ipc.send('/posts/edit', this.post)
      this.edited = false
    },
    async onKeydown(ev) {
      if (ev.metaKey || ev.ctrlKey) {
        if (ev.keyCode === 49) {
          this.savePost()
        }
      }
    },

    async handlePaste(e) {
      // 判断是否有图片格式的粘贴文件
      if (e.clipboardData && e.clipboardData.items[0] && e.clipboardData.items[0].type && e.clipboardData.items[0].type.indexOf('image') > -1) { 
        const file = e.clipboardData.files[0]
        const data = e.clipboardData.items[0]

        const parseImg = clipboard.readImage()
        const imgBuffer = parseImg.toPNG()

        const nowDate = new Date().getTime()
        const docPath = remote.app.getPath('documents')
        const imageName = `${nowDate}.png`
        const imagePath = path.join(docPath, 'pudding', 'images', imageName)
        console.log('imagePath',imagePath)
        await fs.writeFile(imagePath, imgBuffer)
        var position = this.editor.getPosition()
        var lines = this.post.content.split('\n')
        var currrentLine = lines[position.lineNumber - 1]
        var left = currrentLine.slice(0, position.column - 1)
        var right = currrentLine.slice(position.column - 1)
        lines[position.lineNumber - 1] = left + `![](../images/${imageName})` + right
        this.post.content = lines.join('\n')
      }else {
        return
      }
    }
  },
  destroyed() {
    const win = BrowserWindow.getAllWindows()[0]
    win.setTitle(`布丁笔记`)
  }
}
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 100%;
}

.editor-wrapper {
  padding-top: 20px;
}
</style>

<style lang="scss">
.mtk1 {
  color: #666 !important;
}

.mtk6 {
  color: #333 !important;
}

.monaco-editor {
  background-color: #ffffff !important;
}

.cursor {
  background-color: #666 !important;
  width: 1px;
}
</style>
