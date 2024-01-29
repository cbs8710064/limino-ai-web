<script setup lang='ts'>
import { type Ref, ref } from 'vue';
import { createUUID } from '../../utils/utils';
import type { MessageOptions, MessageType } from '@/types/plugins';
import type { NoticeOpenOpts } from '../../types/plugins';
import { type NoticeOption } from '../../types/plugins';

enum Icons {
    info = 'i-ph-warning-circle-fill',
    warning = 'i-ph-warning-circle-fill',
    error = 'i-typcn-delete',
    loading = 'i-svg-spinners-ring-resize',
    success = 'i-ep-success-filled'
}
const duration = 8000
const opts: Ref<MessageOptions> = ref({
    type: 'info',
    message: 'Message',
    icon: "",
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
const messageList: Ref<Array<NoticeOption>> = ref([])
const open = (_opts: NoticeOption) => {
    const id = createUUID()
    const delayTime = messageList.value.length * 60 + (opts.value.duration || duration);
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
const createOptions = (type: MessageType, title: string, description: string) => {
    return {
        message: description,
        icon: Icons[type],
        type,
        title
    }
}
const info = ({ description, title }: NoticeOpenOpts) => {
    const type: MessageType = 'info'
    return open(createOptions(type, title, description))
}
const success = ({ description, title }: NoticeOpenOpts) => {
    const type: MessageType = 'success'
    return open(createOptions(type, title, description))
}
const warning = ({ description, title }: NoticeOpenOpts) => {
    const type: MessageType = 'warning'
    return open(createOptions(type, title, description))
}
const error = ({ description, title }: NoticeOpenOpts) => {
    const type: MessageType = 'error'
    return open(createOptions(type, title, description))
}
const loading = ({ description, title }: NoticeOpenOpts) => {
    const type: MessageType = 'loading';
    return open(createOptions(type, title, description))
}

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
    <div class="fixed top-4 z-1000 ml--35 flex flex-col items-end justify-end right-4 w-20 lg:ml--50 lg:w-80">
        <TransitionGroup name="notice-slide">
            <div class="notice mb-3 w-60 rounded-2 lg:w-80" v-for="item in messageList" :key="item.id">
                <div class="relative px-4 pb-4 pt-2">
                    <div class="absolute right-0.6 top-0.6 cursor-pointer" @click.stop="hide(item.id)"><i class="i-material-symbols-close-small-outline-rounded font-size-8"></i></div>
                    <div class="flex items-start justify-start">
                        <div class="mr-0.5 flex items-center w-5 lg:mr-1"><i v-if="item.icon" :class="`${item.icon} ${item.type} font-size-4 mt-1.4 lg:mt-1 lg:font-size-5`"></i></div>
                        <div class="pr-4 font-size-4">{{ item.title }}</div>
                    </div>
                    <div class="notice-msg-container flex items-center justify-start pt-3">
                        <div class="font-size-3">{{ item.message }}</div>
                    </div>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>
<style scoped>
.notice {
    background: var(--message-bg);
    box-shadow: var(--message-box-shadow);
    pointer-events: all;
    z-index: 1101;
    color: var(--message-color);
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
</style>