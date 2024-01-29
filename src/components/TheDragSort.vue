<script setup lang="ts">
/**
 * @deprecated The components should not be used
 */
import { reactive, nextTick } from 'vue'
const props = defineProps<{

}>()
const emits = defineEmits<{
    (e: 'change', v: any): void
}>()
const drag = reactive({
    list: [
        { name: 'a', id: 1 },
        { name: 'b', id: 2 },
        { name: 'c', id: 3 },
        { name: 'd', id: 4 },
        { name: 'e', id: 5 },
    ]
})

let dragIndex = 0

function dragstart(e: DragEvent, index: number) {
    e.stopPropagation()
    const target = e.target as HTMLDivElement
    dragIndex = index
    nextTick(() => {
        target.classList.add('moveing')
    })
}
function dragenter(e: DragEvent, index: number) {
    e.preventDefault()
    // 拖拽到原位置时不触发
    if (dragIndex !== index) {
        const source = drag.list[dragIndex];
        drag.list.splice(dragIndex, 1);
        drag.list.splice(index, 0, source);

        // 更新节点位置
        dragIndex = index
    }
}
function dragover(e: any) {
    e.preventDefault()
    // const target = e.target as HTMLDivElement
    e.dataTransfer.dropEffect = 'move'

}
function dragend(e: any) {
    e.target.classList.remove('moveing')
    emits('change', drag.list)
}
</script>
<template>
    <div>
        <TransitionGroup name="list" tag="div" class="container">
            <div class="item color-#000 rounded-3" v-for="(item, i) in drag.list" :key="item.id" draggable="true" @dragstart="dragstart($event, i)" @dragenter="dragenter($event, i)" @dragend="dragend" @dragover="dragover">
                {{ item.name }}
            </div>
        </TransitionGroup>
    </div>
</template>


<style lang="scss" scoped>
.item {
    height: 120px;
    border: 3px solid #9f54ba;
    text-align: center;
    margin-bottom: 20px;
    font-size: 18px;
    cursor: move;
}

.container {
    position: relative;
    padding: 0;
}

.moveing {
    opacity: .3;

}

.move {
    border: 1px dotted #9f54ba;
    opacity: 1;
}
</style>
