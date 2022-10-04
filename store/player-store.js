import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongUrl, getSongLyric } from '../service/modules/player'
import { parseLyric } from '../utils/parse-lyric'

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    isFirstPlaying: true,
    id: 0,
    currentSong: {}, // 当前播放的歌曲信息,
    songUrl: '', // 当前播放歌曲的 url
    isPlaying: false,
    currentTime: 0, // 当前时间
    durationTime: 0, // 歌曲总时长

    lyricInfos: [], // 歌词
    currentLyricIndex: 0, // 当前歌词索引
    currentLyricText: '', // 当前歌词文本

    playModeIndex: 0, // 0: 循环播放 1: 单曲循环 2: 随机播放 
    playListSongs: [], // 播放列表
    playListIndex: 0, // 当前播放所处列表中的索引

  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      if (id === ctx.id && !isRefresh) {
        this.dispatch('changeMusicPlayStatusAction', true)
        return
      }
      ctx.id = id
      // 重置状态
      ctx.currentSong = {}
      ctx.isPlaying = false
      ctx.currentTime = 0
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ''
      // 获取歌曲信息
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      // 获取歌词
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })
      // 获取歌曲 url
      getSongUrl(id).then(res => {
        audioContext.stop()
        ctx.songUrl = res.data[0].url
        audioContext.src = ctx.songUrl
        audioContext.title = id
      })
      if (ctx.isFirstPlaying) {
        this.dispatch('setupAudioContextListener')
        ctx.isFirstPlaying = false
      }
    },
    // 监听事件
    setupAudioContextListener(ctx) {
      audioContext.onCanplay(() => {
        audioContext.play()
        ctx.isPlaying = true
      })
      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000
        ctx.currentTime = currentTime
        // 根据当前播放时间查找歌词
        const lyricInfos = ctx.lyricInfos
        const currentLyricIndex = ctx.currentLyricIndex
        let i = 0
        if (!lyricInfos.length) return
        // 找到当前歌词索引
        for (; i < lyricInfos.length; i++) {
          const lyricInfo = lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            break
          }
        }
        let currentIndex = i - 1
        if (currentIndex === -1) currentIndex = 0

        // 是否切换了歌词
        if (currentLyricIndex !== currentIndex) {
          const currentLyricInfo = lyricInfos[currentIndex]
          ctx.currentLyricText = currentLyricInfo.lyricText
          ctx.currentLyricIndex = currentIndex
        }
      })
      // 监听歌曲播放结束
      audioContext.onEnded(() => {
        this.dispatch('changeNewMusicAction')
      })
      // 监听音乐的暂停 / 播放
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      
    },
    // 播放与暂停
    changeMusicPlayStatusAction(ctx, isPlaying) {
      ctx.isPlaying = isPlaying
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    // 切换歌曲
    changeNewMusicAction(ctx, isNext = true) {
      let index = ctx.playListIndex
      const songlistLen = ctx.playListSongs.length
      switch (ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1
          if (index === -1) index = songlistLen - 1
          if (index === songlistLen) index = 0
          break
        case 1: // 单曲循环
          break
        case 2: // 随机播放
          index = Math.floor(Math.floor(Math.random() * songlistLen))
          break
      }
      // 获取歌曲
      let currentSong = ctx.playListSongs[index]
      ctx.playListIndex = index
      // 播放新的歌曲
      this.dispatch('playMusicWithSongIdAction', { id: currentSong.id, isRefresh: true })
    },
  }
})

export {
  audioContext,
  playerStore
}
