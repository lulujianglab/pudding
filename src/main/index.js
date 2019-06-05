import { app } from 'electron'
import ipc from 'electron-ipc-extra'
import Library from './library'
import _ from 'lodash'
import Post from './controller/post'
import Upload from './upload'
import Translate from './md2html'

class Main {
  constructor() {
    this.library = new Library()
    this.postController = new Post({ library: this.library })
    this.uploadController = new Upload({ library: this.library })
    this.translateController = new Translate({ library: this.library })
    this.bindEvents()
  }

  bindEvents() {
    var post = this.postController
    var upload = this.uploadController
    var translate = this.translateController

    ipc.on('/posts/list', (...args) => post.index(...args))
    ipc.on('/posts/create', (...args) => post.create(...args))
    ipc.on('/posts/detail', (...args) => post.show(...args))
    ipc.on('/posts/edit', (...args) => post.edit(...args))

    ipc.on('/publish/config', (...args) => upload.saveInfo(...args))
    ipc.on('/publish/github', (...args) => upload.post(...args))
    ipc.on('/publish/translate', (...args) => translate.tohtml(...args))
  }


}

export default new Main()
