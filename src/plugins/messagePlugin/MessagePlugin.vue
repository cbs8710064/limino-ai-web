<script setup lang='ts'>

// @unocss-include
import { type Ref, ref } from 'vue';

import { createUUID } from '../../utils/utils';
import { type MessageOptions, type MessageType } from '../../types/plugins';
import { onBeforeRouteUpdate } from 'vue-router';

enum Icons {
    info = 'i-ph-warning-circle-fill',
    warning = 'i-ph-warning-circle-fill',
    error = 'i-typcn-delete',
    loading = 'i-svg-spinners-ring-resize',
    success = 'i-ep-success-filled'
}
const duration = 5000
const opts: Ref<MessageOptions> = ref({
    type: 'info',
    message: 'Message',
    icon: Icons.info,
    duration,
})

const hide = (id?: string) => {
    if (id) {
        const idx = messageList.value.findIndex((item) => item.id === id)
        if (idx > -1) {
            messageList.value.splice(idx, 1);
        }
    } else {
        for (let i = 0; i < messageList.value.length; i++) {
            messageList.value.splice(i, 1)
        }
    }

}
const messageList: Ref<Array<MessageOptions>> = ref([])
const open = (_opts: MessageOptions) => {
    const id = createUUID()
    const delayTime = messageList.value.length * 60 + (_opts.duration || opts.value.duration || duration);
    const opt = { ...opts.value, ..._opts, id, time: delayTime, t: 0 as number }
    if (opt.type !== 'loading') {
        // @ts-ignore
        opt.t = setTimeout(() => {
            hide(id)
        }, delayTime)
    }
    messageList.value.push(opt)

    return () => {
        hide(id)
    }
}

const createOptions = (type: MessageType, message: string, hasClose: boolean = false) => {
    return {
        message,
        icon: Icons[type],
        type,
        hasClose
    }
}

const info = (message: string) => {
    const type: MessageType = 'info'
    return open(createOptions(type, message))
}
const success = (message: string) => {
    const type: MessageType = 'success'
    return open(createOptions(type, message))
}
const warning = (message: string) => {
    const type: MessageType = 'warning'
    return open(createOptions(type, message))
}
const error = (message: string) => {
    const type: MessageType = 'error'
    return open({ ...createOptions(type, message, true), duration: 180000 })
}
const loading = (message: string) => {
    const type: MessageType = 'loading';
    return open(createOptions(type, message))
}
onBeforeRouteUpdate(() => {
    hide()
})

const clear = hide;
defineExpose({
    open,
    info,
    success,
    warning,
    error,
    loading,
    clear
})
</script>
<template>
    <div class="message-box fixed left-50% top-8 z-1200 ml--40 flex flex-col items-center justify-center w-80 lg:ml--100 lg:w-200">
        <TransitionGroup name="message-slide">
            <div class="message relative mb-2.2 max-w-90vw px-4 py-2 rounded-2" v-for="item in messageList" :key="item.id">
                <!-- <i class="i-material-symbols-close-rounded font-size-4.4 absolute right-1 top-1" @click.stop="hide(item.id)"></i> -->
                <div class="scrollbar-none msg-container max-h-80vh w-100% flex items-center justify-center overflow-y-scroll">
                    <div class="scrollbar-none flex justify-start overflow-y-scroll break-all">
                        <div class="flex items-center justify-center w-10">
                            <i v-if="item.icon" :class="`${item.icon} ${item.type} font-size-6 lg:font-size-6 mr-2`"></i>
                        </div>
                        <div class="scrollbar-none flex items-center justify-center overflow-y-scroll break-normal">{{ item.message }}</div>
                    </div>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>
<style scoped>
.message {
    background: #fff;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.03), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.03);
    pointer-events: all;
    z-index: 1201;
    color: #000;
}

.warning {
    color: #f6be27;
}

.success {
    color: #3aae55;
}

.error {
    color: #d73a49;
}

.msg-container div {
    word-wrap: break-word;
}
</style>