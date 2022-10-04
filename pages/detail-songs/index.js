import {
  getSongList
} from '../../service/modules/music'
import { playerStore } from '../../store/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    songList: [],
  },

  handleSongItemClick(e) {
    const index = e.currentTarget.dataset.index
    playerStore.setState('playListSongs', this.data.songList)
    playerStore.setState('playListIndex', index)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    const name = options.name
    // 获取歌曲列表
    getSongList(id, 0, 50).then(res => {
      this.setData({
        name,
        songList: res.songs
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  onPullDownRefresh() {

  },

  onReachBottom() {

  }
})