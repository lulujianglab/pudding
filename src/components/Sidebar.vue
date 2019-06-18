<template>
  <column class="sidebar">
   <!-- <button @click="upload">同步</button>
   <button @click="translate">md2html</button> -->
   <img src="/app/logo.png" alt="" class="image" />
    <column
      v-for="item in menu"
      :key="item.title"
      class="group">
      <row class="title">{{item.title}}</row>
      <column class="list">
        <row
          @click.native="clickItem(item)"
          class="item"
          :class="{'item-active': isItemActive(item)}"
          v-for="item in item.list"
          :key="item.name">
          <row class="cross-align-center main-align-space-between">
            <row class="cross-align-center">
              <i :class="item.icon" class="icon"></i><span>{{item.name}}</span>
            </row>
            <row class="cross-align-center">{{transferInfo[item.transferType] || '&nbsp;'}}</row>
          </row>
        </row>
      </column>
    </column>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { shell, remote } from 'electron'
import path,{ posix } from 'path'

export default {
  data () {
    var defaultIcon = 'el-icon-my-wenjian'
    var menu = [
      {
        title: '文章相关',
        list: [
          { name: '新建文章', path: '/posts/edit', icon: 'el-icon-my-xiangmu' },
          { name: '全部文章', path: '/posts', icon: 'el-icon-my-xiangmu1' },
        ]
      }, {
        title: '功能相关',
        list: [
          { name: '同步', icon: 'el-icon-my-xiangmu1' },
          { name: '从issues中导入blog', icon: 'el-icon-my-xiangmu1' },
          { name: 'md2html', icon: 'el-icon-my-huishouzhan' },
          { name: '预览', icon: 'el-icon-my-huishouzhan' },
          { name: '回收站', path: '/recycle', icon: 'el-icon-my-huishouzhan' },
        ]
      }, {
        title: '配置相关',
        list: [
          { name: '同步配置', path: '/configuration', icon: 'el-icon-my-huishouzhan' },
          { name: '导入配置', path: '/import', icon: 'el-icon-my-huishouzhan' }
        ]
      }
    ]
    menu.forEach(item => {
      if (item.list) {
        item.list.forEach(item => {
          item.icon = item.icon || defaultIcon
        })
      }
    })
    return {
      transferInfo: {},
      menu
    }
  },
  created () {
    this.getTransferInfo()
    ipc.on('/renderer/transfer/info', data => {
      this.transferInfo = data
    })
  },
  methods: {
    async getTransferInfo () {
      this.transferInfo = await ipc.send('/transfer/info') || {}
    },

    async upload() {
      var ret = await ipc.send('/publish/github')
    },

    async exportFromIssues() {
      await ipc.send('/github/exportFromIssues')
    },

    async translate() {
      await ipc.send('/publish/translate')
    },

    async preview() {
      await ipc.send('/publish/translate')
      const docPath = remote.app.getPath('documents')
      const indexPath = path.join(docPath, 'pudding', 'dist', 'index.html')
      this.openBrowser(`file://${indexPath}`)
    },

    async addPost() {
      const title = await ipc.send('/posts/create')
      return {
        path: '/posts/edit',
        query: {
          name: title
        }
      }
    },

    isItemActive (item) {
      if (item.remotePath) {
        if (this.$route.query.path === item.remotePath) {
          return true
        }
        return false
      }
      return item.path === this.$route.path
    },

    async clickItem (item) {
      var route = {
        path: item.path
      }
      if (item.remotePath) {
        route = {
          path: '/files',
          query: {
            path: item.remotePath
          }
        }
      }
      if (item.name === '新建文章') {
        route = await this.addPost()
      } else if (item.name === '同步') {
        await this.upload()
        return
      } else if (item.name === 'md2html') {
        await this.translate()
        return
      } else if (item.name === '从issues中导入blog') {
        await this.exportFromIssues()
        return
      } else if (item.name === '预览') {
        await this.preview()
        return
      }
      this.$router.push(route)
    },

    openBrowser(url) {
      shell.openExternal(url)
    },
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  width: 220px;
  background-color: #f5f5f4;
  white-space: nowrap; // 整个 sidebar 不能换行
  // border-right: 1px solid #ddd;
  overflow-y: auto;
}

.group {
  padding-bottom: 10px;
}

.image {
  width: 100px;
  height: 80px;
  border-radius: 50%;
  margin: 20px auto;
}

.title {
  font-weight: bold;
  margin: 0;
  padding: 10px 10px 2px;
  font-size: 12px;
  color: #666;
}

.item {
  color: #333;
  font-size: 14px;
  padding: 2px 10px 2px 17px;
  display: block;
  color: #333;
  text-decoration: none;
  line-height: 22px;
  cursor: pointer;
}

.item:hover {
  background-color: hsla(165, 94%, 38%, 1);
  opacity: 0.8;
}
.item-active {
  background-color: #dcdfe1;
}

.icon {
  width: 20px;
  text-align: center;
  margin-right: 3px;
}
</style>
