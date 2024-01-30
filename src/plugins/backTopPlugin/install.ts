import { type App, render, type VNode, createVNode } from 'vue'

import BackTop from './BackTop.vue'
import type { BackTopOptions } from '@/types/plugins'

export default {
  install: (app: App, options?: BackTopOptions) => {
    const rootBox = document.body
    const ele = document.createElement('div')
    rootBox.appendChild(ele)
    const vnode: VNode = createVNode(BackTop)
    render(vnode, ele)
    vnode.component?.exposed?.setOptions(options ? options : {})
  }
}
