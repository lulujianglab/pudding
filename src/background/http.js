import got from 'got'

// 使用 got 而不是 axios 的原因, 支持 stream, 支持 electron net(可以用代理), nodejs 模块不行

const http = got.extend({
  useElectronNet: true,
  mutableDefaults: true,
  responseType: 'json',
  decompress: true,
  json: true,
  hooks: {
    beforeRequest: [
      async options => {
      }
    ],
    afterResponse: [
      async (res, retryWithMergedOptions) => {
        // 此时的 body 是 string, 没法和 axios 一样用 data
        return res
      }
    ]
  }
})

export default http
