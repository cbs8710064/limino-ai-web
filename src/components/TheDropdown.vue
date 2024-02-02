
<script setup lang='ts'>
import { ref, type Ref, onMounted, onUnmounted, computed } from 'vue';

import type { DropdownOption, DropTrigger, DropAlign } from '@/types/components';
import { useDocumentClick } from '@/hooks/useDocumentClick';

const triggerRef: Ref<HTMLElement | undefined> = ref()

const props = defineProps<{
    modelValue?: string | number;
    options: Array<DropdownOption>;
    trigger?: DropTrigger;
    alignDirection?: DropAlign;
    hasSelectedIcon?: boolean
}>()
const show = ref(false)
const emits = defineEmits<{
    (e: 'change', val: DropdownOption): void
    (e: 'update:modelValue', val: DropdownOption): void
}>()

const handleChange = (item: DropdownOption) => {
    emits('change', item)
    show.value = false
}
const handleClick = (e: Event) => {
    e.stopPropagation();
    show.value = !show.value
}

const alignClass = computed(() => {
    if (props.alignDirection) {
        switch (props.alignDirection) {
            case 'left':
                return 'left-0'
            case 'center':
                return ''
            case 'right':
                return 'right-0'
            default:
                return 'left-0'
        }
    }
    return 'left-0'
})
const mountedTrigger = props.trigger === 'click' ? 'click' : !props.trigger ? 'click' : 'touchstart'
onMounted(() => {
    triggerRef.value?.addEventListener(mountedTrigger, handleClick)
})

onUnmounted(() => {
    triggerRef.value?.removeEventListener(mountedTrigger, handleClick)
})
useDocumentClick(() => {
    show.value = false
})

</script>
<template>
    <div class="the-dropdown lh-6">
        <div class="the-dropdown-container relative">
            <span class="the-dropdown-trigger-ele" ref="triggerRef">
                <slot></slot>
            </span>
            <Transition name="slide-up">
                <div :class="`the-dropdown-options rounded-1 absolute ${alignClass} px-1 py-1 z-10`" v-if="show">
                    <div :class="`options-card select-none px-3 rounded-1  lh-8  cursor-pointer ${props.modelValue === item.value ? 'active' : ''}`" v-for="(item) in options" :key="item.value" @click.stop="handleChange(item)">
                        <div class="w-[max-content] flex items-center justify-start py-1 lh-6">
                            <div v-if="hasSelectedIcon" class="ml--2 flex items-center justify-start w-6 h-6">
                                <i class="i-mdi-check-bold" v-if="props.modelValue === item.value"></i>
                            </div>
                            <i v-show="item.icon" :class="['mr-1 font-size-5', item.icon]"></i>
                            <div class="font-size-4">{{ item.label }}</div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>
<style scoped>
.the-dropdown-options {
    border: 1px solid #f7e5c5;
    background-color: #ffffff;
    color: #0d0d0d;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.options-card:hover {
    background-color: #eeeeee;
    color: #0d0d0d;
}

.options-card.active {
    color: #9f54ba;
}
</style>