// components/navigation-bar/index.js
Component({
  properties: {
    title: {
      type: String,
      value: '默认标题'
    }
  },

  options: {
    multipleSlots: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleLeftClick() {
      this.triggerEvent('click')
    }
  }
})
