import { app } from 'electron'
import * as simpleGit from 'simple-git/promise'
import path from 'path'
import db from './db'

export default class Upload {
  constructor() {
    this.remoteUrl = ''
    this.config = {}
    // this.remoteUrl = 'https://testtesttestlab:token@github.com/testtesttestlab/testtesttestlab.github.io.git'
    this.appDir = path.join(app.getPath('documents'), 'pudding')
    this.outputDir = path.join(this.appDir, 'dist')
    this.git = simpleGit(this.outputDir)
  }

  async post() {
    this.config = db.get('syncSetting.github').value()
    const {userName, token, repository} = this.config
    this.remoteUrl = `https://${userName}:${token}@github.com/${userName}/${repository}.git`
    console.log('remoteUrl',this.remoteUrl)
    let result = null
    const repoStatus = await this.git.checkIsRepo()
    if (repoStatus) {
      result = await this.commonPost()
    } else {
      result = this.firstPost()
    }
    return result
  }

  async firstPost() {
    console.log('首次同步')

    try {
      await this.git.init()
      await this.git.addConfig('user.name', this.config.userName)
      // await this.git.addConfig('user.email', this.config.email)
      console.log('start add')
      await this.git.add('./*')
      console.log('start first commit')
      await this.git.commit('first commit')
      console.log('start addRemote')
      await this.git.addRemote('origin', this.remoteUrl)
      console.log('start push')
      await this.git.push('origin', this.config.branch, { '--force': true })
      console.log('上传成功')
    } catch (e) {
      console.error(e)
    }
  }

  async commonPost() {
    console.log('非首次同步')
    console.log('start status')
    try {
      let statusSummary = null
      try {
        statusSummary = await this.git.status()
      } catch (err) {
        console.log('status error', err)
      }
      // await this.git.raw(['remote', 'set-url', 'origin', this.remoteUrl])
      // console.log('set remote origin', this.remoteUrl)
      if (statusSummary.modified.length > 0 || statusSummary.not_added.length > 0) {
        console.log('start add')
        await this.git.add('./*')
        console.log('start commit')
        await this.git.commit(`update from pudding`)
        console.log('start push 改动')
        await this.git.push('origin', this.config.branch, { '--force': true })
      } else {
        console.log('start push 无添加')
        await this.git.push('origin', this.config.branch, { '--force': true })
      }
      console.log('上传成功')
    } catch (e) {
      e => console.log(e.message)
    }
  }
}