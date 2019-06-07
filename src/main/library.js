import { app } from 'electron'
import path from 'path'
import fs from 'fs-extra'

class Library {
  constructor(localPath) {
    this.localPath = null
    this.imagePath = null
    this.init(localPath)
    console.log(__static)
  }

  async init(localPath) {
    var docPath = app.getPath('documents')
    this.localPath = localPath || path.join(docPath, 'pudding')
    await fs.mkdirp(this.localPath)
    this.imagePath = path.join(this.localPath, 'images')
    await fs.mkdirp(this.imagePath)
    await this.tryInitWelcomeFile()
    return this.localPath
  }

  async getPostsInfo() {
    // 获取所有文章信息
    var files = await fs.readdir(this.localPath)
    files = files.filter(file => {
      return _.endsWith(file, '.md')
    })
    files = files.map(file => {
      return {
        fileName: file,
        postName: path.basename(file, '.md'),
        localPath: path.join(this.localPath, file)
      }
    })
    return files
  }

  async tryInitWelcomeFile() {
    var name = 'Welcome.md'
    var welcomePath = path.join(this.localPath, name)
    if (!await fs.exists(welcomePath)) {
      var templatePath = path.join(__static, name)
      await fs.copy(templatePath, welcomePath)
    }
  }
}

export default Library
