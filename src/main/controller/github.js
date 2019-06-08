import db from '../db'

class Github {
  constructor() {

  }

  async show() {
    return db.get('syncSetting.github').value()
  }

  async edit(config) {
    return db.set('syncSetting.github', config).write()
  }
}

export default Github