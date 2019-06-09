import db from '../db'
import axios from 'axios'
import path from 'path'
import fs from 'fs-extra'

class Github {
  constructor(opt) {
    opt = opt || {}
    this.library = opt.library
  }

  async show() {
    return db.get('syncSetting.github').value()
  }

  async edit(config) {
    return db.set('syncSetting.github', config).write()
  }

  async publish() {

  }

  async exportFromIssues(values) {
    const { issuesAddress } = values
    const { userName } = db.get('syncSetting.github').value()
    let { data: posts } = await axios(`https://api.github.com/repos/${userName}/${issuesAddress}/issues`, {
      // Authorization: `token ${token}`
    })
    posts = await Promise.all((posts || [])
      .filter(item => item.state === 'open')
      .map(async item => {
        // 将 issues 写入 md 文件
        var title = escapeFileName(item.title)
        let fileName = `${title}.md`
        var localPath = path.join(this.library.localPath, fileName)
        await fs.writeFile(localPath, item.body, 'utf8')
        // 存入 db
        return {
          title,
          fileName,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          comments: item.comments,
          state: item.state,
          labels: item.labels,
          avatar_url: item.user.avatar_url,
          login: item.user.login
        }
      })
    )
    db.set('posts', posts).write()
  }
}

function escapeFileName(str) {
  return str.replace(/\//g, '\u2215')
}

export default Github