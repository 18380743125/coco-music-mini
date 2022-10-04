import {
  rankingStore,
  playerStore
} from '../../store/index'
import {
  getBanners,
  getSongMenu,
  getSongList
} from '../../service/modules/music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 1000, { trailing: true })

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: 0,
    banners: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    rankings: {
      0: {},
      1: {},
      2: {},
      3: {}
    },
    recommendSongs: [],

    currentSong: {},
    isPlaying: false
  },

  // 事件处理
  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  // 获取图片高度
  handleSwiperImageLoaded() {
    throttleQueryRect('.swiper-image').then(res => {
      const rect = res[0]
      this.setData({
        swiperHeight: (rect?.height && rect.height * 2 - 30) || 240
      })
    })
  },
  handleMoreSongsClick() {
    wx.navigateTo({
      url: `/pages/detail-songs/index?id=3778678&name=推荐歌曲`,
    })
  },
  handleRankingItemClick(e) {
    const { id, name } = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail-songs/index?id=${id}&name=${name}`,
    })
  },
  // 处理点击播放按钮
  handlePlayBtnClick() {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  },
  // 处理点击播放工具条
  handlePlayBarClick() {
    const id = this.data.currentSong.id
    wx.navigateTo({
      url: `/pages/music-player/index?id=${id}`,
    })
  },

  // 处理榜单数据
  getRankingHandler: function (idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {
        id: res.id,
        name,
        coverImgUrl,
        playCount,
        songList
      }
      const newRankings = {
        ...this.data.rankings,
        [idx]: rankingObj
      }
      this.setData({
        rankings: newRankings
      })
    }
  },
  // 网络请求
  getPageData() {
    // 获取轮播图数据
    getBanners().then(res => {
      this.setData({
        banners: res.banners
      })
    })
    // 获取推荐歌曲
    getSongList().then(res => {
      this.setData({
        recommendSongs: res.songs
      })
    })
    // 获取热门歌单
    getSongMenu().then(res => {
      this.setData({
        hotSongMenu: res.playlists
      })
    })
    // 获取推荐歌单
    getSongMenu("华语").then(res => {
      this.setData({
        recommendSongMenu: res.playlists
      })
    })
  },
  // 处理推荐歌曲项的点击
  handleSongItemClick(e) {
    const index = e.currentTarget.dataset.index
    playerStore.setState('playListSongs', this.data.recommendSongs)
    playerStore.setState('playListIndex', index)
  },

  // 监听 playerStore 中的状态变化
  setupPlayerStoreListener() {
    // 监听排行榜的数据
    rankingStore.onState('newRanking', this.getRankingHandler(0))
    rankingStore.onState('originRanking', this.getRankingHandler(1))
    rankingStore.onState('upRanking', this.getRankingHandler(2))
    rankingStore.onState('hotRanking', this.getRankingHandler(3))
    // 监听 currentSong
    playerStore.onStates(['currentSong', 'isPlaying'], ({ currentSong, isPlaying }) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined) this.setData({ isPlaying })
    })
  },

  onLoad(options) {
    // 获取页面数据
    this.getPageData()
    // 发起共享数据的请求
    rankingStore.dispatch('getRankingDataAction')
    this.setupPlayerStoreListener()
  },
})