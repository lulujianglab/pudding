<template>
  <column class="wrapper">
    <div @click="importFromIssues()" class="issue-button">从 issues 中导入博客</div>
    <el-form :label-position="labelPosition" label-width="80px" :model="configForm">
      <el-form-item label="仓库名">
        <el-input v-model="configForm.repository" placeholder="testlab.github.io"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="configForm.userName" placeholder="testlab"></el-input>
      </el-form-item>
      <el-form-item label="分支">
        <el-input v-model="configForm.branch" placeholder="master"></el-input>
      </el-form-item>
      <el-form-item label="token">
        <el-input v-model="configForm.token"></el-input>
      </el-form-item>
      <el-form-item label="域名">
        <el-input v-model="configForm.domain"></el-input>
      </el-form-item>
    </el-form>
    <div @click="onSave" class="button">保存</div>
    <el-dialog title="Issues 配置" :visible.sync="dialogFormVisible">
      <ImportIssues :handleDialogVisible="handleDialogVisible" />
    </el-dialog>
  </column>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { Form } from 'element-ui'
import ImportIssues from './ImportIssues'

export default {
  components: {
    ImportIssues
  },

  data() {
    return {
      configForm : {
        repository: '',
        userName: '',
        branch: '',
        token: '',
        domain: ''
      },
      labelPosition: 'right',
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },

  async created() {
    this.configForm = await ipc.send('/github/detail') || {}
  },

  methods: {
    async onSave() {
      await ipc.send('/github/edit', this.configForm)
      this.$message.success('恭喜，保存成功 💐')
    },

    importFromIssues() {
      this.dialogFormVisible = true
    },

    handleDialogVisible() {
      this.dialogFormVisible = false
    }

  }
}
</script>

<style scoped lang="scss">
.wrapper {
  align-items:center;
  padding-top: 20px;
  padding-top: 80px;
}

.button {
  padding: 4px 16px;
  border-radius: 4px;
  font-size: 16px;
  margin: 20px 0 0 -252px;
  border: 1px solid #DCDFE6;
}

.button:hover {
  color: $--color-primary;
  background-color: $--color-primary-4;
  border: 1px solid $--color-primary-4;
}

.issue-button {
  background-color: $--color-primary-5;
  color: #fff;
  font-weight: 500;
  border-radius: 4px;
  padding: 6px 12px;
  margin-left: 320px;
  margin-bottom: 30px;
  cursor: pointer;
}

.issue-button:hover {
  background-color: $--color-primary-2;
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

.v-modal {
  z-index: 0 !important;
}
</style>
