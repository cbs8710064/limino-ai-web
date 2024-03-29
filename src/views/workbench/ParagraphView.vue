<script setup lang='ts'>
import { useCreateStore } from '@/stores/useCreateStore';
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue';
import TheTelescoping from '@/components/TheTelescoping.vue';
import { useEventBus } from '../../hooks/useBus';
import StoryList from '@/views/workbench/components/StoryList.vue'
import TheButton from '@/components/TheButton.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import type { StoryItem } from '../../stores/useStoryListStore';
import { useStoryListStore, ids } from '../../stores/useStoryListStore';
import { useRequest } from '../../api/useRequest';
import { videoPath } from '../../const/index';
import { Image, Progress, Popover } from 'ant-design-vue'
import { useMessage } from '../../hooks/useMessage';
import { useTaskStore } from '../../stores/useTaskStore';
const message = useMessage()
const { t } = useI18n()
const createStore = useCreateStore()
const taskStore = useTaskStore()
const { eventBus } = useEventBus()
const router = useRouter()
const storyListStore = useStoryListStore()

const { createVideo, nextFenjing, getTasks } = useRequest()
const currentVideo = ref({
  url: '',
  status: '',
  main_video: '',
  process: null,
  chatIdx: 0
})
const generateIdx = computed(() => {
  return storyListStore.selectedStory?.description?.chat_process?.findIndex(c => c.process === 1 || c.process === 2)
})
onMounted(async () => {
  createStore.setStep(4)
  storyListStore.getStoryList()
  eventBus.on('headerNextEvent', (): void => {
    router.push({ name: 'post' })
  })
  taskStore.handleLoopTaskOnEvent(2, 'gen_video')


})
onUnmounted(() => {
  storyListStore.setChatSelected(-1)
  eventBus.off('headerNextEvent')
  eventBus.off('storyListLoaded')
  taskStore.clearLoop()
})


const handleChangeStory = (e: StoryItem) => {


  currentVideo.value = { url: '', status: '', main_video: '', process: null, chatIdx: 0 }
  shots.value = []
  storyListStore.setChatSelected(0)

  if (e.description && e.description.chat_process && e.description.chat_process.length && e.description.chat_process[0]) {
    createVideoLoading.value = true
    if (e.description.chat_process[0].videos && e.description.chat_process[0].videos.length) {
      const { url, status } = e.description.chat_process[0].videos[0]
      const { main_video } = e.description.chat_process[0]
      nextTick(() => {
        currentVideo.value = {
          url,
          status,
          main_video,
          process: null,
          chatIdx: 0
        }
      })
    }

    nextTick(() => {
      const loadingIdx = e.description.chat_process.findIndex(ch => ch.process === 1 || ch.process === 2)
      if (loadingIdx > -1) {
        const itemBox = document.getElementById(`scriptItem${loadingIdx}`)
        if (itemBox) {
          itemBox.scrollIntoView({ behavior: 'smooth' })
        }
      }
    })
  }
  createVideoLoading.value = false
}

const handleSelect = (_e: any, idx: number) => {
  if (!_e.main_video || _e.main_video !== currentVideo.value.main_video) {
    createVideoLoading.value = true
    nextTick(() => {
      storyListStore.setChatSelected(idx)
      currentVideo.value = {
        ..._e
      }
      createVideoLoading.value = false
    })
  }
}

const createVideoLoading = ref(false)
const handleSelectShot = (_e: any, idx: number) => {
  shots.value[idx].selected = true
  shots.value.forEach((item: { selected: boolean; }, index: number) => {
    if (index === idx) {
      item.selected = true
    } else {
      item.selected = false
    }
  });
}

const shots: any = ref([])
watch(() => storyListStore.selectedChat, (newVal) => {
  const n = newVal?.shots
  if (n && n.length) {
    const shotIdx = shots.value.findIndex((c: any) => c.selected)
    const arr = JSON.parse(JSON.stringify(n))
    const list = arr.map((item: any, idx: number) => {
      return {
        url: typeof item === 'object' ? item.url : item,
        selected: false,
        idx,
      }
    })

    list[shotIdx > -1 ? shotIdx : 0].selected = true
    shots.value = list
    const { chatIdx } = storyListStore.getSelectedIdAndIdx()
    nextTick(() => {
      handleSelect(storyListStore.selectedChat, chatIdx || 0)
    })
  } else {
    shots.value = []
  }
}, {
  immediate: true,
})

watch(() => storyListStore.selectedChat, (newVal) => {
  const v = newVal?.videos && newVal.videos.length ? newVal.videos[0] : { url: '', status: '' }
  if (v.main_video !== currentVideo.value.main_video) {
    currentVideo.value = {
      ...v,
      main_video: newVal?.main_video
    }
  }

}, {
  deep: true,
  immediate: true
})

const handleCreate = async () => {
  createVideoLoading.value = true
  try {
    const shot = shots.value.find((item: { selected: any; }) => item.selected)
    let params = { last_shot: "none" }
    if (shot) {
      params.last_shot = shot.url
    }
    const { id, chatIdx } = storyListStore.getSelectedIdAndIdx()
    if (id && chatIdx > -1) {
      const { error } = await createVideo(Number(id), chatIdx, params)
      createVideoLoading.value = false
      taskStore.handleLoopTaskOnEvent(2, 'gen_video')
      if (!error) {
        message.success(t('successMessage.createSuccess'))

      } else {
        message.warning(t('warnMessage.hasQueueWorking'))
      }
    }
  } finally {
    createVideoLoading.value = false
  }

}

const loadingFenJing = ref(false)

// 查询是否有分镜任务正在运行
async function getFenjingTask() {
  const res = await getTasks(2)
  if (res.error) {
    return []
  }
  if (res.length) {
    return res.filter((c: any) => c.func === "gen_shots")
  }
  return []
}

const handleGetFenJing = async () => {
  if (loadingFenJing.value) {
    return
  }
  const { id, chatIdx } = storyListStore.getSelectedIdAndIdx()
  if (id && chatIdx > -1) {
    loadingFenJing.value = true
    const storyId = storyListStore?.selectedStory?.id
    if (storyId) {
      const res = await getFenjingTask()
      if (res.length) {
        message.warning(t('warnMessage.hasFejingQueueWorking'))
        return
      }
    }
    const res = await nextFenjing(Number(id), chatIdx)
    if (res.error) {
      message.warning(t('warnMessage.hasQueueWorking'))
      loadingFenJing.value = false
      return
    }
    taskStore.handleLoopTaskOnEvent(2, 'gen_shots')
  }
}
const handleOneClickCreate = (_item: any, idx: number) => {
  storyListStore.setChatSelected(idx)
  handleCreate()
}
const currentChatContent = computed(() => storyListStore.selectedChat && storyListStore.selectedChat?.text_en ? storyListStore.selectedChat?.text_en : (storyListStore.selectedChat?.text || ''))
</script>
<template>
  <div class="paragraph-page lg:flex">
    <TheTelescoping width="380px" direction="right" class="ipt-box">
      <div class="lg:flex">
        <StoryList @change="handleChangeStory" />
        <div class="max-h-40 w-100% lg:max-h-93.2vh">
          <div class="scrollbar-small-x lg:scrollbar-small-y panel-list max-h-35 px-4 lg:max-h-84vh lg:pl-4 lg:pr-3" id="scriptBox" v-if="storyListStore.selectedStory?.description?.chat_process && storyListStore.selectedStory?.description?.chat_process.length">
            <div v-for="(item, idx) in storyListStore.selectedStory?.description?.chat_process" :id="`scriptItem${idx}`" :key="item.id" @click="handleSelect(item, idx)" :class="`panel-item ${item.selected ? 'active' : ''}`">
              <div class="flex items-center justify-center h-4" v-if="item.process">
                <div class="h-4" v-if="item.process !== 4" :title="t('common.creating')">
                  <div class="flex justify-center" v-if="item.process === 1 || item.process === 2">
                    <i class="i-svg-spinners-ring-resize font-size-4 color-#1677ff"></i>
                  </div>
                </div>
                <div class="absolute bottom-1 flex items-center justify-center rounded-full right-1">
                  <i class="i-ooui-success color-green" v-if="item.process === 3"></i>
                </div>
              </div>
              <div>
                <div class="font-bold">Page{{ idx + 1 }}</div>
                <div class="line-clamp-4 overflow-hidden text-ellipsis text-left font-size-3 w-30 h-20 lg:w-100%">{{ item.text }}</div>

                <div class="absolute bottom-1 z-10 flex items-center justify-center rounded-full right-1 w-5 h-5" v-if="item.process === undefined && !taskStore.hasVideoTask">
                  <Popover placement="right">
                    <template #content> {{ t('common.useScriptCreate') }}</template>
                    <i class="i-material-symbols-play-circle-rounded font-size-5 color-#1677ff" @click="handleOneClickCreate(item, idx)"></i>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="mt-4 max-h-30 w-100% px-4 text-center font-size-4 color-#ccc lg:h-100%">
            {{ t('home.noContent') }}
          </div>
        </div>
      </div>

    </TheTelescoping>
    <div class="con scrollbar-small-y min-h-60 w-100% px-4 lg:h-93.3vh lg:min-h-50vh lg:px-10">
      <div class="h-100% flex items-center items-center justify-center py-4 lg:py-10">
        <div class="relative max-w-240 min-h-60 w-100% bg-white p-4 rounded-1 lg:min-h-140">
          <div class="min-h-50 w-100% flex items-center justify-center lg:min-h-120" v-if="createVideoLoading">
            <i class="i-svg-spinners-ring-resize font-size-16"></i>
          </div>
          <div v-if="!createVideoLoading" class="w-100% flex items-center justify-center">
            <div v-if="currentVideo.url && !taskStore.tasks.gen_video" class="w-100%">
              <div class="relative">
                <video class="z-140 w-100% bg-#ccc object-cover rounded-1" controls playsinline>
                  <source :src="`${videoPath}/${currentVideo.main_video}`" type="video/mp4">
                </video>
              </div>
            </div>
            <div v-if="currentVideo.url && taskStore.tasks.gen_video">
              <div class="min-h-50 flex items-center justify-center lg:min-h-120">
                <div class="relative" v-if="currentVideo.chatIdx !== generateIdx">
                  <video class="z-140 w-100% bg-#ccc object-cover rounded-1" controls playsinline>
                    <source :src="`${videoPath}/${currentVideo.main_video}`" type="video/mp4">
                  </video>
                </div>
                <Popover v-else placement="right">
                  <template #content>{{ t('common.waitNum', { number: taskStore.tasks.gen_video.queue || 0 }) }}</template>
                  <Progress type="circle" :percent="taskStore.tasks?.gen_video?.percent" :size="200">
                    <template #format>
                      <div>
                        <div class="font-size-4 color-#9f54ba" v-if="taskStore.tasks.gen_video.status === 1">
                          <div class="mb-2 text-center font-size-7 font-bold">0%</div>
                          <div class="flex items-center justify-center">
                            <i class="i-fluent-people-queue-24-filled font-size-7"></i>
                            <span class="font-size-5 font-bold">{{ taskStore.tasks.gen_video.queue }}</span>
                          </div>
                        </div>
                        <div v-else class="text-center font-size-7 font-bold">{{ taskStore.tasks.gen_video.percent }}%</div>
                        <div v-if="taskStore.tasks?.gen_video?.left_time" class="text-center font-size-4 mt-2 color-#1677ff font-bold">{{ t('common.leftTime', { time: taskStore.tasks.gen_video.left_time }) }}</div>

                      </div>
                    </template>
                  </Progress>
                </Popover>

              </div>
            </div>
          </div>
          <div v-if="!createVideoLoading && !currentVideo.url && taskStore.tasks.gen_video" class="min-h-50 flex items-center justify-center lg:min-h-120">
            <div>
              <Popover placement="right">
                <template #content>{{ t('common.waitNum', { number: taskStore.tasks.gen_video.queue || 0 }) }}</template>
                <Progress type="circle" :percent="taskStore.tasks.gen_video.percent" :size="200">
                  <template #format>
                    <div>
                      <div class="font-size-4 color-#9f54ba" v-if="taskStore.tasks.gen_video.status === 1">
                        <div class="mb-2 text-center font-size-7 font-bold">0%</div>
                        <div class="flex items-center justify-center">
                          <i class="i-fluent-people-queue-24-filled font-size-7"></i>
                          <span class="font-size-5 font-bold">{{ taskStore.tasks.gen_video.queue }}</span>
                        </div>
                      </div>
                      <div v-else class="text-center font-size-7 font-bold">{{ taskStore.tasks.gen_video.percent }}%</div>
                      <div v-if="taskStore.tasks?.gen_video?.left_time" class="text-center font-size-4 mt-2 color-#1677ff font-bold">{{ t('common.leftTime', { time: taskStore.tasks.gen_video.left_time }) }}</div>

                    </div>
                  </template>
                </Progress>
              </Popover>

            </div>
            <!-- {{ JSON.stringify(taskStore.tasks?.gen_video) }} -->
          </div>
          <div v-if="!createVideoLoading && !currentVideo.url && !taskStore.tasks.gen_video" class="min-h-50 flex items-center justify-center lg:min-h-120">
            <div>
              <div class="flex justify-center">
                <i class="i-icon-park-solid-charging-treasure font-size-14 color-#ccc lg:font-size-20"></i>
              </div>
              <div class="mt-4 text-center color-#ccc">{{ t('workbench.components.noVideo') }}</div>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-center" v-if="storyListStore.selectedChat?.text">
            <TheButton type="border" class-name="font-size-3 mr-4" @click="handleCreate" :loading="createVideoLoading">{{ currentVideo.main_video ? t('workbench.views.recreateVideo') : t('workbench.views.createVideo') }}</TheButton>
          </div>
        </div>
      </div>

    </div>
    <TheTelescoping width="300px" direction="left" class="right-box">
      <div class="px-4 lg:px-4">
        <div class="mt-4">
          <div v-if="shots.length">
            <div class="mb-2 font-bold lh-10">{{ t('workbench.views.fenjing') }}</div>
            <div class="flex flex-wrap justify-between">
              <div :class="`storyboarding ${item.selected ? 'active' : ''}`" v-for="(item, idx) in shots" :key="idx" @click="handleSelectShot(item, idx)">
                <div class="selected absolute left-0 top-0 z-1001 p-1">
                  <div class="flex items-center justify-center">
                    <i class="i-material-symbols-check-circle-rounded font-size-6 color-white"></i>
                  </div>
                </div>
                <Image loading="lazy" object="cover" class="z--1 rounded-1" width="100%" :src="`${videoPath}/${item.url}`"></Image>

              </div>
            </div>

            <div class="mt-0 cursor-pointer color-#999">
              <div class="flex items-center justify-start" @click="handleGetFenJing">
                <i v-if="loadingFenJing" class="i-svg-spinners-ring-resize mr-2 font-size-4"></i>
                <i v-else class="i-material-symbols-light-directory-sync font-size-5"></i> {{ t('workbench.views.nextStoryboarding') }}
              </div>
            </div>
          </div>
          <div class="mt-4 font-bold lh-10">{{ t('workbench.views.imgDescription') }}</div>
          <textarea class="mt-2 min-h-50 w-100% resize-none" readonly v-model="currentChatContent"></textarea>
        </div>

      </div>
    </TheTelescoping>
  </div>
</template>
<style scoped lang='scss'>
.paragraph-page {
  :deep() {
    .ant-image img {
      object-fit: cover;
    }
  }
}

.con {
  background-color: #f1f2f6;
}

.video-info {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgb(235, 233, 233) 80%, rgb(255, 255, 255) 100%);
}

.panel-list {
  max-height: calc(100vh - 3.6rem);
  --at-apply: w-100% lg:w-47.5 flex lg:block;
  border-left: 1px solid #eee;
}

.panel-item {
  border: 2px solid #ccc;
  --at-apply: w-35 lg:w-100% mt-4 mr-2 lg:mr-0 lg:mt-4 mb-2 rounded cursor-pointer bg-gray-500/5 px-2 pb-2 min-h-28 relative;

  &.active {
    border-color: #9f54ba;
    background-color: #e1d1e8;

  }
}

.storyboarding {
  border: 2px solid #eee;
  --at-apply: h-40 lg:h-25 w-49% mb-2 cursor-pointer rounded-2 relative;

  :deep() {
    .ant-image img {
      height: 5.97rem;
    }
  }

  &.active {
    border-color: #9f54ba;

    i {
      color: #9f54ba;
      display: block;
    }
  }
}

.dropdown-box {
  --at-apply: lh-10 px-2 rounded-2 cursor-pointer bg-#eee color-#9f54ba font-bold;
}


@media screen and (max-width: 1024px) {
  .panel-list {
    border-left: none;
    border-top: 1px solid #eee;
  }

  :deep() {
    .storyboarding {
      .ant-image img {
        height: 9.7rem;
      }
    }

    .ipt-box .the-telescoping-box {
      --at-apply: max-h-95;

      .h-100vh {
        height: 100%;
      }
    }

    .right-box .the-telescoping-box {
      --at-apply: min-h-60 max-h-185 h-auto pb-5;
    }

    .story-list {
      --at-apply: flex h-40 flex-row w-100%;

      .post-item {
        --at-apply: min-w-28 mr-2 max-w-28;
      }
    }

    .character-list {
      --at-apply: w-100% flex h-37;

      .character-card {
        --at-apply: mr-2;
      }
    }
  }
}
</style>