<template>
  <column class="wrapper">
    <row>用户名：<input type="text" v-model="configForm.userName" class="input" /></row>
    <row>issues 地址：<input type="text" v-model="configForm.issuesAddress" class="input" /></row>
    <row>token：<input type="text" v-model="configForm.token" class="input" /></row>
    <!-- <button @click="exportFromIssues" class="button">从 issues 中导入博客</button> -->
    <button @click="onSave" class="button">保存</button>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { Form } from 'element-ui'

export default {
  data() {
    return {
      configForm : {
        userName: '',
        issuesAddress: '',
        token: '',
      }
    }
  },

  async created() {
    this.configForm = await ipc.send('/github/detailIssues') || {}
  },

  methods: {
    // async exportFromIssues() {
    //   const { issuesAddress } = this.configForm
    //   await ipc.send('/github/exportFromIssues')
    // },

    async onSave() {
      await ipc.send('/github/editIssues', this.configForm)
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  align-items:center;
  padding-top: 20px;
  font-size: 16px;
}

.input {
  margin-bottom: 20px;
  width: 200px;
  height: 26px;
}

.button {
  height: 26px;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 16px;
  margin: 20px 0 0 160px;
}
</style>
