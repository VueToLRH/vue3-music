import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18 // 锚点高度
  const scrollRef = ref(null)

  // 获取锚点列表数据
  const shortcutList = computed(() => {
    return props.data.map(group => {
      return group.title
    })
  })

  const touch = {}

  function onShortcutTouchStart(e) {
    // 获取锚点 DOM 自定义属性值
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY // 记录当前点击的位置
    touch.anchorIndex = anchorIndex // 记录当前锚点的索引值

    scrollTo(anchorIndex) // 滚动到指定位置
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY // 记录当前移动的位置
    // 计算当前的偏移
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex) // 滚动到指定位置
  }

  // 滚动到指定位置
  function scrollTo(index) {
    if (isNaN(index)) {
      return
    }
    // 确保当前索引值不超出索引范围
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
