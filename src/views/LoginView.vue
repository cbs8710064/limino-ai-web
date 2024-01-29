
<script setup lang='ts'>
import { RouterLink } from 'vue-router';
import TheButton from '@/components/TheButton.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()
</script>
<template>
  <div class="login-view flex flex-col lg:w-100% lg:flex-row">
    <div class="login-left min-h-40vh w-100% flex flex-col lg:min-h-100vh lg:w-50vw lg:flex-row">
      <RouterLink to="/" class="absolute left-0 top-0 w-50vw">
        <div class="brand-tit flex items-center justify-start px-10 py-5 font-size-6 color-white font-bold lg:font-size-8">{{ t('login.brandTit') }} <img class="ml-4 w-8" src="@/assets/images/home/pencil.png" alt=""></div>
      </RouterLink>
      <div class="flex flex-full items-center justify-end lg:pr-20">
        <div class="text-info max-w-180 px-4 text-center font-size-5 font-bold lg:max-w-100 lg:text-left lg:font-size-7">
          {{ t('login.title') }}
          <img class="hidden w-10 h-10 lg:inline" src="@/assets/images/home/pencil.png" alt=""> <br>
          {{ t('login.title2') }}
        </div>
      </div>
    </div>
    <div class="login-right min-h-50vh w-100% flex items-start justify-center lg:min-h-100vh lg:w-50vw lg:items-center lg:justify-start lg:pl-30">
      <div>
        <div class="mt-10 text-center font-size-4 font-bold lg:mt-0 lg:text-left lg:font-size-6">Login to LiminoAI</div>
        <TheButton type="border" class="mt-10">
          <i class="i-logos-google-icon mr-4"></i> {{ t('login.signToGoogle') }}
        </TheButton>
        <div class="mt-10 flex justify-evenly lg:justify-items-start">
          <!-- <div class="google login-card"><i class="i-logos-google-icon font-size-6"></i></div> -->
          <div class="login-card wechat"><i class="i-cib-wechat font-size-6"></i></div>
          <div class="login-card"><i class="i-logos-telegram font-size-10"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.login-left {
  background-color: #9f54ba;
  color: #fff;
}

.login-right {
  background: rgba(241, 193, 104, 0.03);
}

.wechat {
  background: #03D96A;
  color: #fff;
}


.text-info {
  letter-spacing: -1px;
}

.login-card {
  --at-apply: lg:mr-10 flex cursor-pointer items-center justify-center rounded-full w-10 h-10;
}

.google {
  border: 1px solid #efe9e9;
  color: #fff;
}
</style>