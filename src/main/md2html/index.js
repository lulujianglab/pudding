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

  async toHtml() {
    var distDir = path.join(this.localPath, 'dist')
    if (await fs.exists(distDir)) {
      await fs.remove(distDir)
    }

    await fs.mkdirp(distDir)

    await this.putAssets()
    const baseURL = this.getBaseUrl()
    const github = db.get('syncSetting.github').value()
    const posts = await this.library.getPostsInfo()
    var templateDir = path.join(__static, 'themes/default')

    if (github.domain) {
      await fs.writeFile(path.join(this.localPath, 'dist', 'CNAME'), github.domain)
    }

    var indexTemplate = await fs.readFile(path.join(templateDir, 'index.html'), 'utf8')
    var html = _.template(indexTemplate)({ posts, 'userName': github.userName, dayjs })
    await fs.writeFile(path.join(this.localPath, 'dist', 'index.html'), html)

    var readmeTemplate = await fs.readFile(path.join(__static, 'README.md'), 'utf8')
    var sortPosts = _.groupBy(posts, post => dayjs(post.createdAt).format('MMM YYYY'))
    var readmeData = _.template(readmeTemplate)({ sortPosts, dayjs, baseURL, github })
    await fs.writeFile(path.join(this.localPath, 'dist', 'README.md'), readmeData)

    var postTemplate = await fs.readFile(path.join(templateDir, 'post.html'), 'utf8')
    var postCompiled = _.template(postTemplate)

    const postDistDir = path.join(this.localPath, 'dist', 'posts')
    await fs.mkdirp(postDistDir)

    for (let post of posts) {
      var postLocalPath = path.join(this.library.localPath, post.fileName)
      var mdContent = await fs.readFile(postLocalPath, 'utf8')
      var htmlContent = markdownIt.render(mdContent)
      var htmlPage = postCompiled({ post: { ...post, htmlContent }, github, dayjs })
      var safeTitle = path.basename(post.fileName, '.md')
      await fs.writeFile(path.join(postDistDir, `${safeTitle}.html`), htmlPage)
    }
  }
}