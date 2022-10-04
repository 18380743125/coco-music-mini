import { NavBarHeight, lyricHeight } from '../../constant/index'
import { audioContext, playerStore } from '../../store/index'

Page({
  data: {
    currentPage: 0, // 当前页面 歌曲 | 歌词
    contentHeight: 0, // 内容区域的高度
    isMusicLyric: true, // 歌曲页面是否显示歌词
    sliderValue: 0, // 滑块的值
    isSliderChanging: false, // 滑块是否正在被改变
    lyricScrollTop: 0, // 歌词页面向上滚动的距离

    id: 0, // 歌曲 id
    currentSong: {}, // 当前播放的歌曲信息,
    isPlaying: false, // 是否正在播放
    playingName: 'pause',
    currentTime: 0, // 当前时间
    durationTime: 0, // 歌曲总时长
    lyricInfos: [], // 歌词
    currentLyricIndex: 0, // 当前歌词索引
    currentLyricText: '', // 当前歌词文本
    playModeIndex: 0, // 播放模式
    playModeName: 'order'
  },

  // 事件处理
  handleSwiperChange(e) {
    const current = e.detail.current
    this.setData({ currentPage: current })
  },
  // 处理滑块的变化
  handleSliderChange(e) {
    const value = e.detail.value
    // 根据滚动条的 value 计算出当前播放时间
    const currentTime = this.data.durationTime * value / 100
    // audioContext.pause()
    audioContext.seek(currentTime / 1000)
    // 记录最新的 sliderValue
    this.setData({ sliderValue: value, isSliderChanging: false })
  },
  // 处理滑块正在改变
  handleSliderChanging(e) {
    const value = e.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime })
  },
  // 处理导航返回
  handleBackClick() {
    wx.navigateBack()
  },
  // 处理播放模式点击
  handleModeBtnClick() {
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0
    playerStore.setState('playModeIndex', playModeIndex)
  },
  // 播放与暂停的点击
  handlePlayingBtnClick() {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  },
  // 处理点击上一首
  handlePrevBtnClick() {
    playerStore.dispatch('changeNewMusicAction', false)
  },
  // 处理点击下一首
  handleNextBtnClick() {
    playerStore.dispatch('changeNewMusicAction')
  },

  // 监听 playerStore 中状态的变化
  setupPlayStoreListener() {
    playerStore.onStates(['currentSong', 'durationTime', 'lyricInfos'], (res) => {
      const { currentSong, durationTime, lyricInfos } = res
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })
    // 监听 currentTime currentLyricIndex currentLyricText
    playerStore.onStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], res => {
      const { currentTime, currentLyricIndex, currentLyricText } = res
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * lyricHeight })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })
    // 监听播放模式相关的数据
    playerStore.onStates(['playModeIndex', 'isPlaying'], ({ playModeIndex, isPlaying }) => {
      if (playModeIndex !== undefined) {
        const playModeNames = ['order', 'repeat', 'random']
        this.setData({ playModeIndex, playModeName: playModeNames[playModeIndex] })
      }
      if (isPlaying !== undefined) {
        const playingName = isPlaying ? 'pause' : 'resume'
        this.setData({ isPlaying, playingName })
      }
    })
  },

  async onLoad(options) {
    const id = options.id
    this.setData({ id })
    // 监听 playerStore 中状态的变化
    this.setupPlayStoreListener()
    // 动态计算内容区域高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const contentHeight = screenHeight - statusBarHeight - NavBarHeight
    // 设备的宽高比
    const deviceRadio = globalData.deviceRadio
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })
  },

  onUnload() {
  },
})