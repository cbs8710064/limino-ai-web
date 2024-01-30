<script setup lang='ts'>
import TheNoData from '@/components/TheNoData.vue'
import { useI18n } from 'vue-i18n';
import { useStoryListStore, type StoryItem } from '../../../stores/useStoryListStore';
import router from '../../../router/index';
import { useloading } from '../../../hooks/useLoading';
import { videoPath } from '../../../const/index';

const { t } = useI18n()
const loading = useloading()
const storyListStore = useStoryListStore()
const handleModif = async (e: StoryItem) => {
  try {
    loading.open()
    // await storyListStore.getStoryList()
    storyListStore.setStorySelected(e.id)
    router.push({ name: 'character' })
  } finally {
    loading.close()
  }
}
</script>
<template>
  <div class="scrollbar-small-y the-tab-library scrollbar-none max-h-auto p-2 lg:p-4">
    <div v-if="storyListStore.list.length" class="flex flex-wrap">
      <div v-for="item in storyListStore.list" :key="item.id" class="story-card" @click="handleModif(item)">
        <div>

          <div class="flex items-center justify-center">
            <img v-if="item?.cover" class="object-contain h-40" :src="`${videoPath}/${item.cover}`" alt="">
            <i v-else class="i-ic-round-photo-size-select-actual font-size-10 color-#ccc"></i>
          </div>
        </div>
        <div class="edit-box absolute bottom-0 left-0 right-0">
          <div class="flex flex items-center justify-between px-4 py-2">
            <div class="font-size-4 color-white font-bold">{{ item.name }}</div>
            <i class="i-ph-note-pencil-bold font-size-7 color-white"></i>
          </div>
        </div>
      </div>

    </div>
    <TheNoData v-else :message="t('home.noContent')" />

  </div>
</template>
<style scoped lang='scss'>
.story-card {
  --at-apply: w-47% lg:w-23% h-50 lg:h-58 rounded-1 flex justify-center items-center mx-1.1 lg:mx-2 mb-2 lg:mb-7 cursor-pointer relative;
  border: 1px solid #ccc;
  width: 100%;
  background-size: 200%;
  transition: ease .3s;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: radial-gradient(transparent 60%, rgb(184, 182, 182) 100%);
    opacity: 0;
    transition: opacity 1s;
    z-index: 1;
  }

  .edit-box {
    --at-apply: opacity-0;
    transition: ease .5s all;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1000;
  }

  &:hover {
    border-color: #9f54ba;
    box-shadow: 0 6px 12px 0 rgba(38, 38, 38, 0.08),
      0 4px 16px 0px rgba(41, 40, 40, 0.08),
      0 7px 15px 0 rgba(35, 35, 35, 0.08);


    &::before {
      opacity: .7;
    }

    .edit-box {
      opacity: 1;
    }
  }
}



.the-tab-library {

  :deep() {
    .the-no-data {
      height: 280px;
    }
  }
}
</style>