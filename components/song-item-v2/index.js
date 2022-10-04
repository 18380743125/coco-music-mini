import { playerStore } from '../../store/player-store'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    idx: {
      type: Number,
      value: 0
    },
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSongItemClick() {
      const id = this.properties.item.id
      wx.navigateTo({
        url: `/pages/music-player/index?id=${id}`,
      })
      playerStore.dispatch('playMusicWithSongIdAction', { id })
    }
  }
})
