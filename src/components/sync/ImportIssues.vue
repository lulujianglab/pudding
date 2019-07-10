<template>
  <column class="wrapper-issues">
    <el-form :label-position="labelPosition" label-width="100px" :model="configForm">
      <el-form-item label="Github Issues">
        <el-input
          v-model="configForm.issuesAddress"
          placeholder="https://github.com/<user>/<repo>/issues">
        </el-input>
      </el-form-item>
      <div class="btn-list">
        <el-button size="large" class="cancel" @click="handleDialogVisible()">取 消</el-button>
        <el-button size="large" type="primary" @click="importIssues" class="button" :loading="loading">导入</el-button>
      </div>
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
        issuesAddress: '',
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
      const { issuesAddress } = this.configForm
      if (issuesAddress) {
        this.loading = true
        await ipc.send('/github/exportFromIssues', this.configForm) // 更新posts
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
  align-items: center;
  font-size: 16px;
}

.input {
  margin-bottom: 20px;
  width: 200px;
  height: 26px;
}

.btn-list {
  display: flex;
  justify-content: flex-end;
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

.el-input--small {
  margin-left: 12px;
}
</style>
