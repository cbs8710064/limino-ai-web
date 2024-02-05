<script setup lang='ts'>
import { watch, ref } from 'vue';
import useKeyEventAddlistener from '../hooks/useKeyEventAddlistener';
import { useI18n } from 'vue-i18n';
import TheButton from '@/components/TheButton.vue';
import useLockBodyScroll from '../hooks/useLockBodyScroll';
const { lockBodyScroll, unLockBodyScroll } = useLockBodyScroll()
const props = defineProps<{
    modelValue: boolean;
    title?: string;
    hasFooter?: boolean;
    loading?: boolean;
    className?: string;
    cancelText?: string;
    confirmText?: string;
    description?: string;
    keyboard?: boolean;
    hasClose?: boolean;
    clickClose?: boolean;
    hasMask?: boolean
    lockScroll?: boolean
}>()

const { t } = useI18n()

const confirmLoading = ref(false)
const emits = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
    (e: 'cancel'): void
    (e: 'confirm', fun: Function): void
}>()
const closeModal = () => {
    emits('update:modelValue', false)
}
const closeLoading = () => {
    confirmLoading.value = false
    closeModal()
}
let removeEvent: Function | undefined;

watch(() => props.modelValue, (n) => {
    if (n) {
        if (props.keyboard) {
            removeEvent = useKeyEventAddlistener('keydown', (e) => {
                if (e.key === 'Escape') {
                    handleCancel()
                }
                if (e.key === 'Enter') {
                    handleConfirm()
                }
            })
        }
        if (props.lockScroll) {
            lockBodyScroll()
        }
    } else {
        closeLoading()
        removeEvent ? removeEvent() : ''
        if (props.lockScroll) {
            unLockBodyScroll()
        }
    }
}, {
    immediate: true,
})

const handleClose = () => {
    closeModal()
}
const handleCancel = () => {
    emits('cancel')
    closeModal()
}

const handleConfirm = () => {
    emits('confirm', closeLoading)
    if (!props.loading) {
        closeModal()
    } else {
        confirmLoading.value = true;
    }
}

const handleMaskClose = () => {
    if (!props.clickClose) {
        return
    }
    handleCancel()
}


</script>
<template>
    <div class="the-modal-component">
        <Transition name="fade">
            <div class="mask" v-if="props.modelValue && hasMask"></div>
        </Transition>
        <Transition name="modal">
            <div v-if="props.modelValue" :class="`modal-con ${className}`">
                <div class="min-h-100vh w-100% flex items-center justify-center" @click.self="handleMaskClose">
                    <div class="the-modal my-10">
                        <div v-if="hasClose" class="close-btn">
                            <i class="closeIcon i-material-symbols-close-rounded cursor-pointer font-size-7" @click.self="handleClose"></i>
                        </div>
                        <slot name="title">
                            <div class="the-modal-tit font-size-5" v-if="title">{{ title }}</div>
                        </slot>
                        <div class="the-modal-body mt-2 lg:mt-4">
                            <div class="mb-3 font-size-4 lg:mb-6">
                                <slot>{{ description }}</slot>
                            </div>
                        </div>
                        <slot name="footer" v-if="hasFooter">
                            <div class="btn-box">
                                <TheButton class="default mr-10 lh-10 w-35" @click="handleCancel">{{ cancelText || t('components.theModal.cancelText') }}</TheButton>
                                <TheButton type="primary" :loading="confirmLoading" class="lh-10 w-35" @click="handleConfirm">
                                    {{ confirmText || t('components.theModal.confirmText') }}
                                </TheButton>
                            </div>
                        </slot>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>
<style scoped lang="scss">
.the-modal {
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.03), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.03);
    background: #fff;
    --at-apply: relative mx-4 h-auto min-h-30 p-4 w-150 rounded-2 lg:m-0 lg:p-6;
}

.mask {
    background: rgba(0, 0, 0, .6);
    --at-apply: fixed bottom-0 left-0 top-0 z-1099 overflow-hidden right-0;
}

.modal-con {
    --at-apply: fixed left-0 right-0 bottom-0 top-0 z-1100 overflow-hidden;
}

.close-btn {
    --at-apply: absolute top-0 flex justify-end px-2 py-2 right-0 lg:px-4 lg:py-4;
}

.btn-box {
    --at-apply: flex justify-evenly pt-2 lg:justify-center lg:pt-4;
}

.the-modal i,
.the-modal-tit,
.the-modal-body,
.btn-box i {
    color: #0d0d0d;
}
</style>