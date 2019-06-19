<template>
  <column class="wrapper">
    <!-- <router-link
      :to="{ path: '/posts/edit', query: { name: item.fileName } }"
      class="item flex-row"
      v-for="item in posts"
      :key="item.localPath">
      <span>{{item.title}}</span>
    </router-link> -->
    <el-table
      :data="posts"
      style="width: 100%"
    >
      <el-table-column label="文章标题" width="500">
        <template slot-scope="scope">
          <span class="title">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ dayjs(scope.row.createdAt).format('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" width="100">
          <span
            class="button"
            @click="handleDelete(scope.$index, scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      posts: []
    }
  },
  async created() {
    this.posts = await ipc.send('/posts/list')
  },

  methods: {
    handleDelete(index, row) {
      console.log(index, row)
    }
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

.el-table {
  overflow-y: auto;
}

.title {
  width: 480px;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.button {
  color:lawngreen;
  cursor: pointer;
  letter-spacing: 2px;
}

.button:hover {
  color:green;
}
</style>
