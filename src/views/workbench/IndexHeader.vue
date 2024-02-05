<script setup lang='ts'>
import { ref } from 'vue';
import UserScoreModal from './components/UserScoreModal.vue';
import { useUserStore } from '../../stores/useUserStore';
const scoreModal = ref(false)
const userStore = useUserStore()
const handleScoreAdd = () => {
  scoreModal.value = true
}

</script>
<template>
  <div class="index-header">
    <div class="con-header">
      <div>
        <slot></slot>
      </div>
      <div class="flex items-center justify-end">

        <!-- <div class="row-line mr-4" v-if="createStore.step === 5 && storyListStore.selectStoryHasVideo"></div> -->
        <div class="account-scores">
          <i class="i-mingcute-diamond-2-line font-size-4 color-#9f54ba lg:font-size-6"></i>
          <span class="font-size-4 font-bold lg:font-size-4.4">{{ userStore.userInfo?.user?.token || 0 }}</span>
          <!-- <i class="i-ic-outline-add font-size-5.4 font-bold"></i> -->
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
  --at-apply: flex cursor-pointer items-center justify-between rounded-full px-2 lg:px-4 w-14 h-8 lg:w-20 lg:h-9;
}

.con-header {
  border-bottom: 1px solid #eee;
  --at-apply: flex items-center justify-between px-4 lg:px-6 py-2 h-14;
}

.row-line {
  width: 0;
  height: 28px;
  border-right: 1px solid #ccc;
}
</style>