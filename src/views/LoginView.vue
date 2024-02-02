
<script setup lang='ts'>
import { RouterLink } from 'vue-router';
import TheButton from '@/components/TheButton.vue';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { reg_email } from '../const/regrex';
import { useMessage } from '../hooks/useMessage';
import { useUserStore } from '../stores/useUserStore';
const userStore = useUserStore()
const { t } = useI18n()
const message = useMessage()
const email = ref('')
const loading = ref(false)
const handleSubmit = async () => {
  /**
   * There are three cases
   * White list
   * No applying
   * Requested,not whitelisted
   */
  if (!reg_email.test(email.value)) {
    message.warning(t('warnMessage.emailError'))
  } else {
    // TODO fetch
    const res = await userStore.loginIn(email.value)
    if (res.id) {
      message.success(t('successMessage.loginSuccess'))
    } else {
      message.error('注册失败')
    }
  }
}
</script>
<template>
  <div class="login-view flex flex-col lg:w-100% lg:flex-row">
    <div class="login-left min-h-40vh w-100% flex flex-col lg:min-h-100vh lg:w-50vw lg:flex-row">
      <RouterLink to="/" class="absolute left-0 top-0 w-50vw">
        <div class="brand-tit flex items-center justify-start px-4 py-4 font-size-5 color-white font-bold lg:px-10 lg:py-5 lg:font-size-6 lg:font-size-8">{{ t('login.brandTit') }} <img class="ml-4 w-5 lg:w-8" src="@/assets/images/home/pencil.png" alt=""></div>
      </RouterLink>
      <div class="flex flex-full items-center justify-end lg:pr-20">
        <div class="text-info max-w-180 px-4 text-center font-size-5 font-bold lg:max-w-100 lg:text-left lg:font-size-7">
          {{ t('login.title') }}
          <img class="hidden w-10 h-10 lg:inline" src="@/assets/images/home/pencil.png" alt=""> <br>
          {{ t('login.title2') }}
        </div>
      </div>
    </div>
    <div class="login-right min-h-60vh w-100% flex items-start justify-center lg:min-h-100vh lg:w-50vw lg:items-center lg:justify-start lg:pl-30">
      <div>
        <div class="mt-10 text-center font-size-5 font-bold lg:mt-0 lg:text-left lg:font-size-6">{{ t('login.loginIn') }}</div>
        <!-- <TheButton type="border" class="mt-10">
          <i class="i-logos-google-icon mr-4"></i> {{ t('login.signToGoogle') }}
        </TheButton>
        <div class="mt-10 flex justify-evenly lg:justify-items-start">
          <div class="google login-card"><i class="i-logos-google-icon font-size-6"></i></div>
          <div class="login-card wechat"><i class="i-cib-wechat font-size-6"></i></div>
          <div class="login-card"><i class="i-logos-telegram font-size-10"></i></div>
        </div> -->
        <div class="mt-5 text-center font-size-4 lg:text-left">{{ t('login.emailTit') }}</div>
        <div class="mt-4"><input type="email" v-model="email" class="ipt w-100% lh-10" :placeholder="t('login.inputEmail')" /></div>
        <div class="mt-4 items-end justify-center lg:flex lg:justify-start">
          <TheButton class="min-w-30" type="border" @click="handleSubmit" :loading="loading">{{ t('common.submit') }}</TheButton>
          <!-- <div class="color-grey register text-center mt-4 lg:mt-0 lg:ml-4 cursor-pointer font-size-3.4">已经注册过? 登录</div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.ipt {
  border: 1px solid #9f54ba;
}

.login-left {
  background-color: #9f54ba;
  color: #fff;
}

.register:hover {
  color: #9f54ba;
  text-decoration: underline;
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