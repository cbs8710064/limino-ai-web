
<script setup lang='ts'>
import { onMounted, ref, onUnmounted } from 'vue';
import { useCreateStore } from '../../stores/useCreateStore';
import StoryList from '@/views/workbench/components/StoryList.vue'
import TheTelescoping from '@/components/TheTelescoping.vue';
import { useStoryListStore } from '../../stores/useStoryListStore';
import TheNoData from '@/components/TheNoData.vue';
import { videoPath } from '@/const';
import { Image, Progress } from 'ant-design-vue'
import { useI18n } from 'vue-i18n';
import TheButton from '@/components/TheButton.vue';
import { useMessage } from '@/hooks/useMessage';
import { useRequest } from '../../api/useRequest';
import { useTaskStore } from '../../stores/useTaskStore';
const taskStore = useTaskStore()
const { updateStoryCover } = useRequest()
const { t } = useI18n()
const createStore = useCreateStore()
const storyListStore = useStoryListStore()
const message = useMessage()
onMounted(async () => {
  createStore.setStep(2)
  taskStore.handleLoopTaskOnEvent(2, 'gen_cover')
  storyListStore.getStoryList()
})
onUnmounted(() => {
  taskStore.clearLoop()
})

const storyPrompt = ref('')
const updateStoryLoading = ref(false)
const handleUpdateStoryCover = async () => {
  if (!storyPrompt.value) {
    message.warning(t('warnMessage.enterStoryCoverPrompt'))
    return
  }
  if (!storyListStore.selectedStory) {
    message.warning(t('workbench.views.story.placeSeletedData'))
    return
  }
  updateStoryLoading.value = true
  try {
    const res = await updateStoryCover(storyListStore.selectedStory.id, storyPrompt.value)
    if (res.error) {
      message.warning(t('warnMessage.hasQueueWorking'))
      return
    }
    taskStore.handleLoopTaskOnEvent(2, 'gen_cover')
    message.success(t('successMessage.storyCoverUpdateSuccess'))
  } finally {
    updateStoryLoading.value = false
  }

}
</script>
<template>
  <div class="cover-view lg:flex">
    <TheTelescoping width="190px" direction="right" class="left-box">
      <StoryList></StoryList>
    </TheTelescoping>
    <div class="middle-box scrollbar-small-y w-100% lg:h-93.3vh">
      <div class="min-h-40 w-100% flex items-start justify-center py-4 lg:mt-10 lg:min-h-140 lg:items-center lg:py-10">
        <div class="relative max-w-220 w-100% px-4 py-2 rounded-1 lg:mx-10 lg:mt-0 lg:min-h-100 lg:p-4">
          <div v-if="storyListStore.selectedStory?.cover && !taskStore.tasks.gen_cover" class="bg-mask">
            <div class="min-h-50 flex items-center justify-center py-4 lg:min-h-140">
              <Image loading="lazy" :src="`${videoPath}/${storyListStore.selectedStory.cover}`" :preview="false" class="w-100%"></Image>
            </div>
          </div>
          <div class="max-h-120 w-100% flex items-center justify-center bg-white py-4 lg:min-h-140" v-else>
            <TheNoData v-if="!taskStore.tasks.gen_cover" />
            <Popover v-else placement="right">
              <template #content>
                {{ t('common.waitNum', { number: taskStore.tasks.gen_cover.queue || 0 }) }}
              </template>
              <Progress type="circle" :percent="taskStore.tasks.gen_cover?.percent" :size="200">
                <template #format>
                  <div>
                    <div class="font-size-4 color-#9f54ba" v-if="taskStore.tasks.gen_cover.status === 1">
                      <div class="mb-2 text-center font-size-7 font-bold">0%</div>
                      <div class="flex items-center justify-center">
                        <i class="i-fluent-people-queue-24-filled font-size-7"></i>
                        <span class="font-size-5 font-bold">{{ taskStore.tasks.gen_cover.queue }}</span>
                      </div>
                    </div>
                    <div v-else class="text-center font-size-7 font-bold">{{ taskStore.tasks.gen_cover.percent }}%</div>
                    <div v-if="taskStore.tasks?.gen_cover?.left_time" class="text-center font-size-4 mt-2 color-#1677ff font-bold">{{ t('common.leftTime', { time: taskStore.tasks.gen_cover.left_time }) }}</div>
                  </div>
                </template>
              </Progress>
            </Popover>

          </div>

        </div>
      </div>
    </div>
    <TheTelescoping width="300px" direction="left" class="right-box">
      <div class="h-100vh px-4 lg:px-6">
        <div v-if="storyListStore.selectedStory">
          <div class="mt-2 font-bold lh-10 lg:mt-0">{{ t('workbench.views.cover.prompt') }}</div>
          <div>
            <textarea v-model="storyPrompt" class="w-100% resize-none" rows="10" maxlength="256" :placeholder="t('workbench.views.cover.placeholder')"></textarea>
          </div>
          <div>
            <TheButton class="mt-4 bg-#000 bg-black color-white lh-10 h-10" :loading="updateStoryLoading" @click="handleUpdateStoryCover">
              {{ t('workbench.views.character.generate') }}(
              <i class="i-mingcute-diamond-2-line font-size-4 color-#9f54ba lg:font-size-6"></i>
              3)
            </TheButton>
          </div>
        </div>
        <div v-else class="h-100% w-100% p-4 text-center font-size-4 color-#ccc lg:text-left">
          {{ t('home.noContent') }}
        </div>
      </div>
    </TheTelescoping>
  </div>
</template>
<style scoped lang='scss'>
.cover-view {
  background-color: #f1f2f6;

  .bg-mask {
    transition: ease .3s;
    width: 100%;
    background: radial-gradient(rgb(145, 143, 143), transparent);
  }

  @media screen and (max-width: 1024px) {
    :deep() {
      .left-box .the-telescoping-box {
        --at-apply: max-h-42;

        .h-100vh {
          height: 100%;
        }
      }

      .right-box .the-telescoping-box {
        --at-apply: max-h-90;
      }

      .story-list {
        --at-apply: flex max-h-40 flex-row w-100%;

        .post-item {
          --at-apply: min-w-28 mr-2 max-w-28;
        }
      }
    }
  }
}
</style>