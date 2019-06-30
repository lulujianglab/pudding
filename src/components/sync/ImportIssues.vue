<template>
  <column class="wrapper-issues">
    <el-form :label-position="labelPosition" label-width="100px" :model="configForm">
      <el-form-item label="用户名：">
        <el-input v-model="configForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="issues 地址">
        <el-input v-model="configForm.issuesAddress"></el-input>
      </el-form-item>
      <el-form-item label="token">
        <el-input v-model="configForm.token"></el-input>
      </el-form-item>
      <el-button class="cancle" @click="handleDialogVisible()">取 消</el-button>
      <el-button type="primary" @click="importIssues" class="button" :loading="loading">导入</el-button>
    </el-form>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { Form } from 'element-ui'

export default {
  props: ['handleDialogVisible'],
  data() {
    return {
      configForm : {
        userName: '',
        issuesAddress: '',
        token: '',
      },
      labelPosition: 'right',
      loading: false
    }
  },

  async created() {
    this.configForm = await ipc.send('/github/detailIssues') || {}
  },

  methods: {
    async importIssues() {
      await this.onSave() // 保存配置项
      const { issuesAddress, token, userName } = this.configForm
      if (issuesAddress && token && userName) {
        this.loading = true
        await ipc.send('/github/exportFromIssues') // 更新posts
        this.loading = false
        this.$message.success('恭喜，导入成功 💐')
      } else {
        this.$message.warning('请先完成配置表单')
      }
      this.handleDialogVisible()
    },

    async onSave() {
      const result = await ipc.send('/github/editIssues', this.configForm)
      // if(result.syncSetting && JSON.stringify(result.syncSetting.issues !== '{}')) {
      //   this.$message.success('恭喜，保存成功 💐')
      // }
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper-issues {
  align-items:center;
  // padding-top: 140px;
  font-size: 16px;
}

.input {
  margin-bottom: 20px;
  width: 200px;
  height: 26px;
}

.cancle {
  margin-left: 330px;
  font-size: 16px;
  padding: 6px 16px;
  border-radius: 4px;
}

.button {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 16px;
  margin: 20px 0 0 100px;
}

// .el-button--primary {
//   background-color: #fff;
//   border-color: #DCDFE6;
//   color: #666;
// }

// .el-button--primary:hover {
//   color: $--color-primary;
//   background-color: $--color-primary-4;
//   border: 1px solid $--color-primary-4;
// }

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
