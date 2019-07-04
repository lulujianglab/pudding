import path from 'path'
import { app } from 'electron'
import fs from 'fs-extra'
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const shortid = require('shortid')

// 目前只在 main 中用, 相当于 server 中用 mongo 一样, 对 renderer 提供 ipc 接口
class DB {
  constructor() {
  }

  async init(dbDir) {
    dbDir = dbDir || app.getPath('userData')
    if (!await fs.pathExists(dbDir)) {
      await fs.mkdirp(dbDir)
    }
    var dbPath = path.join(dbDir, 'db.json')
    // console.log('数据库', dbPath)
    const adapter = new FileAsync(dbPath)
    var db = await low(adapter)
    db.defaults({
      posts: [{
        id: shortid.generate(),
        title: 'Welcome',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: 0,
        private: false,
        labels: [],
        avatar_url: '',
        login: ''
      }, {
        id: shortid.generate(),
        title: 'Pudding',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: 0,
        private: true,
        labels: [],
        avatar_url: '',
        login: ''
      }], // 文章列表, title, name, content, createdAt, updatedAt
      labelsMap: {
        "JavaScript": {
          "count": 0
        },
        "CSS": {
          "count": 0
        },
        "HTML": {
          "count": 0
        },
        "Bug": {
          "count": 0
        }
      },
      syncSetting: {
        issues: {},
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