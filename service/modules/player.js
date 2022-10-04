import btRequest from '../index'

// 获取歌曲详细信息
export function getSongDetail(ids) {
  return btRequest.get('/song/detail', {
    ids
  })
}

// 获取歌曲播放链接
export function getSongUrl(id) {
  return btRequest.get('/song/url', { id })
}

// 获取歌词
export function getSongLyric(id) {
  return btRequest.get('/lyric', {
    id
  })
}
