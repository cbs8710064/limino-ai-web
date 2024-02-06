
<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue';
import { useStoryListStore, type StoryItem } from '../../../stores/useStoryListStore';
import { useI18n } from 'vue-i18n';
import TheModal from '@/components/TheModal.vue';
import { useMessage } from '../../../hooks/useMessage';
import { Image, Progress, Popover } from 'ant-design-vue'
import { videoPath } from '@/const';
import { useEventBus } from '../../../hooks/useBus';
import { useTaskStore } from '../../../stores/useTaskStore';
import { useUserStore } from '../../../stores/useUserStore';
import { useRequest } from '../../../api/useRequest';
import { onBeforeUnmount } from 'vue';
const taskStore = useTaskStore()
const userStore = useUserStore()
const message = useMessage()
const { createAllVideoById } = useRequest()
const { t } = useI18n()
const storyListStore = useStoryListStore()
const { eventBus } = useEventBus()
defineProps<{
    hasBtns?: boolean
}>()
const emits = defineEmits<{
    (e: 'change', val: StoryItem): void
    (e: 'delStory', val: StoryItem): void
}>()
const handleChooseStory = (e: StoryItem) => {
    if (e.selected) {
        return
    }
    storyListStore.setStorySelected(e.id)
    emits('change', e)
}


const deleteModal = ref(false)
const handleDelete = (e: StoryItem) => {
    handleSelect(e)
    deleteModal.value = true

}
const handleSelect = (e: StoryItem) => {
    storyListStore.setStorySelected(e.id)
}

const confirmDelete = async (close: Function) => {
    if (storyListStore && storyListStore.selectedStory && storyListStore.selectedStory.id) {
        const res = await storyListStore.delStory(storyListStore?.selectedStory?.id)
        if (res) {
            message.success(t('successMessage.deleteVideoSuccess'))
            await storyListStore.getStoryList()
        }
        close()
    }
}
const handleAllCreate = async (e: StoryItem) => {
    if (e) {
        storyListStore.setStorySelected(e.id)
    }
    if (storyListStore.selectedStory?.id) {
        try {
            const res = await createAllVideoById(storyListStore.selectedStory.id, { index: 0, auto_next: true })
            if (!res.error) {
                message.success(t('successMessage.createAllVideosSuccess'))
            } else {
                message.warning(t('warnMessage.createAllVideoWarn'))
            }
        } catch (err) {
            message.error(JSON.stringify(err))
        }
    }
}

onMounted(() => {
    taskStore.handleLoopTaskOnEvent(2, 'init_story')

})
onUnmounted(() => {

    taskStore.clearLoop()
})


</script>
<template>
    <div>
        <div class="scrollbar-small-x lg:scrollbar-small-y story-list px-4 pt-4 lg:pl-4 lg:pr-3" v-if="storyListStore.list.length">
            <div :class="`post-item ${item.selected ? 'active' : ''}`" v-for="(item, index) in storyListStore.list" :key="item.id" @click.stop="handleChooseStory(item)" :id="`story${index}`">
                <div class="absolute top-0 z-1 mb-1 flex items-center justify-between right-0">
                    <div class="flex cursor-pointer items-center font-size-5" v-if="hasBtns">
                        <i class="i-material-symbols-delete color-#666" @click.stop="handleDelete(item)"></i>
                    </div>
                </div>
                <div class="story-img flex items-center justify-center h-24 lg:h-36.1">
                    <div class="flex justify-center">
                        <div v-if="taskStore.tasks.init_story && item.id === taskStore.tasks.init_story.storyId" class="w-100% overflow-hidden p-2 rounded-1">
                            <Progress type="circle" :percent="taskStore.tasks.init_story.percent" :size="80">
                                <template #format>
                                    <div>
                                        <div class="font-size-3.2 color-white lg:font-size-4" v-if="taskStore.tasks.init_story.status === 1">
                                            <div class="mb-2 text-center font-size-4 font-bold">0%</div>
                                            <div class="flex items-center justify-center">
                                                <i class="i-fluent-people-queue-24-filled font-size-5"></i>
                                                <span class="font-size-4 font-bold">{{ taskStore.tasks.init_story.queue }}</span>
                                            </div>
                                        </div>
                                        <div v-else class="text-center color-white font-bold">{{ taskStore.tasks.init_story.percent }}%</div>
                                    </div>
                                </template>
                            </Progress>
                        </div>
                        <div v-else class="flex items-center justify-center p-2 w-25 h-25 lg:p-4 lg:w-35 lg:h-35">
                            <Image loading="lazy" v-if="item?.cover" :src="`${videoPath}/${item.cover}`" :preview="false" class="h-100% w-90% object-contain rounded-1" />
                            <i v-else class="i-svg-spinners-ring-resize mr-2 font-size-10 color-#fff"></i>

                        </div>
                        <Popover placement="right">
                            <template #content>
                                {{ t('common.useAllScriptCreate') }}
                            </template>
                            <div class="absolute bottom-1 z-10 rounded-full bg-white right-1" v-if="userStore.userInfo?.user?.token && item.ready && !item.hasTask" @click="handleAllCreate(item)">
                                <i class="i-material-symbols-play-circle-rounded font-size-5 color-#1677ff"></i>
                            </div>
                        </Popover>

                    </div>
                </div>
                <div class="overflow-hidden text-ellipsis whitespace-nowrap px-1 text-center font-size-3 font-bold lh-7 lg:px-0 lg:font-size-3.5">{{ item.name }}</div>
            </div>
        </div>
        <TheModal v-model="deleteModal" @confirm="confirmDelete" keyboard has-footer has-mask loading>
            <div>
                <div class="flex items-center justify-center">
                    <i class="i-ph-warning-circle-bold font-size-10 color-orange lg:font-size-16"></i>
                </div>
                <div class="mt-2 text-center font-size-5 font-bold lg:mt-6 lg:font-size-6">
                    {{ t('workbench.views.story.deleteConfirm') }}
                </div>
            </div>
        </TheModal>
    </div>
</template>
<style scoped lang='scss'>
.story-img {
    transition: ease .3s;
    background: radial-gradient(rgb(145, 143, 143), transparent);

}



.story-list {
    max-height: calc(100vh - 3.1rem);
    --at-apply: pb-2 lg-100% lg:w-47.5 flex flex-col overflow-x-scroll overflow-y-hidden lg:overflow-y-scroll lg:overflow-x-hidden;
    /* border-right: 1px solid #eee; */
}

.story-list2 {
    max-height: calc(100vh - 3.1rem);
    --at-apply: pb-2 lg-100% lg:w-47.5 flex justify-center items-center lg:flex-col lg:justify-start lg:items-start;
    /* border-right: 1px solid #eee; */
}

.post-item {
    --at-apply: font-bold rounded-1.2 lg:rounded-2 mb-2 h-32 lg:h-45 w-100% lg:block lg:px-1 lg:py-1 cursor-pointer relative;
    border: 2px solid #eee;

    &.active {
        border: 2px solid #9f54ba;

        .story-img {
            background: radial-gradient(rgb(174, 116, 221), transparent);
            /* background-size: 200% 200%; */
            /* background: linear-gradient(-45deg, #c89bd8 40%, transparent);
            background-size: 300% 300%; */
            /* animation: gradientBG 10s infinite linear reverse; */
        }
    }
}


@keyframes gradientBG {
    0% {
        /* background-position: 0% 50%; */
        background: radial-gradient(-0deg, rgb(220, 190, 245), transparent);

    }

    50% {
        /* background-position: 100% 50%; */
        background: radial-gradient(-180deg, rgb(145, 66, 209), transparent);
    }

    100% {
        /* background-position: 0% 100%; */
        background: radial-gradient(-360deg, rgb(177, 170, 182), transparent);
    }
}


@media screen and (max-width: 1024px) {
    .post-item {
        border: none;
        border: 2px solid #eee;

        &.active {
            border: 2px solid #9f54ba;
        }
    }

    .story-list2 {
        --at-apply: max-h-30;
    }
}
</style>