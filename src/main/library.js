import { app } from 'electron'
import path from 'path'
import fs from 'fs-extra'
import db from './db'
import _ from 'lodash'

class Library {
  constructor(localPath) {
    this.localPath = null
    this.imagePath = null
    this.init(localPath)
  }

  async init(localPath) {
    var docPath = app.getPath('documents')
    this.localPath = localPath || path.join(docPath, 'pudding')
    await fs.mkdirp(this.localPath)
    await db.init(path.join(this.localPath, 'metadata'))
    this.imagePath = path.join(this.localPath, 'images')
    await fs.mkdirp(this.imagePath)
    await this.tryInitWelcomeFile()
    return this.localPath
  }

  async getPostsInfo() {
    return await db.get('posts').sort((a, b) => {
      return a.createdAt < b.createdAt ? 1 : -1
    }).value()
  }

  async setLabelsList() {
    console.log('xxxxxx')
    var oldLabels = await db.get('labelsMap').value()
    console.log('oldLabels',oldLabels)
    var allPosts = await this.getPostsInfo()
    var labels = (allPosts || []).map(post => {
      return post.labels.map(label => {
        return label.name
      })
    })
    var labelsMap = _.groupBy(_.flatten(labels), item => item)
    for (let i in labelsMap) {
      labelsMap[i] = {count: labelsMap[i].length}
    }
    console.log('labelsMap',labelsMap)
    // return Array.from(new Set(_.flattenDeep(labels)))
    await db.set('labelsMap', {...oldLabels, ...labelsMap}).write()
  }

  async getLabelsList() {
    const labelsMap = await db.get('labelsMap').value()
    return labelsMap
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
