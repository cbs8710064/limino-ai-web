<script setup lang='ts'>
import { ref } from 'vue';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
const { lockBodyScroll, unLockBodyScroll } = useLockBodyScroll()
const loading = ref(false)
const open = () => {
    lockBodyScroll()
    loading.value = true
}

const close = () => {
    unLockBodyScroll()
    loading.value = false
}

defineExpose({
    open,
    close
})
</script>
<template>
    <div>
        <Transition name="fade-in">
            <div class="loading fixed bottom-0 left-0 top-0 right-0" v-if="loading">
                <div class="loading-box h-100vh w-100% flex items-center justify-center">
                    <i class="i-svg-spinners-ring-resize font-size-12 color-#1677ff"></i>
                </div>
            </div>
        </Transition>
    </div>
</template>
<style scoped lang='scss'>
.loading {
    background-color: rgba(255, 255, 255, .4);
}
</style>