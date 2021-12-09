import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser' // 歌词解析

export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null) // 当前歌曲歌词
  const currentLineNum = ref(0) // 当前播放歌词行号
  const pureMusicLyric = ref('') // 纯音乐歌词
  const playingLyric = ref('') // 播放歌词
  const lyricScrollRef = ref(null) // 歌词列表滚动 Scroll Ref
  const lyricListRef = ref(null) // 歌词列表 Ref

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong) // vuex 获取当前歌曲

  watch(currentSong, async newSong => {
    if (!newSong.url || !newSong.id) {
      return
    }
    stopLyric()
    currentLyric.value = null // 当前歌曲歌词
    currentLineNum.value = 0 // 当前播放歌词行号
    pureMusicLyric.value = '' // 纯音乐歌词
    playingLyric.value = '' // 播放歌词

    const lyric = await getLyric(newSong) // 获取歌词
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    }) // 添加歌曲歌词
    if (currentSong.value.lyric !== lyric) {
      return
    }

    currentLyric.value = new Lyric(lyric, handleLyric) // 解析歌曲歌词
    const hasLyric = currentLyric.value.lines.length // 当前歌曲歌词的行数
    if (hasLyric) {
      // 当浏览器可以播放歌曲是时,开始播放歌词
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  // 播放歌词
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  // 停止播放歌词
  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  // 处理歌词
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum // 播放歌词行号
    playingLyric.value = txt // 播放歌词
    const scrollComp = lyricScrollRef.value // 歌词列表滚动 Scroll
    const listEl = lyricListRef.value // 歌词列表 Ref
    if (!listEl) {
      return
    }
    // 当前播放歌词好号超过 5 行时,开始滚动
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric
  }
}
