<template>
  <row class="element">
    <div class="left">
      <!-- <el-select class="lable" v-model="selectedLabels" filterable multiple placeholder="请添加标签">
        <el-option
          v-for="item in labels"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select> -->
      <el-input
        class="title"
        v-model="postTitle"
        placeholder="文章标题"
        clearable>
      </el-input>
      <div class="edit button" @click="handleLabels()">添加标签</div>
    </div>
    <div class="right">
      <el-checkbox :value="value" @input="input" v-if="postTitle">私密</el-checkbox>
      <div class="save button" @click="save()" v-if="postTitle">
        <span class="text">保存</span>
      </div>
      <div class="review button" @click="preview()" v-if="show">
        <span class="text">预览</span>
      </div>
      <!-- <div class="back button" @click="back()">返回</div> -->
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
  // margin: 20px 40px 0 40px;
  // padding: 20px 0 40px;
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
  // width: 284px;
  height: 32px;
  position: relative;
}

.edit {
  margin-left: 20px;
  height: 31px;
}

.button {
  padding: 4px 16px;
  border-radius: 4px;
  font-size: 14px;
  // background-color: #f7c101;
  // color: #fff;
  // border: 0;
  border: 1px solid #DCDFE6;
  cursor: pointer;
}

.button:hover {
  // background-color: #ffd951;
  color: $--color-primary;
  background-color: $--color-primary-4;
  border: 1px solid $--color-primary-4;
}

.save {
  // margin-right: 24px;
  margin-right: 82px;
  background-color: #f7c101;
  color: #fff;
  border: 1px solid #f7c101;
}

.save:hover,
.review:hover {
  background-color: #ffd951;
  color: #fff;
  border: 1px solid #ffd951;
}

.review {
  position: absolute;
  // right: 77px;
  width: 62px;
  right: 0;
  background-color: #f7c101;
  color: #fff;
  border: 1px solid #f7c101;
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
}
</style>
