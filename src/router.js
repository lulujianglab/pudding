import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/posts',
      component: require('@/components/posts').default
    },
    {
      path: '/posts/:id',
      component: require('@/components/postEditor').default
    },
    {
      path: '/configuration',
      component: require('@/components/configuration').default
    },
    {
      path: '/import',
      component: require('@/components/ImportIssues').default
    },
  ]
})
