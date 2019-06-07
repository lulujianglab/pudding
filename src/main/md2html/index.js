import path from 'path'
import { log } from 'electron-log';
import { app } from 'electron'
import fs from 'fs-extra'
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
    this.library = opt.library
    this.appDir = path.join(app.getPath('documents'), 'pudding')
  }

  async index() {
    return await filterfiles(this.library.localPath)
  }

  async tohtml() {
    const files = await this.index()
    // console.log('.md files',files)
    files.forEach(async file => {
      var basename = path.basename(file, '.md')
      var markdownStr = await fs.readFile(path.join(this.appDir, file), 'utf8')
      var html = markdownIt.render(markdownStr)
      await fs.writeFile(path.join(this.appDir, 'dist', `${basename}.html`), html)
    })
    // files.forEach(file => {
    //   const html = markdownIt.render(fs.readFile(`${this.appDir}/${file}`) + '')
    //   const newName = file.replace(/.md/,'.html')
    //   console.log('.html file', newName)
    //   fs.writeFile(`${this.appDir}/dist/${newName}`, this.html)
    // })
  }
}