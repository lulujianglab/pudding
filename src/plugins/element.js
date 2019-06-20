import Vue from 'vue'
import {
  checkbox,
  checkboxGroup,
  popover,
  Message,
  MessageBox,
  Loading,
  Button,
  Input,
  Link,
  Form,
  FormItem
} from 'element-ui'

Vue.use(checkbox)
Vue.use(checkboxGroup)
Vue.use(popover)

Vue.use(Loading.directive)

Vue.use(Button)
Vue.use(Input)
Vue.use(Link)
Vue.use(Form)
Vue.use(FormItem)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
