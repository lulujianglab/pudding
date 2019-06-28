<template>
  <column class="sidebar" v-loading="loading">
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
              <i :class="item.icon" class="icon"></i>
              <span>{{item.name}}</span>
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
import _ from 'lodash'

export default {
  data () {
    return {
      transferInfo: {},
      menu: [],
      loading: false,
      labels: [],
    }
  },
  async created () {
    var defaultIcon = 'el-icon-my-wenjian'
    this.labels = await this.getPostsLabel()
    this.menu = [
      {
        title: '我的文章',
        list: [
          { name: '全部文章', path: '/posts/list/all', icon: 'el-icon-my-wenzhangshoufeiziyuan' },
          { name: '公开博客', path: '/posts/list/public', icon: 'el-icon-my-gongkai1' },
          { name: '私人笔记', path: '/posts/list/private', icon: 'el-icon-my-private' },
        ]
      }, 
      {
        title: '博客设置',
        list: [
          { name: '基础信息', path: '/setting/info', icon: 'el-icon-my-jichugongneng' },
          { name: '评论功能', path: '/setting/comment', icon: 'el-icon-my-pinglun' }
        ]
      },
      {
        title: '同步设置',
        list: [
          { name: 'Github', path: '/sync/github', icon: 'el-icon-my-github' }
        ]
      }, {
        title: '标签',
        // list: this.labels
        list: [
          { name: '标签管理', path: '/labels/list', icon: 'el-icon-my-wenzhangshoufeiziyuan' }
        ]
      }
    ]
    this.menu.forEach(item => {
      if (item.list) {
        item.list.forEach(item => {
          item.icon = item.icon || defaultIcon
        })
      }
    })
    this.putLabels()
  },
  methods: {
    async getPostsLabel() {
      var allPosts = await ipc.send('/posts/list')
      var labels = (allPosts || []).map(post => {
        return post.labels.map(label => {
          return label.name
        })
      })
      // return Array.from(new Set(_.flattenDeep(labels))).map(item => ({
      //   name: item, path: `/posts/list/${item}`, icon: 'el-icon-my-gongkai1'
      // }))
      return Array.from(new Set(_.flattenDeep(labels)))
    },

    async putLabels() {
      await ipc.send('/posts/addLabel', this.labels)
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
  font-weight: 500;
  color: #666;
  font-size: 14px;
  padding: 2px 10px 2px 17px;
  display: block;
  text-decoration: none;
  line-height: 22px;
  cursor: pointer;
}

.item:hover {
  background-color: #ecefef;
  // opacity: 0.8;
}
.item-active {
  background-color: #dcdfe1;
}

.icon {
  width: 20px;
  text-align: center;
  color: #777;
  margin-right: 3px;
}
</style>
