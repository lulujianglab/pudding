<template>
  <column class="wrapper">
    <Element :posts="posts" @change="changePosts"></Element>
    <div
      class="flex-row"
      v-for="item in posts"
      :key="item.localPath">
      <div class="item">
        <row class="main">
          <el-link type="info" style="color:#333">
            <p 
              class="title ellipsis" 
              @click="handleEdit(item.fileName)">
              {{item.title}}
            </p>
          </el-link>
          <p class="date ellipsis">{{ dayjs(item.createdAt).format('YYYY-MM-DD') }}</p>
        </row>
        <div v-if="item.labels.length !== 0">
          <row class="label-list">
            <p 
              class="label-item"
              v-for="label in item.labels"
              :key="label.name">
              {{label.name}}
            </p>
          </row>
        </div>
        <row class="side">
          <div class="left">
            <div class="circle"></div>
            <p class="status">公开</p>
          </div>
          <div class="right">
            <div class="operate" @click="handleReview(item.title)">预览</div>
            <div class="operate" @click="handleDelete(item)">删除</div>
          </div>
        </row>
      </div>
      <!-- <span
        class="button"
        @click="handleDelete(scope.$index, scope.row)">删除</span> -->
    </div>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { shell, remote } from 'electron'
import path,{ posix } from 'path'
import dayjs from 'dayjs'
import Element from './Element'

export default {
  data() {
    return {
      posts: []
    }
  },
  components: {
    Element: Element
  },
  async created() {
    this.posts = await ipc.send('/posts/list')
  },

  methods: {
    handleEdit(fileName) {
      this.$router.push({
        path: '/posts/edit',
        query: { name: fileName }
      })
    },
    changePosts(data) {
      this.posts = data
    },
    handleDelete(item) {
      console.log('item', item)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      // this.$message({
      //   type: 'info',
      //   message: '已取消删除'
      // })
    },
    async handleReview(title) {
      await ipc.send('/publish/translate')
      const docPath = remote.app.getPath('documents')
      const postPath = path.join(docPath, 'pudding', 'dist', 'posts', title)
      shell.openExternal(`file://${postPath}.html`)
    },
  }
}
</script>

<style scoped lang="scss">
// .content {
//   -webkit-app-region: no-drag;
//   flex-shrink: 0;
// }

.item {
  width: 100%;
  padding: 10px 0px;
  margin: 0 40px;
  font-size: 18px;
  color: #333;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f0f0f0;
}

.main {
  display: flex;
  justify-content: space-between;
  padding-bottom: 5px;
}

.title {
  font-size: 15px;
  font-weight: 500;
}

.date {
  color: #999;
  font-size: 12px;
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.label-list {
  display: flex;
  padding-top: 2px;
}

.label-item {
  color: #4caf50;
  background-color: #adedd780;
  margin-right: 4px;
  padding: 4px 10px;
  border-radius: 3px;
  font-size: 12px;
}

.side {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.left,
.right {
  display: flex;
  align-items: center;
}

.operate {
  font-size: 12px;
  color: #999;
  margin-left: 6px;
  padding: 4px 6px;
  vertical-align: middle;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.operate:hover {
  color: #4caf50;
  background-color: #adedd780;
}

.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  // background: #e34c26;
  background: #ffd951;
  // background: #ffb7a4;
  // background: #ffeeb1;
  // background: #2b170e;
}

.status {
  font-size: 12px;
  color: #999;
  padding: 0 5px;
}

.button {
  color:lawngreen;
  cursor: pointer;
  letter-spacing: 2px;
}

.button:hover {
  color:green;
}

.v-modal {
  left: 220px;
}

.el-message-box__wrapper {
  left: 220px;
}
</style>
