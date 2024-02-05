<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { ConfigProvider, StyleProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'
import { useUserStore } from '@/stores/useUserStore';
const userStore = useUserStore()
const { locale } = useI18n()
if (userStore.userInfo?.email) {
  userStore.loginIn(userStore.userInfo?.email)
}
</script>

<template>
  <ConfigProvider :locale="locale === 'zh-CN' ? zhCN : enUS">
    <StyleProvider hash-priority="high">
      <RouterView />
    </StyleProvider>
  </ConfigProvider>
</template>

<style scoped></style>
