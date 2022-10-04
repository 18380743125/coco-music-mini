import {
  getMVURL,
  getMVDetail,
  getRelatedVideo
} from '../../service/modules/video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVideos: []
  },

  // 获取页面数据
  getPageData(id) {
    // 请求播放地址
    getMVURL(id).then(res => {
      this.setData({
        mvURLInfo: res.data
      })
    })
    // 请求视频信息
    getMVDetail(id).then(res => {
      this.setData({
        mvDetail: res.data
      })
    })
    // 请求相关视频
    getRelatedVideo(id).then(res => {
      this.setData({
        relatedVideos: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    // 网络请求
    this.getPageData(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})