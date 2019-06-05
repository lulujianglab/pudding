import _ from 'lodash'
import fs from 'fs-extra'

export const filterfiles = async (localPath) => {
  var files = await fs.readdir(localPath)
  files = files.filter(file => {
    return _.endsWith(file, '.md')
  })
  return files
}