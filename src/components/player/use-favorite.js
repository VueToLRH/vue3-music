import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList) // 收藏列表
  const maxLen = 100 // 最大收藏数量

  // 获取收藏 icon class样式
  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 切换收藏
  function toggleFavorite(song) {
    let list
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare) // 移除收藏歌曲
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen) // 添加收藏歌曲
    }
    store.commit('setFavoriteList', list) // 设置收藏歌曲列表

    function compare(item) {
      return item.id === song.id
    }
  }

  // 是否收藏
  function isFavorite(song) {
    return (
      favoriteList.value.findIndex(item => {
        return item.id === song.id
      }) > -1
    )
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
