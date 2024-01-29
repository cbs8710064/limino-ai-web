import { type App,render,type VNode,createVNode } from "vue"

import MessagePlugin from './MessagePlugin.vue'
import type { MessageOpenFuns } from "@/types/plugins"


export default {
    install: (app: App) => {
        const rootBox = document.body
        const ele = document.createElement('div')
        rootBox.appendChild(ele)
        const vnode: VNode = createVNode(MessagePlugin)
        render(vnode, ele)
        const message: MessageOpenFuns = {
            info: (msg: string) => vnode.component?.exposed?.info(msg),
            success: (msg: string) => vnode.component?.exposed?.success(msg),
            warning: (msg: string) => vnode.component?.exposed?.warning(msg),
            error: (msg: string) => vnode.component?.exposed?.error(msg),
            loading: (msg: string) => vnode.component?.exposed?.loading(msg),
            open: (opt: MessageOpenFuns) => vnode.component?.exposed?.open(opt),
            clear: () => vnode.component?.exposed?.clear() 
        }
        app.config.globalProperties.$message = message
    }
  }