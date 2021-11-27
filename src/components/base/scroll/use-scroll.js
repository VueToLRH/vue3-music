import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(ObserveDOM)

// observe-dom 插件
// 开启对 content 以及 content 子元素 DOM 改变的探测。当插件被使用后，当这些 DOM 元素发生变化时，将会触发 scroll 的 refresh 方法

export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true, // 开启 observe-dom 插件
      ...options
    }))

    // probeType 决定是否派发 scroll 事件，对页面的性能有影响，尤其是在 useTransition 为 true 的模式下。
    // 1. probeType 为 0，在任何时候都不派发 scroll 事件，
    // 2. probeType 为 1，仅仅当手指按在滚动区域上，每隔 momentumLimitTime 毫秒派发一次 scroll 事件，
    // 3. probeType 为 2，仅仅当手指按在滚动区域上，一直派发 scroll 事件，
    // 4. probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
    if (options.probeType > 0) {
      scrollVal.on('scroll', pos => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy() // destroy() - 销毁 BetterScroll，解绑事件
  })

  onActivated(() => {
    scroll.value.enable() // enable() - 启用 BetterScroll, 默认 开启。
    scroll.value.refresh() // refresh() - 重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
  })

  onDeactivated(() => {
    scroll.value.disable() // disable() - 禁用 BetterScroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。
  })

  return scroll
}
