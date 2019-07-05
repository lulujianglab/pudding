<template>
  <column class="wrapper">
    <column class="content">
      <el-button @click="importFromIssues" type="text" style="align-self: flex-end">从 issues 中导入博客</el-button>
      <el-form :label-position="labelPosition" label-width="60px" :model="configForm">
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
          <el-input v-model="configForm.domain" placeholder="CNAME"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="btn-save" type="primary" round size="medium">保存</el-button>
    </column>
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
      labelPosition: 'left',
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
  align-items: center;
  padding-top: 80px;
}

.btn-save {
  min-width: 140px;
  align-self: flex-end;
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
