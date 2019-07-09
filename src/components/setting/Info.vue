<template>
  <column class="detail-view">
    <column class="content">
      <el-tabs :tab-position="tabPosition" style="height: 338px;marginBottom: 30px;" v-model="activeName">
        <el-tab-pane label="博客" name="first">
          <el-form :label-position="labelPosition" label-width="64px" :model="infoForm">
            <!-- <el-form-item label="主题模板">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in ['column', 'row']"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="站点名称">
              <el-input v-model="infoForm.name" placeholder="站点名称"></el-input>
            </el-form-item>
            <el-form-item label="网站描述">
              <el-input v-model="infoForm.des" placeholder="网站描述"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="社交" name="second">
          <el-form :label-position="labelPosition" label-width="64px" :model="infoForm">
            <el-form-item label="Github">
              <el-input v-model="infoForm.Github" placeholder="Github"></el-input>
            </el-form-item>
            <el-form-item label="掘金">
              <el-input v-model="infoForm.juejin" placeholder="掘金"></el-input>
            </el-form-item>
            <el-form-item label="微博">
              <el-input v-model="infoForm.weibo" placeholder="微博"></el-input>
            </el-form-item>
            <el-form-item label="知乎">
              <el-input v-model="infoForm.zhihu" placeholder="知乎"></el-input>
            </el-form-item>
            <el-form-item label="Twitter">
              <el-input v-model="infoForm.Twitter" placeholder="Twitter"></el-input>
            </el-form-item>
            <el-form-item label="Facebook">
              <el-input v-model="infoForm.Facebook" placeholder="Facebook"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-button class="btn-save" type="primary" round size="medium" @click="onSave">保存</el-button>
    </column>
  </column>
</template>

<<script>
import { Form } from 'element-ui'
import ipc from 'electron-ipc-extra'

export default {
  data() {
    return {
      infoForm: {
        template: '',
        name: '',
        des: '',
        social: '',
        Github: '',
        juejin: '',
        weibo: '',
        zhihu: '',
        Twitter: '',
        Facebook: ''
      },
      labelPosition: 'left',
      tabPosition: 'right',
      value: '',
      activeName: 'first',
    }
  },

  async created() {
    this.infoForm = await ipc.send('/blogInfo/detail') || {}
  },

  methods: {
    async onSave() {
      await ipc.send('/blogInfo/edit', this.infoForm)
      this.$message.success('恭喜，保存成功 💐')
    },
  },
}
</script>

<style lang="scss" scoped>
.detail-view {
  overflow-y: auto;
  align-items: center;
  padding-top: 112px;
}

.btn-save {
  min-width: 140px;
  align-self: flex-end;
}

.flex-col content {
  padding-top: 32px;
}

.el-form {
  width: 480px;
}

.el-form-item--small.el-form-item {
  margin-bottom: 28px;
}

.el-form .el-form-item__label {
  letter-spacing: 1.5px;
}

.el-input--small,
.el-select {
  margin-left: 12px;
}

.el-select {
  width: 100%;
}

.el-tab-pane {
  margin-right: 60px;
}

.el-tabs--right .el-tabs__nav-scroll {
  height: 80px;
}
</style>
