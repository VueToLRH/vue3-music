import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

// 全局 class 样式类
// .g-relative {
//   position: relative;
// }
const relativeCls = 'g-relative'

export default function createLoadingLikeDirective(Comp) {
  return {
    // el: 指令绑定到的元素。这可用于直接操作 DOM。
    // binding: 包含以下 property 的对象。
    // > instance：使用指令的组件实例。
    // > value: 传递给指令的值。例如，在 v-my-directive="1 + 1" 中，该值为 2。
    // > oldValue: 先前的值，仅在 beforeUpdate 和 updated 中可用。值是否已更改都可用。
    // > arg: 参数传递给指令 (如果有)。例如在 v-my-directive:foo 中，arg 为 "foo"。
    // > modifiers: 包含修饰符 (如果有) 的对象。例如在 v-my-directive.foo.bar 中，修饰符对象为 {foo: true，bar: true}。
    // > dir: 一个对象，在注册指令时作为参数传递。例如，在以下指令中
    mounted(el, binding) {
      // createApp: 返回一个提供应用上下文的应用实例。应用实例挂载的整个组件树共享同一个上下文。
      const app = createApp(Comp)
      // mount: 根组件实例。所提供 DOM 元素的 innerHTML 将被替换为应用根组件的模板渲染结果。
      const instance = app.mount(document.createElement('div'))
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance
      const title = binding.arg
      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }
      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      const title = binding.arg
      const name = Comp.name
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append(el) {
    const name = Comp.name
    // Window.getComputedStyle()方法返回一个对象
    // 该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值。
    const style = getComputedStyle(el)
    // 处理 loading 组件 CSS 定位
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }

  function remove(el) {
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
