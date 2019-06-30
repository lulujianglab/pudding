<template>
  <row class="element">
    <div class="left">
      <div class="input">
        <el-input 
          v-model="input"
          placeholder="请输入文章标题"
          suffix-icon="el-icon-search"
          clearable>
        </el-input>
      </div>
      <div class="edit button" @click="handleAdd()">
        <span class="text">十</span>
      </div>
    </div>
    <div class="right" v-if="show">
      <div class="review button" @click="preview()">
        <!-- <i class="el-icon-my-preview"></i> -->
        <span class="text">预览</span>
      </div>
      <div class="upload button" @click="upload()">
        <!-- <i class="el-icon-my-tongbu"></i> -->
        <el-button type="primary" class="text" :loading="loading">同步</el-button>
      </div>
    </div>
  </row>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { shell, remote } from 'electron'
import path,{ posix } from 'path'

export default {
  props: ['value', 'show'],
  data() {
    return {
      input: '',
      loading: false
    }
  },
  watch: {
    input(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    async handleAdd() {
      const id = await ipc.send('/posts/create')
      this.$router.push({
        path: '/posts/edit',
        query: {
          id,
        }
      })
    },

    async upload() {
      const { repository, userName, branch, token, domain } = await ipc.send('/github/detail') || {}
      if (userName && repository && branch && token && domain) {
        this.loading = true
        await ipc.send('/publish/translate')
        await ipc.send('/publish/github')
        this.loading = false
        this.$message.success('恭喜，同步成功 💐')
      } else {
        this.$message.warning('请先完成 github 表单配置')
        await this.sleep(1000)
        this.$router.push('/sync/github')
      }
    },

    sleep(time) {
      return new Promise(resolve => {
        setTimeout(resolve, time)
      })
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
  // margin: 20px 40px;
  margin: 20px 40px 0 40px;
  // padding-bottom: 30px;
  padding: 20px 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.button {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  // width: 120px;
  height: 32px;
  line-height: 32px;
  margin-left: 20px;
  text-align: center;
  cursor: pointer;
}

.edit {
  width: 40px;
}

.review,
.upload {
  width: 80px;
  background-color: $--color-primary-5;
  color: #fff;
  font-weight: 500;
  border: 0;
}

.review:hover,
.upload:hover {
  background-color: $--color-primary-2;
}

.el-button--primary {
  width: 80px;
  background-color: $--color-primary-5;
  border: 0;
  color: #fff;
}

.el-button--primary:hover {
  background-color: $--color-primary-2;
  border: 0;
}

.el-button--small {
  font-size: 14px;
}
</style>
