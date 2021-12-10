import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/slide'
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad(requestData, preventPullUpLoad) {
  const scroll = ref(null)
  const rootRef = ref(null)
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    }))

    scrollVal.on('pullingUp', pullingUpHandler) // 上拉加载

    async function pullingUpHandler() {
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp() // 结束上拉加载行为
        return
      }
      isPullUpLoad.value = true
      await requestData()
      scrollVal.finishPullUp() // 结束上拉加载行为
      scrollVal.refresh() // 重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    scroll.value.destroy() // 销毁 BetterScroll，解绑事件
  })

  onActivated(() => {
    scroll.value.enable() // BetterScroll 启用，开始响应用户交互
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable() // BetterScroll 禁用，不再响应用户交互
  })

  return {
    scroll,
    rootRef,
    isPullUpLoad
  }
}
