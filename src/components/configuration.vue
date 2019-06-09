<template>
  <column class="wrapper">
    <row>仓库名：<input type="text" id="repository" v-model="configForm.repository" class="input" /></row>
    <row>用户名：<input type="text" v-model="configForm.userName" class="input" /></row>
    <row>分支：<input type="text" v-model="configForm.branch" class="input" /></row>
    <!-- <row>邮箱：<input type="text" v-model="configForm.email" class="input" /></row> -->
    <row>token：<input type="text" v-model="configForm.token" class="input" /></row>
    <row>域名：<input type="text" v-model="configForm.domain" class="input" /></row>
    <row>issues 地址：<input type="text" v-model="configForm.issuesAddress" class="input" /></row>
    <button @click="exportFromIssues" class="button">从 issues 中导入博客</button>
    <button @click="onSave" class="button">保存</button>
    <!-- <el-form :model="configForm" class="demo-form-inline">
      <el-form-item label="仓库名">
        <el-input v-model="configForm.repository" placeholder="repository"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="configForm.userName" placeholder="userName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSave('configForm')">保存</el-button>
      </el-form-item>
    </el-form> -->
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { Form } from 'element-ui'

export default {
  data() {
    return {
      configForm : {
        repository: '',
        userName: '',
        // email: '',
        branch: '',
        token: '',
        issuesAddress: '',
        domain: ''
      }
    }
  },

  async created() {
    this.configForm = await ipc.send('/github/detail') || {}
  },

  methods: {
    async exportFromIssues() {
      const { issuesAddress } = this.configForm
      await ipc.send('/github/exportFromIssues', {issuesAddress})
    },

    async onSave() {
      await ipc.send('/github/edit', this.configForm)
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
