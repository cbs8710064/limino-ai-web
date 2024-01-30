import { type App, render, type VNode, createVNode } from 'vue'

import LoadingPlugin from './LoadingPlugin.vue'

export default {
  install: (app: App) => {
    const rootBox = document.body
    const ele = document.createElement('div')
    rootBox.appendChild(ele)
    const vnode: VNode = createVNode(LoadingPlugin)
    render(vnode, ele)
    const loading: {
      open: () => void
      close: () => void
    } = {
      open: () => vnode.component?.exposed?.open(),
      close: () => vnode.component?.exposed?.close()
    }
    app.config.globalProperties.$loading = loading
  }
}
