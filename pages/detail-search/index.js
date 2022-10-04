import { getSearchHot, getSearchSuggest, getSearchResult } from '../../service/modules/search'
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/string2nodes'
import { playerStore } from '../../store/index'

const debounceGetSearchSuggest = debounce(getSearchSuggest)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],
    searchValue: '',
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: []
  },

  // 网络请求
  getPageData() {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },

  // 事件处理
  handleSearchChange(e) {
    const searchValue = e.detail
    this.setData({ searchValue })
    if (!(searchValue.trim()).length) {
      this.setData({ suggestSongs: [], resultSongs: [] })
      debounceGetSearchSuggest.cancel()
      return
    }
    // 获取搜索的歌曲
    debounceGetSearchSuggest(this.data.searchValue).then(res => {
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })
      // 转成 nodes 节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(searchValue, keyword)
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },
  // 处理搜索事件
  handleSearchAction() {
    const searchValue = this.data.searchValue
    if (!searchValue.trim().length) return
    getSearchResult(searchValue).then(res => {
      this.setData({ resultSongs: res.result.songs })
    })
  },
  // 处理关键字的点击
  handleKeywordItemClick(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ searchValue: keyword })
    this.handleSearchAction()
  },
  // 处理点击歌曲项
  handleSongItemClick(e) {
    const index = e.currentTarget.dataset.index
    playerStore.setState('playListSongs', this.data.resultSongs)
    playerStore.setState('playListIndex', index)
  },

  onLoad(options) {
    this.getPageData()
  },

  onUnload() {

  },
})