const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString) {
  const lyrics = []
  const lyricStrings = lyricString.split('\n')
  for(const lineString of lyricStrings) {
    if(!lineString) continue
    // 获取时间
    const timeResult = timeRegExp.exec(lineString)
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millisecond = timeResult[3] * 1
    const time = minute + second + millisecond
    // 获取歌词文本
    const lyricText = lineString.replace(timeRegExp, '')
    lyrics.push({ time, lyricText })
  }
  return lyrics
}