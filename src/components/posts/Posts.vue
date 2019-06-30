<template>
  <column class="wrapper">
    <ToolBar v-model="keyword" :show="tag === 'public'"></ToolBar>
    <div
      class="flex-row"
      v-for="item in filteredPosts"
      :key="item.localPath">
      <div class="item">
        <row class="main">
          <el-link type="info" style="color:#333">
            <p
              class="title ellipsis"
              @click="handleEdit(item.id)">
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
          <div class="left" v-if="item.private">
            <div class="circle circle-private"></div>
            <p class="status">私密</p>
          </div>
          <div class="left" v-else>
            <div class="circle circle-open"></div>
            <p class="status">公开</p>
          </div>
          <div class="right">
            <div class="operate" @click="handleReview(item.title)" v-if="tag === 'public'">预览</div>
            <div class="operate" @click="updateStatus(item, 'private')" v-if="tag === 'public'">设为私密</div>
            <div class="operate" @click="updateStatus(item, 'open')" v-if="tag === 'private'">设为公开</div>
            <div class="operate" @click="todelete(item)">删除</div>
          </div>
        </row>
      </div>
    </div>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { shell, remote } from 'electron'
import path,{ posix } from 'path'
import dayjs from 'dayjs'
import ToolBar from './ToolBarPosts'

export default {
  data() {
    return {
      tag: '',
      keyword: '',
      posts: []
    }
  },
  components: {
    ToolBar,
  },
  async created() {
    await this.handleFetch()
  },
  computed: {
    filteredPosts() {
      return this.posts.filter(post => post.title.includes(this.keyword))
    }
  },
  watch: {
    '$route': 'handleFetch'
  },
  methods: {
    async handleFetch() {
      this.tag = this.$route.params.tag
      var allPosts = await ipc.send('/posts/list')
      if (this.tag === 'private') {
        this.posts = await (allPosts ||[]).filter(item => item.private)
      } else if (this.tag === 'public') {
        this.posts = await (allPosts ||[]).filter(item => !item.private)
      } else if (this.tag === 'all') {
        this.posts = allPosts
      } else {
        this.posts = await (allPosts ||[]).filter(item => item.labels.some(label => label.name === this.tag))
      }
    },
    async handleEdit(id) {
      this.$router.push({
        path: '/posts/edit',
        query: { id }
      })
    },
    async updateStatus(item, state) {
      item.private = state === 'private'
      const result = await ipc.send('/posts/update_meta', item)
      await this.handleFetch()
      this.$message({
        type: 'success',
        message: '更新成功!'
      })
    },
    todelete(item) {
      const docPath = remote.app.getPath('documents')
      const fullPath = path.join(docPath, 'pudding', `${item.title}.md`)
      const ret = shell.moveItemToTrash(fullPath)
      if (ret) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        ipc.send('/posts/delete', item)
        this.handleFetch()
      }
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
}

.circle-open {
  // background: #e34c26;
  background: $--color-primary-2;
}

.circle-private {
  background: #ffb7a4;
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
