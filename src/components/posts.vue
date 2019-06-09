<template>
  <column class="wrapper">
    <router-link
      :to="{ path: '/posts/edit', query: { name: item.fileName } }"
      class="item flex-row"
      v-for="item in posts"
      :key="item.localPath">
      <span>{{item.title}}</span>
    </router-link>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'

export default {
  data() {
    return {
      posts: []
    }
  },
  async created() {
    this.posts = await ipc.send('/posts/list')
  }
}
</script>

<style scoped lang="scss">
.content {
  -webkit-app-region: no-drag;
  flex-shrink: 0;
}

.item {
  padding: 2px 20px;
  font-size: 18px;
  color: #333;
}
</style>
