import {
  HYEventStore
} from 'hy-event-store'
import {
  getRankings
} from '../service/modules/music'

const rankingStore = new HYEventStore({
  state: {
    upRanking: {},
    newRanking: {},
    originRanking: {},
    hotRanking: {},
  },
  actions: {
    // 获取榜单数据
    getRankingDataAction(context) {
      const topMap = {
        0: 'upRanking',
        1: 'newRanking',
        2: 'originRanking',
        3: 'hotRanking'
      }
      getRankings().then(res => {
        const topList = res.list.slice(0, 4)
        for (let i = 0; i < 4; i++) {
          context[topMap[i]] = topList[i]
        }
      })
    }
  }
})

export {
  rankingStore
}