import { app } from 'electron'
import ipc from 'electron-ipc-extra'
import Library from './library'
import _ from 'lodash'
import Post from './controller/post'
import Upload from './upload'
import Translate from './md2html'
import Github from './controller/github'

class Main {
  constructor() {
    var library = this.library = new Library()
    this.postController = new Post({ library })
    this.uploadController = new Upload({ library })
    this.translateController = new Translate({ library })
    this.githubController = new Github({ library })
    this.bindEvents()
  }

  bindEvents() {
    var post = this.postController
    var upload = this.uploadController
    var translate = this.translateController
    var github = this.githubController

    ipc.on('/posts/list', (...args) => post.index(...args))
    ipc.on('/posts/create', (...args) => post.create(...args))
    ipc.on('/posts/detail', (...args) => post.show(...args))
    // ipc.on('/posts/findId', (...args) => post.findId(...args))
    ipc.on('/posts/edit', (...args) => post.edit(...args))
    ipc.on('/posts/update_meta', (...args) => post.updateMeta(...args))
  
    ipc.on('/github/detail', (...args) => github.show(...args))
    ipc.on('/github/detailIssues', (...args) => github.showIssues(...args))
    ipc.on('/github/edit', (...args) => github.edit(...args))
    ipc.on('/github/editIssues', (...args) => github.editIssues(...args))
    ipc.on('/github/exportFromIssues', (...args) => github.exportFromIssues(...args))

    ipc.on('/publish/github', (...args) => upload.post(...args))
    ipc.on('/publish/translate', (...args) => translate.toHtml(...args))
  }


}

export default new Main()
