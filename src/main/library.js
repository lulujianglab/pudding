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
