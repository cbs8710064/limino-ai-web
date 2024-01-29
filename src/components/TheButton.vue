
<script setup lang='ts'>
import { type ButtonType } from '../types/components';

const props = defineProps<{
    loading?: boolean;
    type?: ButtonType;
    rounded?: boolean;
    className?: string;
}>()

const emits = defineEmits<{
    (e: 'click'): void
}>()

const handleClick = () => {
    if (!props.loading) {
        emits('click')
    }
}
</script>
<template>
    <div :class="`btn ${rounded ? 'rounded-full' : 'rounded-2'} ${type} ${loading ? 'disabled' : ''} ${className}`" @click.stop="handleClick">
        <i v-if="loading" class="i-svg-spinners-ring-resize mr-2 font-size-5"></i>
        <slot></slot>
    </div>
</template>
