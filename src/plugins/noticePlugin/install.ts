import { type App, render, type VNode, createVNode } from 'vue'

import NoticePlugin from './NoticePlugin.vue'
import type { NoticeOpenFuns, NoticeOpenOpts } from '@/types/plugins'

export default {
  install: (app: App) => {
    const rootBox = document.body
    const ele = document.createElement('div')
    rootBox.appendChild(ele)
    const vnode: VNode = createVNode(NoticePlugin)
    render(vnode, ele)
    const notice: NoticeOpenFuns = {
      info: (opt: NoticeOpenOpts) => vnode.component?.exposed?.info(opt),
      success: (opt: NoticeOpenOpts) => vnode.component?.exposed?.success(opt),
      warning: (opt: NoticeOpenOpts) => vnode.component?.exposed?.warning(opt),
      error: (opt: NoticeOpenOpts) => vnode.component?.exposed?.error(opt),
      loading: (opt: NoticeOpenOpts) => vnode.component?.exposed?.loading(opt),
      open: (opt: NoticeOpenFuns) => vnode.component?.exposed?.open(opt),
      clear: () => vnode.component?.exposed?.clear()
    }
    app.config.globalProperties.$notice = notice
  }
}
