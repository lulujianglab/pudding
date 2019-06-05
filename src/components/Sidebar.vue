<template>
  <column class="sidebar">
   <button @click="upload">同步</button>
   <button @click="translate">md2html</button>
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

export default {
  data () {
    var defaultIcon = 'el-icon-my-wenjian'
    var menu = [
      {
        title: '快速访问',
        list: [
          { name: '全部文章', path: '/posts', icon: 'el-icon-my-xiangmu1' },
          { name: '回收站', path: '/recycle', icon: 'el-icon-my-huishouzhan' },
          { name: '配置', path: '/configuration', icon: 'el-icon-my-huishouzhan' }
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
    async translate() {
      await ipc.send('/publish/translate')
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
      this.$router.push(route)
    }
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  width: 220px;
  background-color: #f5f5f4;
  white-space: nowrap; // 整个 sidebar 不能换行
  border-right: 1px solid #ddd;
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
  cursor: default;
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
