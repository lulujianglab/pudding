<template>
  <column v-if="post" class="editor-wrapper">
    <ToolBarEditor
      v-model="post.private"
      :savePost="savePost"
      @changeLabel="handleChangeLabel"
      @changeTitle="handleChangeTitle">
    </ToolBarEditor>
    <!-- <div class="header">
      <el-input
        class="title"
        v-model="post.title"
        placeholder="文章标题"
        clearable>
      </el-input>
    </div> -->
    <div
      class="editor"
      @keydown="onKeydown"
      @paste="handlePaste">
    </div>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { clipboard, remote } from 'electron'
import fs from 'fs-extra'
import path from 'path'
import dayjs from 'dayjs'
import ToolBarEditor from './ToolBarEditor'
const { BrowserWindow } = require('electron').remote

export default {
  components: {
    ToolBarEditor
  },
  data() {
    return {
      post: {},
      edited: false,
      // labels: [],
      selectedLabels: [],
      label: '',
      options: {
        minimap: {
          enabled: false
        },
        theme: 'pudding',
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
      return this.post.title
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
    console.log('id',this.$route.query.id)
    this.post = await ipc.send('/posts/detail', this.$route.query.id)
    this.initEditor()
    // this.selectedLabels = this.post.labels.map(label => label.name)
    const win = BrowserWindow.getAllWindows()[0]
    win.setRepresentedFilename(this.post.localPath)
    win.setDocumentEdited(true)
  },
  methods: {
    async initEditor() {
      const monaco = await window.editorReady
      this.editor = window.editor = monaco.editor.create(document.querySelector('.editor'), {
        value: this.post.content,
        language: 'markdown',
        ...this.options
      })
      this.editor.focus()
      this.editor.getModel().onDidChangeContent(ev => {
        this.edited = true
      })
    },
    async savePost() {
      this.post.content = this.editor.getValue()
      this.post.labels = this.selectedLabels.map(item => ({ name: item }))
      var post = await ipc.send('/posts/edit', this.post, this.selectedLabels)
      console.log('post*****',post)
      this.edited = false
    },
    async onKeydown(ev) {
      if (ev.metaKey || ev.ctrlKey) {
        if (ev.key === 's') {
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
        var lines = this.editor.getValue().split('\n')
        var currrentLine = lines[position.lineNumber - 1]
        var left = currrentLine.slice(0, position.column - 1)
        var right = currrentLine.slice(position.column - 1)
        lines[position.lineNumber - 1] = left + `![](../images/${imageName})` + right
        this.editor.setValue(lines.join('\n'))
      }else {
        return
      }
    },
    async handleEdit() {
      this.$router.push('/labels/list')
    },
    handleChangeLabel(val) {
      this.selectedLabels = val
    },
    handleChangeTitle(val) {
      this.post.title = val
    }
  },
  destroyed() {
    if (this.editor) {
      this.editor.dispose()
      this.editor = window.editor = null
    }
    const win = BrowserWindow.getAllWindows()[0]
    win.setTitle(`布丁笔记`)
  }
}
</script>

<style lang="scss" scoped>
.header {
  // width: 600px;
  margin: 30px 40px 20px 40px;
}

.right {
  display: flex;
}

.title {
  min-width: 360px;
  // margin-right: 40px;
}

.label {
  flex: 1;
}

.editor {
  width: 100%;
  height: 100%;
}

.editor-wrapper {
  padding-top: 10px;
  position: relative;
}

.item {
  margin-bottom: 12px;
}

.bottom {
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #F5F7FA;
  background: #fff;
  z-index: 999;
  padding: 10px 20px;
}

.label-input {
  width: 100px;
}

.label-button {
  padding: 0 6px;
  border-radius: 4px;
  border: 1px solid #F5F7FA;
  font-size: 12px;
  line-height: 32px;
  height: 32px;
}

.label-button:hover {
  color: #4caf50;
  background-color: #adedd780;
  border: 1px solid #adedd780;
}

.button {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  height: 32px;
  line-height: 32px;
  margin-left: 20px;
  text-align: center;
  cursor: pointer;
}
</style>

<style lang="scss">
.monaco-editor {
  background-color: #ffffff !important;
}

.cursor {
  background-color: #666 !important;
  width: 1px;
}

.monaco-scrollable-element {
  margin-top: 10px;
}
</style>
