<script setup lang='ts'>
import useScroll from '../../hooks/useScroll';
import { ref, type Ref } from 'vue';
import { type BackTopOptions } from '../../types/plugins';

const handleToTop = () => {
    window.scrollTo(0, 0)
}

const options: Ref<BackTopOptions> = ref({
    right: '20px',
    bottom: '20px',
    activityTop: 300
})

const setOptions = (opts?: BackTopOptions) => {
    if (opts && typeof opts === 'object') {
        let key: keyof BackTopOptions;
        for (key in opts) {
            if (key === 'right' || key === 'bottom') {
                if (typeof opts[key] === 'number') {
                    opts[key] += 'px'
                };
            }

            if (typeof opts[key] !== 'number' && typeof opts[key] !== 'string') {
                console.error('backTop plugin options types error', typeof opts[key])
            }
        }
        options.value = opts
    }
}

const opacityVal: Ref<number> = ref(0);
const scale: Ref<number> = ref(0);
useScroll(({ top }) => {
    const activityTop = options.value.activityTop || 100
    if (top > activityTop) {
        const realActivityTop = activityTop + 300
        if (top < realActivityTop) {
            const realVal = top / realActivityTop
            opacityVal.value = realVal
            scale.value = realVal
        } else {
            opacityVal.value = 1
            scale.value = 1
        }
    } else {
        opacityVal.value = 0
        scale.value = 0
    }
}, 2)
defineExpose({
    setOptions
})
</script>
<template>
    <div class="back-top fixed z-1111 flex cursor-pointer items-center justify-center rounded-full opacity-0 w-11 h-11 lg:w-14 lg-h-14" :style="{ opacity: opacityVal, scale, ...options }" @click="handleToTop">
        <i class="i-tabler-arrow-up font-size-7 lg:font-size-10"></i>
    </div>
</template>
<style scoped>
.back-top {
    background: #9f54ba;
    transition: ease .3s;
    color: #fff;
}
</style>