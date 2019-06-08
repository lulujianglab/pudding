import path from 'path'
import { app } from 'electron'
import fs from 'fs-extra'
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

// 目前只在 main 中用, 相当于 server 中用 mongo 一样, 对 renderer 提供 ipc 接口
class DB {
  constructor() {
    this.init()
  }

  async init() {
    const userDataDir = app.getPath('userData')
    if (!await fs.pathExists(userDataDir)) {
      console.log('创建用户目录', userDataDir)
      await fs.mkdirp(userDataDir)
    }
    var dbPath = path.join(userDataDir, '/db.json')
    console.log('数据库', dbPath)
    const adapter = new FileAsync(dbPath)
    var db = await low(adapter)
    db.defaults({
      posts: [], // 文章列表
      syncSettting: {
        github: {}, // github
        oss: {} // 阿里云oss
      } // 同步配置
    }).write()
    this.db = db
  }

  // 因为要用 async 接口, 所以只能套一层了
  write(...args) {
    return this.db.write(...args)
  }

  get(...args) {
    return this.db.get(...args)
  }

  set(...args) {
    return this.db.set(...args)
  }
}

export default new DB()