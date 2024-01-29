import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { langKey } from '@/const'

export function getLanguage() {
  const language = (navigator.language || 'en-US').toLowerCase()
  const langName = language.split('-')[0] != 'zh-CN' ? 'en-US' : 'zh-CN'
  const localLang = localStorage.getItem(langKey)
  const resLang = localLang || langName
  return resLang
}

export const useLanguageStore = defineStore('language', () => {
  const lang: Ref<string> = ref(getLanguage())
  function setLanguage(val: string) {
    localStorage.setItem(langKey, val)
    lang.value = val
  }
  return { setLanguage, getLanguage, lang }
})
