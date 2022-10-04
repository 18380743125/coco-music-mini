import btRequest from '../../service/index'

// 获取热门搜索
export function getSearchHot() {
  return btRequest.get('/search/hot')
}

// 获取推荐搜索
export function getSearchSuggest(keywords) {
  return btRequest.get('/search/suggest', {
    keywords,
    type: 'mobile'
  })
}

// 获取搜索结果
export function getSearchResult(keywords) {
  return btRequest.get('/search', {
    keywords
  })
}