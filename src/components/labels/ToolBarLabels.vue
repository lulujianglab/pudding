<template>
  <row class="element">
    <div class="input">
      <el-input
        v-model="input"
        placeholder="请输入标签名称"
        suffix-icon="el-icon-search"
        clearable>
      </el-input>
    </div>
    <!-- <div class="edit button" @click="handleAdd()">
      <span class="text">十</span>
    </div> -->
    <div class="add button" @click="handleAdd()">
      <span class="text">新增标签</span>
    </div>
  </row>
</template>

<script>
import ipc from 'electron-ipc-extra'
import { shell, remote } from 'electron'
import path,{ posix } from 'path'

export default {
  props: ['addLabel'],
  data() {
    return {
      input: '',
      loading: false
    }
  },
  watch: {
    input(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    async handleAdd() {
      this.addLabel()
    }
  }
}
</script>

<style lang="scss" scoped>
.element {
  margin: 20px 40px 0 40px;
  padding: 20px 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.input {
  width: 300px;
  margin-right: 20px;
}

.button {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  // width: 120px;
  height: 32px;
  line-height: 32px;
  margin-left: 20px;
  text-align: center;
  cursor: pointer;
}

.edit {
  width: 40px;
}

.add {
  width: 80px;
  background-color: $--color-primary-5;
  // color: #ffd951;
  color: #fff;
  font-weight: 500;
  border: 0;
}

.add:hover {
  background-color: $--color-primary-2;
}

.el-button--primary {
  width: 80px;
  background-color: $--color-primary-5;
  border: 0;
  color: #fff;
}

.el-button--primary:hover {
  background-color: $--color-primary-2;
  border: 0;
}
</style>
