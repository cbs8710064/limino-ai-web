<script setup lang='ts'>
import { useSlots, computed, onMounted, ref } from 'vue';
import useCreateSlots from '../hooks/useCreateSlots';
import { type TabItem } from '../types/components';


defineSlots<{
    default: {
        name: string,
        title: string,
        icon?: string
    }
}>()
const emits = defineEmits<{
    (e: 'click', v: TabItem): void
}>()
const slotRef = ref()
const slots: any = useSlots();
const activeIndex = ref(0)
useCreateSlots(slots);
const titles = computed(() => {
    return slots.default!().map(({ props }: any) => {
        if (props) {
            const { title, name, icon } = props
            return {
                title,
                name,
                icon
            }
        }

    })

})

const handleClick = (e: any) => {
    handleSlotsForEach((ele: any, index: number) => {
        if (e.name === ele.getAttribute('name')) {
            activeIndex.value = index;
            ele.style.display = 'block'
            emits('click', e)
        } else {
            ele.style.display = 'none'
        }
    })
}

onMounted(() => {
    handleSlotsForEach((ele: any, index: number) => {
        if (index === 0) {
            ele.style.display = 'block'
        } else {
            ele.style.display = 'none'
        }
    })
})

function handleSlotsForEach(callBack: Function) {
    Array.from(slotRef.value.children).forEach((ele: any, idx: number) => {
        callBack(ele, idx)
    })
}
</script>
<template>
    <div class="the-tabs">
        <div class="the-tabs-header flex">
            <div :class="`tab px-1 lg:px-3 cursor-pointer ${activeIndex == idx ? 'activite' : ''}`" v-for="(item, idx) in titles" :key="item?.name" @click.stop="handleClick(item)">
                <div class="the-tab-text flex items-center justify-start font-size-4 lh-8 lg:font-size-5 lg:lh-10">
                    <i v-if="item?.icon" :class="`${item.icon} mr-2`"></i>
                    {{ item?.title }}
                </div>
                <div class="flex items-center justify-center">
                    <div class="bar"></div>
                </div>
            </div>
        </div>
        <div class="the-tabs-bodys" ref="slotRef">
            <slot></slot>
        </div>
    </div>
</template>
<style scoped>
.the-tabs .tab .bar {
    transition: all ease .3s;
}

.the-tabs-header {
    border-bottom: 1px solid #eee;
}

.the-tabs .tab {
    color: #000;
}

.the-tabs .tab .bar {
    display: block;
    width: 0;
    height: 4px;
    background-color: #9f54ba;
    opacity: 0;
    border-radius: 2px;
}

.the-tabs .tab.activite>div {
    color: #9f54ba;
    user-select: none;
}

.the-tabs .tab.activite .bar {
    width: 100%;
    opacity: 1;
}

.the-tabs-bodys {
    color: #000;
}
</style>