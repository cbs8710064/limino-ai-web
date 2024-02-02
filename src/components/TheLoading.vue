<script setup lang='ts'>
import { defineProps } from 'vue'
defineProps<{
    loading: boolean
}>()
</script>
<template>
    <div class="relative">
        <slot v-if="!loading" class="flex justify-center"></slot>

        <div v-else class="the-loading">
            <div class="load-icon h-100%">
                <i class="i-svg-spinners-ring-resize font-size-10 color-#1677ff"></i>
            </div>
        </div>
    </div>
</template>
<style scoped lang='scss'>
.the-loading {
    --at-apply: flex justify-center items-center w-20 h-20 absolute left-50% top-50% ml--10 mt--10;

    .load-icon {
        --at-apply: flex justify-center items-center;
    }

}
</style>