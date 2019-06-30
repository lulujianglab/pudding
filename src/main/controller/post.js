import path from 'path'
import unusedFilename from 'unused-filename'
import fs from 'fs-extra'
import db from '../db'
const shortid = require('shortid')

class Posts {
  constructor(opt) {
    opt = opt || {}
    this.library = opt.library
  }

  async index() {
    return this.library.getPostsInfo()
  }

  async listLabel() {
    return this.library.getLabelsList()
  }

  async setLabel() {
    console.log('222222')
    return this.library.setLabelsList()
  }

  async addLabel2(label) {
    console.log('新增标签', label)
    const newLabels = []
    const oldLabels = await this.library.getLabelsList()
    const labelsSet = new Set(oldLabels)
    if (label) {
      if (Array.isArray(label)) {
        label.map(item => {
          if(!labelsSet.has(item)) {
            newLabels.push(item)
          }
        })
        await db.get('labelsMap').push(...newLabels).write()
      } else {
        if(!labelsSet.has(label)) {
          await db.get('labelsMap').push(label).write()
        }
      }
    }
  }

  async addLabel(label) {
    console.log('新增标签', label)
    const labelsMap = await this.library.getLabelsList()
    const labelsKey = Object.keys(labelsMap)
    if(label && !labelsKey.includes(label)) {
      await db.get('labelsMap').set(label, {count: 1}).write()
    }
  }

  async deleteLabel(label) {
    console.log('删除标签', label)
    const labelsMap = await this.library.getLabelsList()
    // const index = labels.indexOf(label)
    // labels.splice(index, 1)
    delete labelsMap[label]
    // await db.get('labels').remove(label).write()
    await db.set('labelsMap', labelsMap).write()
    return true
  }

  async create(name) {
    name = name || '未命名'
    var fileName = `${name}.md`
    var localPath = path.join(this.library.localPath, fileName)
    localPath = await unusedFilename(localPath)
    fileName = path.basename(localPath)
    await fs.writeFile(localPath, '')
    const newPost = {
      id: shortid.generate(),
      title: path.basename(fileName, '.md'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: 0,
      private: false,
      labels: [],
      avatar_url: '',
      login: ''
    }
    await db.get('posts').push(newPost).write()
    return newPost.id
  }

  async show(id) {
    const post = db.get('posts').find({id}).value()
    var localPath = path.join(this.library.localPath, `${post.title}.md`)
    var content = await fs.readFile(localPath, 'utf8')
    return {
      ...post,
      content,
      localPath
    }
  }

  async delete(item) {
    console.log('删除文章',item)
    db.get('posts').remove({ title: item.title }).write()
  }

  async edit(post) {
    var rawPost = db.get('posts').find({ id: post.id }).value()
    var newLocalPath = path.join(this.library.localPath, `${post.title}.md`)
    if (rawPost.title !== post.title) {
      console.log('改名', rawPost.title, post.title)
      var fromLocalPath = path.join(this.library.localPath, `${rawPost.title}.md`)
      await fs.rename(fromLocalPath, newLocalPath, (err) => {
        if (err) throw err
        console.log('改名成功')
      })
    }
    await fs.writeFile(newLocalPath, post.content, 'utf8')
    console.log('内容更新完成')
    delete post.content
    delete post.localPath
    this.updateMeta(post)
    console.log('数据更新完成')  
    return post
  }

  async updateMeta(post) {
    return db.get('posts').find({ id: post.id }).assign(post).write()
  }
}

export default Posts
