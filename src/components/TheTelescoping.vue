
<script setup lang='ts'>
import { ref, computed, onMounted } from 'vue';
import { getSystemInfo } from '../utils/utils';
type Direction = 'left' | 'right'
const props = defineProps<{
    direction: Direction;
    width: string
}>()
const show = ref(true)

const handleToggle = () => {
    show.value = !show.value
}
let systemInfo = ref(getSystemInfo())
onMounted(() => {
    window.addEventListener('resize', () => {
        systemInfo.value = getSystemInfo()
    })
})
</script>
<template>
    <div class="the-telescoping relative lg:min-h-100" :style="{ width: show ? systemInfo.isPC ? width : '100%' : '0px' }">
        <div class="the-telescoping-box relative overflow-hidden" :style="{ width: systemInfo.isPC ? width : '100%' }">
            <Transition :name="direction === 'left' ? 'slide-width-right' : 'slide-width-left'">
                <div v-if="show">
                    <slot></slot>
                </div>
            </Transition>

        </div>
        <div v-if="direction === 'left'" :class="`absolute w-3 h-12 bg-#fff top-50% cursor-pointer left--3 mt--5 arrow-box overflow-hidden left-box hidden lg:block ${show ? '' : 'active'}`" @click="handleToggle">
            <div class="flex items-center justify-center font-size-7">
                <i class="i-ic-outline-arrow-right absolute left--2.2 top-2.4 color-#666" v-if="show"></i>
                <i class="i-ic-outline-arrow-left absolute left--2.2 top-2.4 color-#666" v-else></i>
            </div>
        </div>
        <div v-else :class="`absolute w-3 h-12 bg-#fff top-50% cursor-pointer right--3 mt--5 arrow-box overflow-hidden right-box hidden lg:block ${show ? '' : 'active'}`" @click="handleToggle">
            <div class="flex items-center justify-center font-size-7">
                <i class="i-ic-outline-arrow-right absolute left--2.2 top-2.4 color-#666" v-if="!show"></i>
                <i class="i-ic-outline-arrow-left absolute left--2.2 top-2.4 color-#666" v-else></i>
            </div>
        </div>
    </div>
</template>
<style scoped lang='scss'>
.the-telescoping-box {
    height: calc(100vh - 3.5rem);
}

.the-telescoping {
    transition: all ease .3s;
    background: #fff;
}

.arrow-box {

    i {
        color: #999;
    }

    &.active i {
        color: #333;
    }

    &.left-box {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;

    }

    &.right-box {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    &:hover {
        background: #e1e1e1;
    }
}

@media screen and (max-width: 1024px) {

    .the-telescoping,
    .the-telescoping-box {
        width: 100% !important;
    }

    .the-telescoping-box {
        --at-apply: h-70;
    }
}
</style>