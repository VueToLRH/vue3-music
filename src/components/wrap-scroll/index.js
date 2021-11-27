import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import Scroll from '@/components/base/scroll/scroll'
import { useStore } from 'vuex'

export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps(
        {
          ref: 'scrollRef'
        },
        ctx.$props,
        {
          onScroll: e => {
            ctx.$emit('scroll', e)
          }
        }
      ),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')]
        })
      }
    )
  },
  setup() {
    const scrollRef = ref(null)
    const scroll = computed(() => {
      return scrollRef.value.scroll
    })

    const store = useStore()
    const playlist = computed(() => store.state.playlist)

    watch(playlist, async () => {
      // nextTick() 将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它。
      await nextTick()
      scroll.value.refresh()
    })

    return {
      scrollRef,
      scroll
    }
  }
}
