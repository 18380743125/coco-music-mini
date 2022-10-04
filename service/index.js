const BASE_URL = 'http://localhost:3000'

class BTRequest {
  request(url, method, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method,
        data: params,
        success: function (res) {
          resolve(res.data)
        },
        fail: reject
      })
    })
  }
  get(url, params) {
    return this.request(url, 'get', params)
  }
  post(url, data) {
    return this.request(url, 'post', data)
  }
}
const btRequest = new BTRequest()
export default btRequest
