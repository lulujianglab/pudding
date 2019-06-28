<template>
  <column v-if="post" class="editor-wrapper">
    <ToolBarEditor v-model="post.private" :savePost="savePost" :title="post.title"></ToolBarEditor>
    <div class="input">
      <el-input
        class="title"
        v-model="post.title"
        placeholder="文章标题"
        suffix-icon="el-icon-search"
        clearable>
      </el-input>
      <el-select class="lable" v-model="selectedLabels" multiple placeholder="请添加标签">
      <el-option
        v-for="item in labels"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
      <!-- 空标签占位 -->
      <el-option class="item" value=""/>
      <div class="bottom">
        <el-input class="label-input" v-model="input" placeholder="请输入标签"></el-input>
        <div class="label-button" @click="addLabel()">新增</div>
      </div>
    </el-select>
    </div>
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
import ToolBarEditor from './ToolBarEditor'
const { BrowserWindow } = require('electron').remote

export default {
  components: {
    MonacoEditor,
    ToolBarEditor
  },
  mounted() {
    var editor = this.$refs.editor.getMonaco() // 获取实例
    window.editor = this.editor = editor
  },
  data() {
    return {
      post: {},
      edited: false,
      labels: [],
      selectedLabels: [],
      input: '',
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
      return this.post.name
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
    this.labels = await this.getPostsLabel()
    console.log('id',this.$route.query.id)
    this.post = await ipc.send('/posts/detail', this.$route.query.id)
    const win = BrowserWindow.getAllWindows()[0]
    win.setRepresentedFilename(this.post.localPath)
    win.setDocumentEdited(true)
  },
  methods: {
    async getPostsLabel() {
      var allPosts = await ipc.send('/posts/list')
      var labels = (allPosts || []).map(post => {
        return post.labels.map(label => {
          return label.name
        })
      })
      return Array.from(new Set(_.flattenDeep(labels)))
    },
    async savePost() {
      var post = await ipc.send('/posts/edit', this.post)
      // this.post.fileName = post.fileName
      console.log('post*****',post)
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
    },
    async addLabel() {
      console.log('lable', this.input)
    }
  },
  destroyed() {
    const win = BrowserWindow.getAllWindows()[0]
    win.setTitle(`布丁笔记`)
  }
}
</script>

<style lang="scss" scoped>
.input {
  // width: 600px;
  margin: 0 40px 20px 40px;
  display: flex;
  justify-content: space-between;
}

.title {
  width: 480px;
  margin-right: 20px;
}

.label {
  flex: 1;
}

.editor {
  width: 100%;
  height: 100%;
}

.editor-wrapper {
  padding-top: 20px;
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

.el-select .el-input.is-focus .el-input__inner {
  border-color: #4caf50;
}

.el-select .el-input__inner:focus {
  border-color: #4caf50;
}

.el-input.is-active .el-input__inner, 
.el-input__inner:focus {
  border-color: #4caf50;
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
</style>
