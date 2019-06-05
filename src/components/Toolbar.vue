<template>
  <column class="toolbar">
    <row class="cross-align-center main-align-space-between toolbar-real">
      <row class="toolbar-left">
        <row class="toolbar-nav">
          <column class="btn-wrapper">
            <row class="btn btn-default" @click.native="$router.go(-1)"><i class="el-icon-arrow-left"></i></row>
            <span class="text">返回</span>
          </column>
          <column class="btn-wrapper">
            <row class="btn btn-default" @click.native="$router.go(1)"><i class="el-icon-arrow-right"></i></row>
            <span class="text">前进</span>
          </column>
        </row>
        <row class="toolbar-main">
          <column class="btn-wrapper">
            <row class="btn btn-default" @click.native="createPost">
              <row class="image">新建</row>
            </row>
            <span class="text">新建</span>
          </column>
        </row>
      </row>
      <row class="toolbar-right">
        <span>&nbsp;</span>
      </row>
    </row>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
const { dialog } = require('electron').remote
const eventHub = require('@/eventHub')
const log = require('electron-log')
const { shell } = require('electron')

export default {
  data() {
    return {}
  },
  methods: {
    async createPost() {
      const postName = await ipc.send('/posts/create')
      this.$router.push({
        path: '/posts/edit',
        query: {
          name: postName
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.toolbar-header {
  -webkit-app-region: drag;
  color: #333;
  cursor: default;
  font-size: 13px;
  font-weight: 400;
  text-align: center;
  margin-top: 2px;
}

.toolbar {
  // background-image: linear-gradient(rgb(233,233,233),rgb(210,210,210))!important;
  background-color: #ECEBEB;
  border-radius: 6px 6px 0 0;
  border-bottom: 1px solid #c2c0c2;
  min-height: 22px;
  box-shadow: inset 0 1px 0 #f5f4f5;
  background-color: #e8e6e8;
}

.toolbar-real {
  padding: 8px 0;
}

.toolbar-nav {
  padding-left: 8px;
  width: 220px;
}

.toolbar-right {
  padding-right: 8px;
}

.toolbar-main {
  .btn {
    height: 26px;
    display: flex;
    padding: 0 8px;
    align-items: center;
    justify-content: center;
  }
  .btn-wrapper + .btn-wrapper {
    margin-left: 6px;
  }
  .image {
    width: 100%;
    min-width: 26px;
    height: 18px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
}

.btn-wrapper {
  align-items: center;
  .text {
    font-size: 11px;
    color: #333;
    line-height: 1;
    margin-top: 3px;
  }
}
</style>
