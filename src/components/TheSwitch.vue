<template>
    <button :class="`rounded w-11 h-6.6 rounded-full px-0.9 the-switch items-center justify-center  ${readonly ? 'cursor-not-allowed' : 'cursor-pointer'} ${modelValue ? 'on' : 'off'}`" @click="handleClick">
        <div class="dot flex items-center justify-center rounded-[100%] duration-300 transition-ease w-5 h-5">
            <slot name="icon"></slot>
        </div>
    </button>
</template>
<script lang="ts" setup>
const props = defineProps<{
    modelValue?: boolean
    readonly?: boolean
}>()

const emits = defineEmits<{
    (e: 'change', val: boolean): void
    (e: 'update:modelValue', val: boolean): void
}>()

const handleClick = () => {
    if (props.readonly) {
        return
    }
    const val = !props.modelValue
    emits('update:modelValue', val)
    emits('change', val)
}
</script>
<style scoped lang="scss">
.the-switch {
    border: 1px solid #eee;
    background-color: #ccc;
}

.the-switch:hover {
    border-color: #ccc;
}

.dot {
    background-color: #fff;
}

.the-switch.cursor-not-allowed.on {
    background-color: #ba85cd;
}

.the-switch.on {
    background-color: #9f54ba;
}

.the-switch.on .dot {
    transform: translate(16px);
}

.the-switch.off .dot {
    transform: translate(0);
}</style>