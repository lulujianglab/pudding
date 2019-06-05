import Vue from 'vue'
import {
  checkbox,
  checkboxGroup,
  popover,
  Message,
  MessageBox,
  Loading,
} from 'element-ui'

Vue.use(checkbox)
Vue.use(checkboxGroup)
Vue.use(popover)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
