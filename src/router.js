import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/posts/all', // 全部文章
      component: require('@/components/posts/Posts').default
    },
    {
      path: '/posts/public', // 公开博客
      component: require('@/components/posts/Open').default
    },
    {
      path: '/posts/private', // 私人笔记
      component: require('@/components/posts/Private').default
    },
    {
      path: '/posts/recycle', // 回收站
      component: require('@/components/posts/Recycle').default
    },
    {
      path: '/posts/:id', // 编辑文章
      component: require('@/components/posts/PostEditor').default
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
  ]
})
