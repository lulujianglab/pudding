<template>
  <row class="element">
    <div class="left">
      <div class="button" @click="back()">返回</div>
    </div>
    <div class="right">
      <el-checkbox :value="value" @input="input">私密</el-checkbox>
      <div class="save button" @click="save()">
        <span class="text">保存</span>
      </div>
      <div class="review button" @click="show ? preview() : ''">
        <span class="text">预览</span>
      </div>
    </div>
  </row>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { shell, remote } from 'electron'
import path,{ posix } from 'path'

export default {
  props: ['value', 'savePost', 'title'],
  data() {
    return {
      show: true
    }
  },
  methods: {
    input(val) {
      this.$emit('input', val)
      this.show = !val
      console.log('this.show ',this.show )
    },
    back() {
      this.$router.go(-1)
    },

    async save() {
      this.savePost()
    },

    async preview() {
      console.log('11111')
      await ipc.send('/publish/translate')
      const docPath = remote.app.getPath('documents')
      const postPath = path.join(docPath, 'pudding', 'dist', 'posts', this.title)
      shell.openExternal(`file://${postPath}.html`)
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

.button {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 16px;
  border: 1px solid #DCDFE6;
  cursor: pointer;
}

.button:hover {
  color: #4caf50;
  background-color: #adedd780;
  border: 1px solid #adedd780;
}

.review {
  margin-left: 60px
}

.el-checkbox {
  margin: auto 20px;
}

.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #4caf50 !important;
}
.el-checkbox__input.is-checked
.el-checkbox__inner,
.el-checkbox__input.is-indeterminate 
.el-checkbox__inner {
  background-color: #4caf50 !important;
  border-color: #4caf50 !important;
}

.el-checkbox__input.is-checked+.el-checkbox__label {
  color: #4caf50 !important;
}
</style>
