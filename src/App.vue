<template>
  <div id="app" @dragenter.prevent @dragover.prevent @dragleave.prevent @drop.prevent>
    <column class="app-wrapper">
      <multipane class="flex-1 content pane-group">
        <Sidebar class="pane" style="min-width: 120px"></Sidebar>
        <multipane-resizer></multipane-resizer>
        <router-view class="flex-1 scroll-view"></router-view>
      </multipane>
    </column>
  </div>
</template>

<script>
import Vue from 'vue'
import * as helper from '@/helper'

export default {
  name: 'app',
  async mounted () {
    window.editorReady = helper.initEditor()
  }
}
</script>

<style scoped lang="scss">
.app-wrapper {
  height: 100vh;
  overflow: hidden;
}

.content {
  -webkit-app-region: no-drag;
  flex-shrink: 0;
}
</style>

<style lang="scss">
@import './style/index.scss'; // 全局自定义的css样式

body {
  -webkit-app-region: drag;
  user-select: none;
}

button, a, p {
  -webkit-app-region: no-drag;
}

.scroll-view {
  padding: 20px 10px;
}
</style>
