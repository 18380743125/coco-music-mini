import {
  getTopMV
} from '../../service/modules/video'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    topMvs: [],
    hasMore: true
  },

  // 封装网络请求的方法
  async getTopMVData(offset) {
    // 判断是否还有更多数据
    if (!this.data.hasMore) return
    // 展示加载动画
    wx.showNavigationBarLoading()
    // 真正请求数据
    const res = await getTopMV(offset)
    let newData = this.data.topMvs
    if (offset === 0) {
      newData = res.data
    } else {
      newData = [...newData, ...res.data]
    }
    // 设置数据
    this.setData({
      topMvs: newData
    })
    this.setData({
      hasMore: res.hasMore
    })
    wx.hideNavigationBarLoading()
    if (offset === 0) {
      wx.stopPullDownRefresh()
    }
  },

  // 监听事件处理的方法
  handleVideoItemClick(e) {
    const id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.getTopMVData(0)
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
  async onPullDownRefresh() {
    this.getTopMVData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    this.getTopMVData(this.data.topMvs.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})