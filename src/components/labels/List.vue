<template>
  <column class="wrapper">
    <ToolBar v-model="keyword" :addLabel="addLabel"></ToolBar>
    <div
      class="flex-row"
      v-for="item in filteredLabels"
      :key="item.localPath">
      <div class="item">
        <div class="label" @click="showPost(item)">{{item}}</div>
        <div class="right">
          <div class="des" v-if="labelsMap[item].count">{{labelsMap[item].count}} 篇文章</div>
          <div class="operate" @click="todelete(item)">删除</div>
        </div>
      </div>
    </div>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
import ToolBar from './ToolBarLabels'

export default {
  data() {
    return {
      labelsMap: {},
      labels: [],
      keyword: '',
    }
  },
  components: {
    ToolBar,
  },
  async created() {
    await ipc.send('/posts/setLabel') // 更新labels
    await this.handleFetch()
  },
  computed: {
    filteredLabels() {
      return this.labels.filter(label => label.includes(this.keyword))
    }
  },
  methods: {
    async handleFetch() {
      this.labelsMap = await ipc.send('/posts/listLabel')
      this.labels = Object.keys(this.labelsMap)
    },
    async showPost(label) {
      this.$router.push(`/posts/list/${label}`)
    },
    async todelete(label) {
      const ret = await ipc.send('/posts/deleteLabel', label)
      if (ret) {
        this.$message.success('删除成功')
        await this.handleFetch()
      } else {
        this.$message.info('删除失败')
      }
    },
    async addLabel() {
      try {
        const { value } = await this.$prompt('请输入标签名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
        this.$message.success('添加成功')
        await this.sendLabel(value)
      } catch {
        this.$message.info('取消输入')
      }
    },

    async sendLabel(label) {
      await ipc.send('/posts/addLabel', label)
      // this.labels = await ipc.send('/posts/listLabel')
      await this.handleFetch()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  overflow-y: auto;
}

.item {
  width: 100%;
  padding: 15px 0px;
  margin: 0 40px;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: $--color-primary;
  background-color: $--color-primary-4;
  margin-right: 4px;
  padding: 4px 10px;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
}

.right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.des {
  font-size: 12px;
  color: #999;
  margin-right: 200px;
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
  color: $--color-primary;
  background-color: $--color-primary-4;
}
</style>
