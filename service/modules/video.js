import btRequest from '../index'

/**
 * 请求 Top MV
 * @param {number} offset 偏移量
 * @param {number} limit 每次请求多少条数据
 */
export function getTopMV(offset, limit = 10) {
  return btRequest.get('/top/mv', { offset, limit })
}

/**
 * 请求 MV 的播放地址
 * @param {number} id MV 的 id
 */
export function getMVURL(id) {
  return btRequest.get('/mv/url', {
    id
  })
}

/**
 * 请求 MV 的详情
 * @param {number} mvid MV 的 id
 */
export function getMVDetail(mvid) {
  return btRequest.get('/mv/detail', {
    mvid
  })
}

/**
 * 请求与该 MV 相关的 MVs
 * @param {number} id MV 的 id
 */
export function getRelatedVideo(id) {
  return btRequest.get('/related/allvideo', {
    id
  })
}