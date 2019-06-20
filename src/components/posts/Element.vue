<template>
  <row class="element">
    <div class="left">
      <div class="input">
        <el-input 
          v-model="input"
          placeholder="请输入文章标题"
          @change="handleInput()"
          @clear="handleClear()"
          @blur="handleBlur()"
          suffix-icon="el-icon-search"
          clearable>
        </el-input>
      </div>
      <div class="edit button">
        <!-- <i class="el-icon-edit"></i> -->
        <span class="text" @click="handleAdd()">十</span>
      </div>
    </div>
    <div class="right">
      <div class="review button">
        <i class="el-icon-edit"></i>
        <span class="text" @click="preview()">预览</span>
      </div>
      <div class="upload button">
        <i class="el-icon-edit"></i>
        <span class="text" @click="upload()">同步</span>
      </div>
    </div>
  </row>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { shell, remote } from 'electron'
import path,{ posix } from 'path'

export default {
  data() {
    return {
      input: ''
    }
  },
  props: {
    posts: Array
  },
  methods: {
    async handleAdd() {
      const title = await ipc.send('/posts/create')
      this.$router.push({
        path: '/posts/edit',
        query: {
          name: title
        }
      })
    },

    async handleInput() {
      if (!this.input) {
        this.getPosts()
      } else {
        const filterPosts = (this.posts || []).filter(item => {
          return new RegExp(this.input).test(item.title)
        })
        this.$emit('change', filterPosts)
      }
    },

    async handleClear() {
      this.getPosts()
    },

    async handleBlur() {
      if(!this.input) {
        this.getPosts()
      }
    },

    async getPosts() {
      const newPosts = await ipc.send('/posts/list')
      this.$emit('change', newPosts)
    },

    async upload() {
      var ret = await ipc.send('/publish/github')
    },

    async preview() {
      await ipc.send('/publish/translate')
      const docPath = remote.app.getPath('documents')
      const indexPath = path.join(docPath, 'pudding', 'dist', 'index.html')
      shell.openExternal(`file://${indexPath}`)
    },

    openBrowser(url) {
      shell.openExternal(url)
    },
  }
}
</script>

<style lang="scss" scoped>
.element {
  margin: 20px 40px 20px 40px;
  padding-bottom: 30px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}

.left,
.right {
  display: flex;
}

.input {
  width: 300px;
  margin-right: 20px;
}

.el-input__inner,
.el-input__inner:focus  {
  border-color: #adedd780 !important;
}

.button {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  // width: 120px;
  height: 32px;
  line-height: 32px;
  margin-right: 20px;
  text-align: center;
  cursor: pointer;
}

.edit {
  width: 40px;
}

.review,
.upload {
  width: 80px;
  background-color: #f7c101;
  // color: #ffd951;
  color: #fff;
  font-weight: 500;
  border: 0;
}

.review:hover,
.upload:hover {
  background-color: #ffd951;
}

.text {
  // padding-left: 6px;
}
</style>
