<script setup lang='ts'>
import { onDeactivated } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

onDeactivated(() => {

})


</script>
<template>
  <div class="lg:flex">
    <div class="w-100% lg:flex lg:items-center">
      <div class="w-100% font-size-4 font-bold lg:font-size-6">{{ t('workbench.views.panel') }}</div>
    </div>
    <div class="menus-box">

    </div>
  </div>
</template>
<style scoped lang="scss">
.menus-box {
  --at-apply: flex items-center justify-center ml-30;
}

.menu-card {
  --at-apply: items-center flex justify-center mr-4 cursor-pointer w-8 h-8 rounded-2 font-bold;
}

.menu-border {
  --at-apply: mr-5 h-10 flex items-center justify-center;
}
</style>