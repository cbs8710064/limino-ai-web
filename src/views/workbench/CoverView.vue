
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
  taskStore.loopTasks(2, 'gen_cover')
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
    taskStore.loopTasks(2, 'gen_cover')
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
      <div class="min-h-40vh w-100% flex items-start justify-center py-4 lg:mt-10 lg:min-h-140 lg:items-center lg:py-10">
        <div class="relative max-w-220 w-100% p-2 rounded-1 lg:mx-10 lg:mt-0 lg:min-h-100 lg:p-4">
          <div v-if="storyListStore.selectedStory?.cover && !taskStore.tasks.gen_cover" class="bg-mask">
            <div class="flex justify-center">
              <Image loading="lazy" :src="`${videoPath}/${storyListStore.selectedStory.cover}`" :preview="false" class="w-100%"></Image>
            </div>
          </div>
          <div class="w-100% flex items-center justify-center bg-white h-120" v-else>
            <TheNoData v-if="!taskStore.tasks.gen_cover" />
            <Progress v-else type="circle" :percent="taskStore.tasks.gen_cover?.percent">
              <template #format>
                <div>
                  <div class="font-size-4 color-#9f54ba" v-if="taskStore.tasks.gen_cover.status === 1">
                    <div class="text-center">{{ t('common.queuing') }}</div>
                    <div class="text-center">{{ t("common.hasQueueNum", { number: taskStore.tasks.gen_cover.queue }) }}</div>
                  </div>
                  <div v-else class="text-center">{{ taskStore.tasks.gen_cover.percent }}%</div>
                </div>
              </template>
            </Progress>
          </div>

        </div>
      </div>
    </div>
    <TheTelescoping width="300px" direction="left" class="right-box">
      <div class="h-100vh px-4 lg:px-6">
        <div v-if="storyListStore.selectedStory">
          <div class="mt-2 font-bold lh-10">{{ t('workbench.views.cover.prompt') }}</div>
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
        --at-apply: h-42;

        .h-100vh {
          height: 100%;
        }
      }

      .right-box .the-telescoping-box {
        --at-apply: h-90;
      }

      .story-list {
        --at-apply: flex h-40 flex-row w-100%;

        .post-item {
          --at-apply: min-w-28 mr-2;
        }
      }
    }
  }
}
</style>