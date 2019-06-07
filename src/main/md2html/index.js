import path from 'path'
import { log } from 'electron-log';
import { app } from 'electron'
import fs from 'fs-extra'
import _ from 'lodash'

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

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
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
    this.toHtml()
    this.putAssets()
  }

  async putAssets() {
    var assetsDir = path.join(__static, 'themes/default/assets')
    await fs.copy(assetsDir, path.join(this.localPath, 'dist/assets'))
  }

  async toHtml() {
    const posts = await this.library.getPostsInfo()
    var templateDir = path.join(__static, 'themes/default')
    var indexTemplate = await fs.readFile(path.join(templateDir, 'index.html'), 'utf8')
    var html = _.template(indexTemplate)({ posts })
    await fs.writeFile(path.join(this.localPath, 'dist', 'index.html'), html)
    var postTemplate = await fs.readFile(path.join(templateDir, 'post.html'), 'utf8')
    var postCompiled = _.template(postTemplate)
    for (let post of posts) {
      var mdContent = await fs.readFile(post.localPath, 'utf8')
      var htmlContent = markdownIt.render(mdContent)
      var htmlPage = postCompiled({ post: { ...post, htmlContent } })
      await fs.writeFile(path.join(this.localPath, 'dist', `${post.postName}.html`), htmlPage)
    }
  }
}