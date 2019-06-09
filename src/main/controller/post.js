import path from 'path'
import unusedFilename from 'unused-filename'
import fs from 'fs-extra'
import db from '../db'

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
    var fullName = `${name}.md`
    var localPath = path.join(this.library.localPath, fullName)
    localPath = await unusedFilename(localPath)
    fullName = path.basename(localPath)
    await fs.writeFile(localPath, '')
    const newPost = {
      title: path.basename(fullName, '.md'),
      fileName: fullName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: 0,
      state: 'open',
      labels: [],
      avatar_url: '',
      login: ''
    }
    db.get('posts').push(newPost).write()
    return fullName
  }

  async show(fullName) {
    var localPath = path.join(this.library.localPath, fullName)

    var content = await fs.readFile(localPath, 'utf8')
    return {
      content,
      localPath,
      fullName
    }
  }

  async edit(post) {
    let { localPath, content } = post
    await fs.writeFile(localPath, content, 'utf8')
    return post
  }
}

export default Posts
