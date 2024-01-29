<script setup lang='ts'>
import { useStyleListStore, type StyleItem } from '../../../stores/useStylelistStore';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
const styleListStore = useStyleListStore()

const emits = defineEmits<{
  (e: 'change', val: StyleItem): void
}>()
const handleChoose = (e: any) => {
  const { id } = e;
  styleListStore.setSelectStyle(id)
  emits('change', e)
}

emits('change', styleListStore.list[0])
</script>
<template>
  <div class="choose-style">
    <div class="mb-4 px-2 font-bold lg:px-0">{{ t('home.chooseStyleTit') }}</div>
    <div class="scrollbar-small-y choose-list max-h-50vh flex flex-wrap">
      <div v-for="item in styleListStore.list" :key="item.id" @click="handleChoose(item)" :class="`style-card ${item.checked ? 'activite' : ''}`">
        <img :src="item.url" class="h-100% w-100% object-cover" alt="">
        <i v-if="item.checked" class="i-icon-park-solid-success absolute top-2 font-size-8 color-#9f54ba right-2"></i>
        <div class="style-card-bottom-bg absolute bottom-0 left-0 flex flex-col justify-end text-center color-white right-0 h-20">
          <div class="font-size-4 font-bold">{{ item.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang='scss'>
.style-card {
  transition: ease .3s;
  border: 4px solid transparent;
  --at-apply: cursor-pointer w-46% lg:w-38 lg:h-38 lg:w-54 lg:h-54 mb-2 lg:mb-5 rounded-2 lg:mr-1 lg:mr-5.6 overflow-hidden relative;

  &.activite {
    border: 2px solid #9f54ba;
    box-shadow: 0 4px 10px 4px #c9a3d7;
  }

  .style-card-bottom-bg {
    background: linear-gradient(180deg, rgba(243, 176, 22, 0) 20%, rgba(0, 0, 0, .8) 100%);
  }

  &:nth-of-type(4n+0) {
    margin-right: 0;
  }
}
</style>