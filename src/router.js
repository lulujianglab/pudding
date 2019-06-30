import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/posts/list/:tag', // 文章列表
      component: require('@/components/posts/Posts').default
    },
    {
      path: '/posts/:id', // 编辑文章
      component: require('@/components/posts/Editor').default
    },
    {
      path: '/setting/info', // 基础信息
      component: require('@/components/setting/Info').default
    },
    {
      path: '/setting/comment', // 评论功能
      component: require('@/components/setting/Comment').default
    },
    {
      path: '/sync/github', // 同步Github
      component: require('@/components/sync/Configuration').default
    },
    {
      path: '/sync/import', // 导入issues
      component: require('@/components/sync/ImportIssues').default
    },
    {
      path: '/labels/list', // 标签列表
      component: require('@/components/labels/List').default
    },
  ]
})
