<script setup lang='ts'>
import { ref } from 'vue';
import UserScoreModal from './components/UserScoreModal.vue';
import { useCreateStore } from '../../stores/useCreateStore';
import { useI18n } from 'vue-i18n';
import { mergerVideo } from '../../utils/utils';
import { useMessage } from '../../hooks/useMessage';
import TheButton from '@/components/TheButton.vue';
import { useStoryListStore } from '../../stores/useStoryListStore';

const message = useMessage()
const { t } = useI18n()
const scoreModal = ref(false)
const createStore = useCreateStore()
const storyListStore = useStoryListStore()
const { getMainVideoList } = storyListStore
const handleScoreAdd = () => {
  scoreModal.value = true
}

const mergeLoading = ref(false)
const handleMergeVideos = async () => {
  mergeLoading.value = true
  const list = getMainVideoList()
  if (!list.length) {
    message.error(t('warnMessage.chooseMergeVideos'))
    return
  }
  try {
    await mergerVideo(list)
    message.success(t('successMessage.mergeSuccess'))
  } catch (err) {
    message.error(JSON.stringify(err))
  } finally {
    mergeLoading.value = false
  }
}
</script>
<template>
  <div class="index-header">
    <div class="con-header">
      <div>
        <slot></slot>
      </div>
      <div class="flex items-center justify-end">
        <TheButton :loading="mergeLoading" type="primary" class="mr-4 min-w-20 lh-8 h-8 lg:min-w-26" rounded v-if="createStore.step === 5 && storyListStore.selectStoryHasVideo" @click="handleMergeVideos">
          <i class="i-mdi-table-merge-cells mr-2 font-size-5"></i> {{ t('workbench.components.step.post') }}
        </TheButton>
        <div class="row-line mr-4" v-if="createStore.step === 5 && storyListStore.selectStoryHasVideo"></div>
        <div class="account-scores" @click="handleScoreAdd">
          <i class="i-mingcute-diamond-2-line font-size-4 color-#9f54ba lg:font-size-6"></i>
          <span class="font-size-3 font-bold lg:font-size-4.4">1200</span> <i class="i-ic-outline-add font-size-5.4 font-bold"></i>
        </div>
      </div>

    </div>
    <UserScoreModal v-model="scoreModal" />
  </div>
</template>
<style scoped lang='scss'>
.account-scores {
  background: #000;
  color: #fff;
  --at-apply: flex cursor-pointer items-center justify-between rounded-full px-2 w-20 h-8 lg:w-28 lg:h-9;
}

.con-header {
  border-bottom: 1px solid #eee;
  --at-apply: flex items-center justify-between px-3 lg:px-6 py-2 h-14;
}

.row-line {
  width: 0;
  height: 28px;
  border-right: 1px solid #ccc;
}
</style>