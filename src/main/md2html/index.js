import path from 'path'
import fs from 'fs-extra'
import db from '../db'
import _ from 'lodash'
import dayjs from 'dayjs'
import 'dayjs/locale/de-ch'

const MarkdownIt = require('markdown-it')
const MarkdownItKatex = require('@iktakahiro/markdown-it-katex')
// const markdownItTocAndAnchor = require('markdown-it-toc-and-anchor')
const MarkdownItTaskLists = require('markdown-it-task-lists')
const emoji = require('markdown-it-emoji')
const imsize = require('markdown-it-imsize')
const hljs = require('highlight.js')

const markdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typography: true,
  highlight: (str, lang) => {
    // 添加这两行才能正确显示 <>
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&gt;/g, ">");

    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + markdownIt.utils.escapeHtml(str) + '</code></pre>';
  }
})

markdownIt.use(MarkdownItKatex)
// markdownIt.use(markdownItTocAndAnchor, {
//   anchorLink: false,
// })
markdownIt.use(MarkdownItTaskLists, {
  label: true, labelAfter: true,
})
markdownIt.use(emoji)
markdownIt.use(imsize, { autofill: true })

export default class Translate {
  constructor(opt) {
    opt = opt || {}
    this.library = opt.library
    this.localPath = opt.library.localPath
  }

  async putAssets() {
    var assetsDir = path.join(__static, 'themes/default/assets')
    await fs.copy(assetsDir, path.join(this.localPath, 'dist/assets'))
  }

  getBaseUrl() {
    let { repository, userName } = db.get('syncSetting.github').value()
    var host = `${userName}.github.io`
    var baseURL = host
    if (host !== repository) {
      baseURL += `/${repository}`
    }
    console.log('post baseURL',baseURL)
    return baseURL
  }

  async addCNAME(github) {
    if (github.domain) {
      await fs.writeFile(path.join(this.localPath, 'dist', 'CNAME'), github.domain)
    }
  }

  async handleREADME(github, posts) {
    // 分情况获取baseURL：一种是.github.io，另一种是pages
    const baseURL = this.getBaseUrl()
    var readmeTemplate = await fs.readFile(path.join(__static, 'README.md'), 'utf8')
    var sortPosts = _.groupBy(posts, post => dayjs(post.createdAt).format('MMM YYYY'))
    var readmeData = _.template(readmeTemplate)({ sortPosts, dayjs, baseURL, github })
    await fs.writeFile(path.join(this.localPath, 'dist', 'README.md'), readmeData)
  }

  async handleIndexHtml(github, posts) {
    var templateDir = path.join(__static, 'themes/default')
    var indexTemplate = await fs.readFile(path.join(templateDir, 'index.html'), 'utf8')
    var html = _.template(indexTemplate)({ posts, 'userName': github.userName, dayjs })
    await fs.writeFile(path.join(this.localPath, 'dist', 'index.html'), html)
  }

  async handlePostHtml(github, posts) {
    var templateDir = path.join(__static, 'themes/default')
    var postTemplate = await fs.readFile(path.join(templateDir, 'post.html'), 'utf8')
    var postCompiled = _.template(postTemplate)
    // 将所有文章都放入post文件夹下
    const postDistDir = path.join(this.localPath, 'dist', 'posts')
    await fs.mkdirp(postDistDir)
    for (let post of posts) {
      if (post.state === 'open') {
        var postLocalPath = path.join(this.library.localPath, post.fileName)
        var mdContent = await fs.readFile(postLocalPath, 'utf8')
        var htmlContent = markdownIt.render(mdContent)
        var htmlPage = postCompiled({ post: { ...post, htmlContent }, github, dayjs })
        var safeTitle = path.basename(post.fileName, '.md')
        await fs.writeFile(path.join(postDistDir, `${safeTitle}.html`), htmlPage)
      }
    }
  }

  async toHtml() {
    const github = db.get('syncSetting.github').value()
    const posts = await this.library.getPostsInfo()

    // 重新创建dist文件夹
    var distDir = path.join(this.localPath, 'dist')
    if (await fs.exists(distDir)) {
      await fs.remove(distDir)
    }
    await fs.mkdirp(distDir)
    // 将assets静态文件夹copy到dist目录下
    await this.putAssets()
    // 如果用户有域名，则在dist文件夹下新建CNAME
    await this.addCNAME(github)
    // 将每篇post用到的images文件copy到dist目录下
    await fs.copy(path.join(this.localPath, 'images'), path.join(this.localPath, 'dist', 'images'))
    // 将首页模板编译完成后放入dist目录下
    await this.handleIndexHtml(github, posts)
    // 将README编译完成后放入dist目录下
    await this.handleREADME(github, posts)
    // 依次将post md文件render为html，并编译完成放入posts目录下
    await this.handlePostHtml(github, posts)
  }
}