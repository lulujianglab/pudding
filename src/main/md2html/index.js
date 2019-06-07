import path from 'path'
import { log } from 'electron-log';
import { app } from 'electron'
import fs from 'fs-extra'
import _ from 'lodash'
import { filterfiles } from '../common'

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
    this.localPath = opt.library.localPath
  }

  async index() {
    return await filterfiles(this.localPath)
  }

  async tohtml() {
    const files = await this.index()
    console.log('开始 md2html')
    let content = '<br>'
    let compiled = _.template('<a href="<%- basename %>.html"><h1>${content}</h1></a>')
    files.forEach(async file => {
      var basename = path.basename(file, '.md')
      content = `${content}${compiled({'basename' : basename,'content': file})}`
      var markdownStr = await fs.readFile(path.join(this.localPath, file), 'utf8')
      var html = markdownIt.render(markdownStr)
      await fs.writeFile(path.join(this.localPath, 'dist', `${basename}.html`), html)
    })
    await fs.writeFile(path.join(this.localPath, 'dist', 'index.html'), content, 'utf8')
    console.log('md2html 成功')
  }
}