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
    console.log('show', post)
    var localPath = path.join(this.library.localPath, `${post.title}.md`)
    var content = await fs.readFile(localPath, 'utf8')
    return {
      ...post,
      content,
      localPath
    }
  }

  async delete(item) {
    console.log('item',item)
    db.get('posts').remove({ title: item.title }).write()
  }

  async edit(post) {
    console.log('post', post)
    var rawPost = db.get('posts').find({ id: post.id }).value()
    var newLocalPath = path.join(this.library.localPath, `${post.title}.md`)
    if (rawPost.title !== post.title) {
      console.log('改名', rawPost.title, post.title)
      var fromLocalPath = path.join(this.library.localPath, `${rawPost.title}.md`) 
      await fs.move(fromLocalPath, newLocalPath) 
    }
    await fs.writeFile(newLocalPath, post.content, 'utf8')
    delete post.content
    delete post.localPath
    this.updateMeta(post)   
    return post
  }

  async updateMeta(post) {
    return db.get('posts').find({ id: post.id }).assign(post).write()
  }
}

export default Posts
