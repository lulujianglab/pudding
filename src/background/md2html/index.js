import { app } from 'electron'
import path from 'path'
import fs from 'fs-extra'
import db from '../db'
import _ from 'lodash'
import dayjs from 'dayjs'
import 'dayjs/locale/de-ch'
// import markdownItMermaid from 'markdown-it-mermaid'

const MarkdownIt = require('markdown-it')
const MarkdownItKatex = require('@iktakahiro/markdown-it-katex') // 公式
// const markdownItTocAndAnchor = require('markdown-it-toc-and-anchor').default
const MarkdownItTaskLists = require('markdown-it-task-lists')
const emoji = require('markdown-it-emoji')
const imsize = require('markdown-it-imsize') // images size
const hljs = require('highlight.js')
const galleryPlugin = require('markdown-it-gallery') // images
// const markdownItMermaid = require('markdown-it-mermaid')

const markdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typography: true,
  breaks: true,
  xhtmlOut: false,
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

markdownIt.use(MarkdownItKatex, {"throwOnError" : false, "errorColor" : " #cc0000"})
// markdownIt.use(markdownItTocAndAnchor)
markdownIt.use(MarkdownItTaskLists, {
  label: true, labelAfter: true,
})
markdownIt.use(emoji)
markdownIt.use(imsize, { autofill: true })
markdownIt.use(galleryPlugin, {
  galleryClass: 'md-gallery',
  galleryTag: 'figure',
  imgClass: 'md-gallery__image',
  wrapImagesInLinks: true,
  linkClass: 'md-gallery__link',
  linkTarget: '_blank',
  imgTokenType: 'image',
  linkTokenType: 'link',
  imageFilterFn: token => /example.com/.test(token.attrGet('src')),
  imageSrcFn: token => token.attrGet('src').replace(/(\.\w+$)/, '-320x320$1'),
  linkHrefFn: token => token.attrGet('src').replace(/(\.\w+$)/, '-1920x1920$1'),
})
// markdownIt.use(markdownItMermaid)

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

  async handleAbout() {
    const postDistDir = path.join(this.localPath, 'dist')
    const docPath = app.getPath('documents')
    const AboutPath = path.join(docPath, 'pudding', 'About.md')
    var mdContent = await fs.readFile(AboutPath, 'utf8')
    var htmlContent = markdownIt.render(mdContent)
    await fs.writeFile(path.join(postDistDir, 'About.html'), htmlContent)
  }

  async handleIndexHtml(templateDir, blogInfo, posts) {
    var indexTemplate = await fs.readFile(path.join(templateDir, 'index.html'), 'utf8')
    var html = _.template(indexTemplate)({ posts, blogInfo, dayjs, label: false })
    await fs.writeFile(path.join(this.localPath, 'dist', 'index.html'), html)
  }

  async handleArchiveHtml(templateDir, blogInfo, posts) {
    var postsFilter = posts.filter(post => post.title !== 'About' && !post.private)
    var sortPosts = _.groupBy(postsFilter, post => dayjs(post.createdAt).format('MMM YYYY'))
    var archiveTemplate = await fs.readFile(path.join(templateDir, 'archive.html'), 'utf8')
    var html = _.template(archiveTemplate)({ sortPosts, blogInfo, dayjs })
    await fs.writeFile(path.join(this.localPath, 'dist', 'archive.html'), html)
  }

  async handleLabelHtml(templateDir, labelsMap, labels, blogInfo) {
    var labelTemplate = await fs.readFile(path.join(templateDir, 'label.html'), 'utf8')
    var labelTemplate = _.template(labelTemplate)({ labels, labelsMap, blogInfo })
    await fs.writeFile(path.join(this.localPath, 'dist', 'label.html'), labelTemplate)
  }

  async handleLabelIndexHtml(templateDir, blogInfo, allPosts, labels) {
    var labelIndexTemplate = await fs.readFile(path.join(templateDir, 'index.html'), 'utf8')
    var labelHtmlCompiled = _.template(labelIndexTemplate)
    // 将所有标签分类的文章都放入labels文件夹下
    const labelsDistDir = path.join(this.localPath, 'dist', 'labels')
    await fs.mkdirp(labelsDistDir)
    for (let label of labels) {
      const posts = (allPosts ||[]).filter(item => item.labels.some(ele => ele.name === label))
      var labelHtmlPage = labelHtmlCompiled({ posts, blogInfo, dayjs, label })
      await fs.writeFile(path.join(labelsDistDir, `${label}.html`), labelHtmlPage)
    }
  }

  async handlePostHtml(templateDir, github, posts) {
    var postTemplate = await fs.readFile(path.join(templateDir, 'post.html'), 'utf8')
    var postCompiled = _.template(postTemplate)
    // 将所有文章都放入posts文件夹下
    const postDistDir = path.join(this.localPath, 'dist', 'posts')
    await fs.mkdirp(postDistDir)
    for (let post of posts) {
      if (!post.private) {
        var fileName = `${post.title}.md`
        var postLocalPath = path.join(this.library.localPath, fileName)
        var mdContent = await fs.readFile(postLocalPath, 'utf8')
        var htmlContent = markdownIt.render(mdContent)
        var htmlPage = postCompiled({ post: { ...post, htmlContent }, github, dayjs })
        // var safeTitle = path.basename(fileName, '.md')
        await fs.writeFile(path.join(postDistDir, `${post.title}.html`), htmlPage)
      }
    }
  }

  async toHtml() {
    const github = db.get('syncSetting.github').value()
    const posts = await this.library.getPostsInfo()
    const blogInfo = db.get('syncSetting.blogInfo').value()
    const labelsMap = db.get('labelsMap').value()
    const labels = Object.keys(labelsMap)
    const templateDir = path.join(__static, 'themes/default')

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
    await this.handleIndexHtml(templateDir, blogInfo, posts)
    // 将归档模板编译完成后放入dist目录下
    await this.handleArchiveHtml(templateDir, blogInfo, posts)
    // 将标签模板编译完成后放入dist目录下
    await this.handleLabelHtml(templateDir, labelsMap, labels, blogInfo)
    // 将标签分类好的post列表放入labels目录下
    await this.handleLabelIndexHtml(templateDir, blogInfo, posts, labels)
    // 将README编译完成后放入dist目录下
    await this.handleREADME(github, posts)
    // 将About.md render为html，并编译完成放入posts目录下
    // await this.handleAbout()
    // 依次将post md文件render为html，并编译完成放入posts目录下
    await this.handlePostHtml(templateDir, github, posts)
    return true
  }
}