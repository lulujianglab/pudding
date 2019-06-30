// 相当于 main.js

import Vue from 'vue'
import column from '@/components/column'
import row from '@/components/row'
import Toolbar from '@/components/Toolbar'
import Sidebar from '@/components/Sidebar'
import DetailView from '@/components/DetailView'
import { Multipane, MultipaneResizer } from 'vue-multipane'
const dayjs = require('dayjs')
const http = require('axios')
const _ = require('lodash')

http.defaults.baseURL = 'http://milvzn.com:13000/api'

_.extend(Vue.prototype, {
  _,
  $http: http,
  dayjs
})

var components = {
  column,
  row,
  Toolbar,
  Sidebar,
  DetailView,
  Multipane,
  MultipaneResizer
}

_.forIn(components, (val, key) => {
  Vue.component(key, val)
})
