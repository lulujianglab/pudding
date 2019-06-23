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

  async create2(name) {
    name = name || '未命名'
    var fileName = `${name}.md`
    var localPath = path.join(this.library.localPath, fileName)
    localPath = await unusedFilename(localPath)
    fileName = path.basename(localPath)
    return fileName
  }

  async create(name) {
    name = name || '未命名'
    var fileName = `${name}.md`
    var localPath = path.join(this.library.localPath, fileName)
    localPath = await unusedFilename(localPath)
    fileName = path.basename(localPath)
    await fs.writeFile(localPath, '')
    const newPost = {
      title: path.basename(fileName, '.md'),
      fileName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: 0,
      state: 'open',
      labels: [],
      avatar_url: '',
      login: ''
    }
    await db.get('posts').push(newPost).write()
    return fileName
  }

  async show(fileName) {
    var localPath = path.join(this.library.localPath, fileName)
    // const result = await fs.exists(localPath)
    // let content = ''
    // if (result) {
    //   content = await fs.readFile(localPath, 'utf8')
    // }
    var content = await fs.readFile(localPath, 'utf8')
    return {
      content,
      localPath,
      fileName
    }
  }

  async edit(post, title, state) {
    console.log('post',post,title)
    let { localPath, content, fileName } = post
    if(path.basename(fileName, '.md') !== title) {
      var newLocalPath = path.join(this.library.localPath, `${title}.md`)
      await fs.move(localPath, newLocalPath)
      await fs.writeFile(newLocalPath, content, 'utf8')
    } else {
      await fs.writeFile(localPath, content, 'utf8')
    }
    
    db.get('posts').find({ fileName: post.fileName }).assign({ title, fileName: `${title}.md`, state}).write()
    // await fs.writeFile(localPath, content, 'utf8')
    // const newPost = {
    //   title,
    //   fileName: `${title}.md`,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   comments: 0,
    //   state: 'open',
    //   labels: [],
    //   avatar_url: '',
    //   login: ''
    // }
    // db.get('posts').push(newPost).write()
    
    return post
  }

  async updateState(post) {
    return db.get('posts').find({ title: post.title }).assign({ state: post.state}).write()
  }
}

export default Posts
