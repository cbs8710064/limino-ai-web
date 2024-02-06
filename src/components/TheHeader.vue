<script setup lang='ts'>
import TheDropdown from './TheDropdown.vue';
import { ref, type Ref, reactive } from 'vue';
import { type DropdownOption } from '../types/components';
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '../stores/useLanguageStore';
import { languagesList } from '@/const';
import UserScoreModal from '@/views/workbench/components/UserScoreModal.vue';
import useScroll from '../hooks/useScroll';
import { useUserStore } from '../stores/useUserStore';
import router from '../router/index';
const userStore = useUserStore()
defineProps<{
  hasBackground?: boolean
}>()

const languageStore = useLanguageStore()
const i18n = useI18n()
const { t } = i18n
const logoutOpts = reactive([
  { label: t('login.logout'), value: 1 }
])
const langs = ref(languagesList)
const langData: Ref<DropdownOption> = ref(langs.value.find(item => item.value === languageStore.lang) || langs.value[0])
const langVal = ref(langData.value.value)
const handleChange = (e: DropdownOption) => {
  langData.value = { ...e }
  const val = e.value as string
  languageStore.setLanguage(val)
  i18n.locale.value = val

  langVal.value = val
}
const userScoreModal = ref(false)
const handleShowScoreModal = () => {
  userScoreModal.value = true
}

const changeLogout = (e: DropdownOption) => {
  userStore.loginOut()
  router.replace({ name: 'home' })
}

const scrollFlag = ref(false)
useScroll(({ top }) => {
  if (top > 0) {
    scrollFlag.value = true
  } else {
    scrollFlag.value = false
  }
})
</script>
<template>
  <div :class="`the-header fixed left-0 right-0 z-100 top-0 px-4 lg:px-10 h-12 lg:h-16 ${hasBackground ? 'tarnsparent' : ''} ${scrollFlag ? 'the-header-fixed' : ''}`">
    <div class="h-100% flex justify-between">
      <div class="flex items-center justify-center">
        <div class="brand-tit font-size-5 color-white font-bold lh-15 lg:font-size-8">{{ t('components.theHeader.companyTit') }}</div>
      </div>
      <div class="flex items-center">
        <div class="account-scores mr-2 flex cursor-pointer items-center justify-between rounded-full px-2 w-14 h-9 lg:w-16 lg:h-8">
          <i class="i-mingcute-diamond-2-line font-size-4 color-#9f54ba lg:font-size-6"></i> <span class="font-size-4 font-bold lg:font-size-4.4">{{ userStore.userInfo?.user?.token || 0 }}</span>
          <!-- <i class="i-ic-outline-add font-size-5.4 font-bold"></i> -->
        </div>
        <TheDropdown v-if="userStore.userInfo && userStore.userInfo.email" :options="logoutOpts" @change="changeLogout">
          <div class="userIcon flex cursor-pointer items-center justify-center rounded-full bg-white font-size-5 font-bold w-8 h-8">
            <i class="i-material-symbols-person font-size-6 color-#9f54ba"></i>
            <!-- {{ userStore.userInfo?.email?.slice(0, 1).toUpperCase() }} -->
          </div>
        </TheDropdown>
        <RouterLink v-else :class="`btn font-size-4 ${scrollFlag ? 'color-white' : 'color-black '}`" to="/login">{{ t('components.theHeader.signIn') }}</RouterLink>
        <TheDropdown :options="langs" class="ml-2" alignDirection="right" @change="handleChange" v-model="langVal">
          <div class="lang flex items-center justify-start rounded-full px-1.2 w-12 h-8">
            <i :class="`${langData.icon} font-size-5 mr-1`"></i>
            <i class="i-ep-caret-bottom"></i>
          </div>
        </TheDropdown>
      </div>
    </div>
  </div>
  <UserScoreModal v-model="userScoreModal" />
</template>
<style scoped>
.the-header {
  /* border-bottom: 1px solid #cbbdcc; */
  transition: ease .2s;
}

.dark {
  background-color: rgba(0, 0, 0, .6);
}

.the-header .tarnsparent {
  background: transparent;
}

.the-header-fixed {
  backdrop-filter: saturate(40%) blur(10px);
  -webkit-backdrop-filter: saturate(40%) blur(10px);
  background: rgba(82, 8, 83, 0.6);
  box-shadow: 1px 1px 4px rgba(52, 52, 51, 0.12);
}

.the-header.tarnsparent .tit {
  color: #fff;
}

.userIcon:hover {
  border: 1px solid #9f54ba;
}


.lang {
  border: 1px solid #ccc;
}

.account-scores {
  background: #000;
  color: #fff;
}
</style>