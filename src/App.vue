<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { createUUID } from './utils/utils';
import { uuidKey } from './const/index';
import { ConfigProvider, StyleProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'
const { locale } = useI18n()
onMounted(() => {
  const localUid = localStorage.getItem(uuidKey)
  if (!localUid) {
    localStorage.setItem(uuidKey, createUUID())
  }
})
</script>

<template>
  <ConfigProvider :locale="locale === 'zh-CN' ? zhCN : enUS">
    <StyleProvider hash-priority="high">
      <RouterView />
    </StyleProvider>
  </ConfigProvider>
</template>

<style scoped></style>
