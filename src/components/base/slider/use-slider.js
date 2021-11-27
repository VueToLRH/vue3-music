import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0) // 当前 slider 页面索引值

  onMounted(() => {
    const sliderVal = (slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true, // 当值为 true 时，设置 slide 的方向为横向
      scrollY: false, // 当值为 true 时，设置 slide 的方向为纵向。 注意: scrollX 和 scrollY 不能同时设置为 true
      momentum: false, // 当使用 slide 时，这个值需要设置为 false，用来避免惯性动画带来的快速滚动时的闪烁的问题和快速滑动时一次滚动多页的问题。
      bounce: false, // bounce 值需要设置为 false，否则会在循环衔接的时候出现闪烁
      probeType: 2, // 通过监听 slideWillChange 事件，在用户拖动 slide 时，实时获取到 slide 的 PageIndex 的改变，需要设置 probeType 值为 2 或者 3
      slide: true // 开启 slide 功能
    }))

    sliderVal.on('slideWillChange', page => {
      currentPageIndex.value = page.pageX
    })
  })

  onUnmounted(() => {
    slider.value.destroy() // destroy() - 销毁 BetterScroll，解绑事件
  })

  onActivated(() => {
    slider.value.enable() // enable() - 启用 BetterScroll, 默认 开启。
    slider.value.refresh() // refresh() - 重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
  })

  onDeactivated(() => {
    slider.value.disable() // disable() - 禁用 BetterScroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。
  })

  return {
    slider,
    currentPageIndex
  }
}
