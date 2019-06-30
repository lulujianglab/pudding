import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/plugins/vue-inject.js'
import './plugins/element.js'

Vue.config.productionTip = false

// Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    this.$router.push('/posts')
  },
}).$mount('#app')
