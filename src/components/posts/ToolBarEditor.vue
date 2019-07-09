<template>
  <row class="element">
    <div class="left">
      <el-input
        class="title"
        v-model="postTitle"
        placeholder="文章标题"
        size="mini"
        clearable>
      </el-input>
      <el-button size="mini" class="edit" @click="handleLabels">添加标签</el-button>
    </div>
    <div class="right">
      <el-checkbox size="mini" :value="value" @input="input" v-if="postTitle">私密</el-checkbox>
      <el-button size="mini" type="primary" @click="save" v-if="postTitle">
        <span class="text">保存</span>
      </el-button>
      <el-button size="mini" type="primary" :disabled="!show" @click="preview">
        <span class="text">预览</span>
      </el-button>
    </div>
    <el-dialog title="添加标签" :visible.sync="dialogFormVisible">
      <div class="modal">
        <el-select class="lable" v-model="selectedLabels" filterable multiple placeholder="请添加标签">
          <el-option
            v-for="item in labels"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <div class="add button" @click="addLabels()">新增标签</div>
      </div>
    </el-dialog>
  </row>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { shell, remote } from 'electron'
import path,{ posix } from 'path'

export default {
  props: ['value', 'savePost'],
  data() {
    return {
      selectedLabels: [],
      show: true,
      labels: [],
      dialogFormVisible: false,
      postTitle: ''
    }
  },
  watch: {
    selectedLabels(val) {
      this.$emit('changeLabel', val)
    },
    postTitle(val) {
      this.$emit('changeTitle', val)
    }
  },
  async created() {
    this.labels = await this.getPostsLabel()
    const post = await ipc.send('/posts/detail', this.$route.query.id)
    this.selectedLabels = post.labels.map(label => label.name)
    this.postTitle = post.title
    this.show = !post.private
  },
  methods: {
    async getPostsLabel() {
      var labelsMap = await ipc.send('/posts/listLabel')
      var labels = Object.keys(labelsMap)
      return labels
    },
    input(val) {
      this.$emit('input', val)
      this.show = !val
    },
    back() {
      this.$router.go(-1)
    },

    async save() {
      this.savePost()
    },

    async preview() {
      await ipc.send('/publish/translate')
      const docPath = remote.app.getPath('documents')
      const postPath = path.join(docPath, 'pudding', 'dist', 'posts', this.postTitle)
      shell.openExternal(`file://${postPath}.html`)
    },

    async handleLabels() {
      this.dialogFormVisible = true
    },
    addLabels() {
      this.$router.push('/labels/list')
    }
  }
}
</script>

<style lang="scss" scoped>
.element {
  padding: 0 20px 10px;
  margin: 0 -10px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}

.left {
  display: flex;
}

.title {
  width: 360px;
}

.right {
  display: flex;
  position: relative;
}

.edit {
  margin-left: 20px;
}

.back {
  margin-left: 68px;
}

.el-checkbox {
  margin: auto 20px;
  font-weight: 400;
}

.el-select {
  width: 270px;
}

.modal {
  height: 330px;
}

.add {
  float: right;
  margin-right: 80px;
  height: 32px;
  color: #4caf50;
  line-height: 32px;
  cursor: pointer;
}
</style>
