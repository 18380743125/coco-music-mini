import btRequest from '../index'

// 获取轮播图列表
export function getBanners() {
  return btRequest.get('/banner', {
    type: 2
  })
}

// 根据歌单 id 获取歌曲列表
export function getSongList(id = 3778678, offset = 0, limit = 10) {
  return btRequest.get('/playlist/track/all', {
    id,
    offset,
    limit
  })
}

// 获取榜单
export function getRankings() {
  return btRequest.get('/toplist/detail')
}

//  获取歌单
export function getSongMenu(cat='全部', limit = 6, offset = 0) {
  return btRequest.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}