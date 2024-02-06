<script setup lang='ts'>
import StepNav from '@/views/workbench/components/StepNav.vue';
import { useCreateStore } from '@/stores/useCreateStore';
import IndexHeader from './IndexHeader.vue';
import PanelHeader from './PanelHeader.vue';
import { useI18n } from 'vue-i18n';
import { useStoryListStore } from '../../stores/useStoryListStore';
import { onMounted, onUnmounted, watch } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { useUserStore } from '../../stores/useUserStore';
import router from '../../router/index';
import { version } from '../../const/index';
const userStore = useUserStore()
const createStore = useCreateStore()
const storyListStore = useStoryListStore()
const { t } = useI18n()

let time: ReturnType<typeof setInterval>;
onMounted(() => {

  time = setInterval(() => {
    storyListStore.getStoryList()
  }, 7000)

})

// watch(() => userStore.userInfo, (n) => {
//   if (!n || !n.status) {
//     router.replace({ name: 'home' })
//   }
// }, {
//   immediate: true
// })

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
    <div class="index-layout-left scrollbar-none w-100% overflow-y-scroll h-18 lg:h-100vh lg:w-26">
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
  <div class="mt-2 block bg-transparent pb-2 text-center color-#ccc">v{{ version }}</div>
</template>
<style scoped lang='scss'>
.index-layout-right {
  --at-apply: lg:fixed lg:bottom-0 lg:left-26 lg:top-0 flex-grow-1 bg-white right-0;
}

.menu-tit {
  --at-apply: font-size-4 lg:font-size-6 font-bold;
}
</style>