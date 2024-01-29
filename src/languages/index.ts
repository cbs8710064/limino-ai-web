import { createI18n } from 'vue-i18n'

import en from './en_US/index'
import zh from './zh_CN/index'
import { getLanguage } from '@/stores/useLanguageStore'
import { langKey } from '@/const'

export type I18nStoreType = typeof en



const fallbackLocale: string = getLanguage()
localStorage.setItem(langKey, fallbackLocale)
const messages = {
  'zh-CN':zh,
  'en-US':en
}

const i18n = createI18n<[I18nStoreType]>({
  silentFallbackWarn: true,
  fallbackLocale,
  globalInjection: true,
  locale: fallbackLocale,
  messages,
  legacy: false
})

export default i18n
