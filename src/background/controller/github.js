import db from '../db'
import axios from 'axios'
import path from 'path'
import fs from 'fs-extra'
const shortid = require('shortid')
const escapeFile = require('escape-filename')

class Github {
  constructor(opt) {
    opt = opt || {}
    this.library = opt.library
  }

  async show() {
    return db.get('syncSetting.github').value()
  }

  async showIssues() {
    return db.get('syncSetting.issues').value()
  }

  async edit(config) {
    return db.set('syncSetting.github', config).write()
  }

  async editIssues(config) {
    return db.set('syncSetting.issues', config).write()
  }

  async publish() {

  }

  async exportFromIssues() {
    const { userName, issuesAddress } = db.get('syncSetting.issues').value()
    let { data: posts } = await axios(`https://api.github.com/repos/${userName}/${issuesAddress}/issues?per_page=1000`, {
      // Authorization: `token ${token}`
    })
    posts = await Promise.all((posts || [])
      .filter(item => item.state === 'open')
      .map(async item => {
        // 将 issues 写入 md 文件
        var title = escapeFile.escape(item.title)
        let fileName = `${title}.md`
        var localPath = path.join(this.library.localPath, fileName)
        // 删除db里边的原有记录
        await db.get('posts').remove({ title }).write()
        await fs.writeFile(localPath, item.body, 'utf8')
        // 存入 db
        return {
          id: shortid.generate(),
          title,
          // fileName,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          comments: item.comments,
          private: false,
          labels: item.labels,
          avatar_url: item.user.avatar_url,
          login: item.user.login
        }
      })
    )
    db.get('posts').push(...posts).write()
  }
}

export default Github