<script setup lang='ts'>
import StepNav from '@/views/workbench/components/StepNav.vue';
import { useCreateStore } from '@/stores/useCreateStore';
import IndexHeader from './IndexHeader.vue';
import PanelHeader from './PanelHeader.vue';
import { useI18n } from 'vue-i18n';
import { useStoryListStore } from '../../stores/useStoryListStore';
import { onMounted, onUnmounted } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
const createStore = useCreateStore()
const storyListStore = useStoryListStore()
const { t } = useI18n()
let time: ReturnType<typeof setInterval>;
onMounted(() => {
  time = setInterval(() => {
    storyListStore.getStoryList()
  }, 4000)
})
onUnmounted(() => {
  if (time) {
    clearInterval(time)
  }
})
onBeforeRouteUpdate(() => {
  console.log('route ..')

})


</script>
<template>
  <div class="w-100% flex flex-col justify-between">
    <div class="index-layout-left w-100% overflow-y-scroll h-18 lg:h-100vh lg:pr-4 lg:w-30">
      <StepNav :step="createStore.step" />
    </div>
    <div class="index-layout-right">
      <IndexHeader>
        <div v-if="createStore.step === 1" class="menu-tit">{{ t('workbench.views.storyTit') }}</div>
        <div v-if="createStore.step === 2" class="menu-tit">{{ t('workbench.views.cover.pageTit') }}</div>

        <div v-if="createStore.step === 3" class="menu-tit">{{ t('workbench.views.characterDesign') }}</div>
        <div v-if="createStore.step === 4">
          <PanelHeader />
        </div>
        <div v-if="createStore.step === 5" class="menu-tit">{{ t('workbench.views.piece') }}</div>

      </IndexHeader>
      <RouterView />
    </div>
  </div>
</template>
<style scoped lang='scss'>
.index-layout-right {
  --at-apply: lg:fixed lg:bottom-0 lg:left-22 lg:top-0 flex-grow-1 bg-white right-0 rounded-5;
}

.menu-tit {
  --at-apply: font-size-4 lg:font-size-6 font-bold;
}
</style>