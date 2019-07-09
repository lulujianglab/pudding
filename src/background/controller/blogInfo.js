import db from '../db'

class BlogInfo {
  constructor(opt) {
    opt = opt || {}
    this.library = opt.library
  }

  async show() {
    return db.get('syncSetting.blogInfo').value()
  }

  async edit(config) {
    return db.set('syncSetting.blogInfo', config).write()
  }
}

export default BlogInfo