<script setup lang='ts'>
import { useCreateStore } from '@/stores/useCreateStore';
import { ref, type Ref, nextTick, reactive, computed, onMounted, onUnmounted } from 'vue';
import TheTelescoping from '@/components/TheTelescoping.vue';
import FileSaver from 'file-saver'
import TheButton from '@/components/TheButton.vue';
import { useI18n } from 'vue-i18n';
import StoryList from '@/views/workbench/components/StoryList.vue'
import { useStoryListStore } from '../../stores/useStoryListStore';
import TheNoData from '@/components/TheNoData.vue';
import { Image, message } from 'ant-design-vue';
import { videoPath } from '../../const/index';
import { useRequest } from '../../api/useRequest';
import { useTaskStore } from '../../stores/useTaskStore';
const { mergerVideosById } = useRequest()
const currentLoading = ref(false)
const { t } = useI18n()
type VideoItem = {
    [x: string]: any;
    id: number,
    label: string,
    url: string,
    selected: boolean
}
const createStore = useCreateStore()
const storyListStore = useStoryListStore()
const taskStore = useTaskStore()
const currentVideo: any = ref({ url: '' })
const currentUrl: Ref<string> = ref('')

const handleSelect = (e: VideoItem, i: number) => {
    if (e.selected) {
        return
    }
    currentLoading.value = true
    nextTick(() => {
        currentVideo.value = { ...e }
        currentUrl.value = e.url

        videoList.list.forEach((item, index) => {
            if (index === i) {
                item.selected = true
            } else {
                item.selected = false
            }
        })
        currentLoading.value = false
    })
}
const videoList: { list: Array<VideoItem> } = reactive({ list: [] })
const fenJingList: { list: any } = reactive({ list: {} })
const getVideoList = () => {
    currentLoading.value = true
    const vlist: any = []
    videoList.list = []
    return new Promise((resolve) => {
        if (storyListStore.selectedStory?.description?.chat_process) {
            storyListStore.selectedStory?.description.chat_process.forEach((item, idx) => {
                if (item.videos && item.videos.length) {
                    // 处理同一剧情下面所有的视频集合
                    const vBigList = JSON.parse(JSON.stringify(item.videos)).map((item: any, idx: number) => ({ ...item, selected: false, idx }))
                    vBigList[0].selected = true
                    const arr = vBigList.filter((child: any) => (child.status === 3 || !child.status)).map((c: any) => {
                        return { ...c, isMainVideo: c.url === item.main_video, main_video: item.main_video }
                    }).sort((a: any, b: any) => b.isMainVideo - a.isMainVideo)
                    // idx 关联, 处理分镜列表
                    fenJingList.list[idx] = arr
                    const total = item.videos.filter((v: any) => v.status === 3).length
                    const { main_video } = item
                    item.videos.forEach((video: VideoItem, idx: number) => {
                        const videoChild = { ...video }
                        if (idx === 0) {
                            vlist.push({ ...videoChild, totalVideos: total, idx, main_video, isMainVideo: video.url === item.main_video })
                        }
                    })
                }
            })
            if (vlist.length) {
                const idx = videoIndex.value > -1 ? videoIndex.value : 0
                vlist[idx].selected = true
                currentLoading.value = true
                nextTick(() => {
                    const mainv = vlist[idx]
                    if (mainv) {
                        currentVideo.value = { ...mainv }
                        currentUrl.value = mainv.url
                        currentLoading.value = false
                        videoList.list = vlist
                        resolve(true)
                    }

                })
            }
        } else {
            resolve(true)
            nextTick(() => {
                currentLoading.value = false
            })
        }
    })

}

const videoIndex = computed(() => {
    return videoList.list.findIndex(item => item.selected)
})
onMounted(async () => {
    createStore.setStep(5)
    await storyListStore.getStoryList()
    getVideoList()

})
onUnmounted(() => {
    videoList.list = []
    currentVideo.value = {
        url: ''
    }
    currentUrl.value = ''
})

const handleChangeStory = () => {
    currentVideo.value = {
        url: ''
    }
    getVideoList()
}

const mergeLoading = ref(false)
const handleMerge = async () => {

    if (storyListStore.selectedStory?.id) {
        mergeLoading.value = true
        try {
            const res = await mergerVideosById(storyListStore.selectedStory.id)
            if (res.error) {
                message.warn(t('warnMessage.hasQueueWorking'))
                return
            }
            await taskStore.handleLoopTaskOnEvent(2, 'gen_merged_video')
            await storyListStore.getStoryList()
            if (storyListStore.selectedStory.video) {
                FileSaver.saveAs(videoPath + '/' + storyListStore.selectedStory.video, `${new Date().getTime()}.mp4`);
            } else {
                message.error('No video path found')
            }
        } catch (err) {
            message.error(JSON.stringify(err))
        } finally {
            mergeLoading.value = false
        }

    }
}

</script>
<template>
    <div class="post-page flex-col lg:flex lg:flex-row">
        <TheTelescoping width="380px" direction="right" class="left-box">
            <div class="w-100% lg:flex">
                <StoryList @change="handleChangeStory" />
                <div class="scrollbar-small-x right-video-list lg:scrollbar-small-y w-100%" v-if="videoList.list && videoList.list.length">
                    <div class="flex lg:block">
                        <div :class="`right-video-card cursor-pointer relative ${item.selected ? 'active' : ''}`" v-for="(item, idx) in videoList.list" :key="item.id" @click.stop="handleSelect(item, idx)">
                            <div class="w-88% overflow-hidden text-ellipsis whitespace-nowrap text-left font-size-4 font-bold w-34">Page{{ idx + 1 }}</div>
                            <div v-if="item.totalVideos > 1" class="absolute top-0 z-1000 rounded-full color-white right-0">
                                <div class="flex items-center justify-center">
                                    <i class="i-fluent-multiselect-rtl-20-filled font-size-5 color-#9f54ba"></i>
                                </div>
                            </div>
                            <Image loading="lazy" v-if="item.status === 3 || !item.status" class="z-140 h-auto w-[100%] object-cover rounded-1" :preview="false" :src="`${videoPath}/${item.cover}`"></Image>
                            <div class="flex items-center justify-center pb-2 h-26" v-else>
                                <div v-if="item.status === 1 || item.status === 2">
                                    <div class="text-center"><i class="i-svg-spinners-ring-resize font-size-8"></i></div>
                                    <div class="text-center">{{ t('workbench.views.creating') }}</div>
                                </div>
                                <div v-else class="flex items-center justify-center color-#ccc">
                                    {{ t('errorMessage.createFailed') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="h-100% w-100% p-4 text-center font-size-4 color-#ccc lg:text-left">
                    {{ t('home.noContent') }}
                </div>
            </div>

        </TheTelescoping>

        <div class="scrollbar-small-y con w-100% lg:h-93.3vh">
            <div class="h-100% w-100% flex items-center justify-center">
                <div class="w-100% px-4 py-4 lg:flex lg:items-center lg:justify-center lg:px-0">
                    <div class="relative mt-10 max-w-220 w-100% flex items-center justify-center rounded-1 lg:mx-10 lg:mx-4 lg:mt-0 lg:p-2 lg:p-4" draggable>
                        <div class="absolute left-0 top--8 font-size-4 color-#999 font-bold lg:left-4 lg:top--5 lg:font-size-5">{{ currentVideo.url }}</div>
                        <div v-if="currentVideo.url" class="w-100% bg-white p-4 lg:min-h-140">
                            <div class="w-100% flex items-center justify-center" v-if="!currentLoading">
                                <video class="z-140 h-auto w-100% object-cover rounded-1" controls playsinline>
                                    <source :src="`${videoPath}/${currentVideo.url}`" type="video/mp4">
                                </video>
                            </div>
                            <div v-else class="w-100% flex items-center justify-center h-90">
                                <i class="i-svg-spinners-ring-resize font-size-12 color-#1677ff"></i>
                            </div>
                            <!-- <div class="flex" v-if="smallVideoList.length > 1">
                                <div class="scrollbar-small-x fenjing-list">
                                    <div class="whitespace-nowrap">
                                        <div v-for="(item, idx) in smallVideoList" :key="idx" :class="`fenjinCard ${item.selected ? 'active' : ''}`" @click="handleChangeShot(item)">
                                            {{ idx + 1 }}
                                        </div>
                                    </div>
                                </div>
                                <div class="w-8% flex items-center justify-end" v-if="!currentVideo?.isMainVideo">
                                    <TheButton :title="t('workbench.views.setMainVideo')" class="topBtn" class-name="lh-10 h-10 color-#666 mt-2 ml-0 pl-0 pr-0 w-100%" @click="handleSetMainVideo" :loading="mainLoading">
                                        <i class="i-bx-arrow-to-top font-size-6 color-#9f54ba"></i>
                                    </TheButton>
                                </div>
                            </div> -->
                            <div class="mt-4 w-100% items-center justify-between lg:flex">
                                <div class="flex">
                                    <!-- <TheButton @click="handleDownload" type="border" class-name="h-8 mr-4">
                                        <i class="i-material-symbols-download-2-rounded"></i> {{ t('workbench.views.download') }}
                                    </TheButton> -->
                                    <TheButton :loading="mergeLoading" type="border" class="mr-4 min-w-20 lh-8 h-8 lg:min-w-26" rounded v-if="createStore.step === 5 && storyListStore.selectStoryHasVideo" @click="handleMerge">
                                        <i class="i-mdi-table-merge-cells mr-2 font-size-5"></i> {{ t('workbench.components.step.post') }}
                                    </TheButton>
                                </div>
                                <div class="share-list font-size-7">
                                    <a href="http://" target="_blank" class="lg:ml-6" rel="noopener noreferrer">
                                        <i class="i-logos-twitter"></i>
                                    </a>
                                    <a href="http://" target="_blank" class="ml-6" rel="noopener noreferrer">
                                        <i class="i-logos-discord-icon"></i>
                                    </a>
                                    <a href="http://" target="_blank" class="ml-6" rel="noopener noreferrer">
                                        <i class="i-cib-wechat color-green"></i>
                                    </a>
                                    <a href="http://" target="_blank" class="ml-6" rel="noopener noreferrer">
                                        <i class="i-logos-telegram"></i>
                                    </a>
                                </div>
                            </div>

                        </div>
                        <div class="w-100% flex items-center justify-center bg-white h-40 lg:h-140" v-else>
                            <TheNoData />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang='scss'>
.post-page {
    background-color: #f1f2f6;

    :deep() {
        .topBtn {
            padding: 0 4px;
        }
    }
}

.fenjing-list {
    --at-apply: overflow-x-scroll overflow-y-hidden w-100% h-11 mt-2 py-1 px-2 rounded-1;
    border: 1px solid #eee;
}

.fenjinCard {
    border: 1px solid #eee;
    --at-apply: w-7 h-7 mr-2 inline-block text-center lh-7 font-bold cursor-pointer;

    &.active {
        --at-apply: border-color-#9f54ba rounded-1 cursor-pointer;
    }
}

.right-video-card {
    border: 2px solid #ccc;
    --at-apply: rounded-2 px-1 pb-1 mb-2 mr-2 lg:mr-0 w-40 lg:w-100%;

    &.active {
        border-color: #9f54ba;
    }
}

.right-video-list {
    height: calc(100vh - 4.5rem);
    --at-apply: pt-4 px-4 w-100% lg:w-47.5;
    border-left: 1px solid #eee;
}

@media screen and (max-width: 1024px) {

    :deep() {
        .left-box .the-telescoping-box {
            --at-apply: max-h-82;

            .h-100vh {
                height: 100%;
            }
        }

        .story-list {
            --at-apply: flex h-39 flex-row w-100%;

            .post-item {
                --at-apply: w-28 mr-2;
            }
        }
    }

    .right-video-list {
        --at-apply: h-44 px-4;
        border-left: none;
        border-top: 1px solid #eee;


        .right-video-card {
            --at-apply: mb-0;
        }
    }

}
</style>     