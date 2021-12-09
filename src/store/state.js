import { PLAY_MODE, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  sequenceList: [], // 歌单列表
  playlist: [], // 播放列表
  playing: false, // 播放状态 - 是否播放
  playMode: PLAY_MODE.sequence, // 播放模式，默认为顺序模式
  currentIndex: 0, // 当前播放索引
  fullScreen: false, // 播放状态 - 是否全屏展示
  favoriteList: [],
  searchHistory: load(SEARCH_KEY),
  playHistory: []
}

export default state
