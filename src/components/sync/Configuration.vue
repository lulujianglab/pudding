<template>
  <column class="wrapper">
    <!-- <row>issues 地址：<input type="text" v-model="configForm.issuesAddress" class="input" /></row> -->
    <!-- <button @click="exportFromIssues" class="button">从 issues 中导入博客</button> -->
    <el-form :label-position="labelPosition" label-width="80px" :model="configForm">
      <el-form-item label="仓库名">
        <el-input v-model="configForm.repository"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="configForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="分支">
        <el-input v-model="configForm.branch"></el-input>
      </el-form-item>
      <el-form-item label="token">
        <el-input v-model="configForm.token"></el-input>
      </el-form-item>
      <el-form-item label="域名">
        <el-input v-model="configForm.domain"></el-input>
      </el-form-item>
    </el-form>
    <div @click="onSave" class="button">保存</div>
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
        branch: '',
        token: '',
        domain: ''
      },
      labelPosition: 'right'
    }
  },

  async created() {
    this.configForm = await ipc.send('/github/detail') || {}
  },

  methods: {
    async onSave() {
      await ipc.send('/github/edit', this.configForm)
      this.$message.success('恭喜，保存成功 💐')
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  align-items:center;
  padding-top: 20px;
  padding-top: 100px;
}

.button {
  padding: 4px 16px;
  border-radius: 4px;
  font-size: 16px;
  margin: 20px 0 0 -252px;
  border: 1px solid #DCDFE6;
  // background-color:#00f59d;
  // color: #fff;
}

.button:hover {
  color: #4caf50;
  background-color: #adedd780;
  border: 0;
}

.el-form {
  width: 480px;
}

.el-form-item--small.el-form-item {
  margin-bottom: 28px;
}
.el-form-item__label {
  letter-spacing: 1.5px;
}
</style>
