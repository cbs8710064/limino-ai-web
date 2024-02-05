import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import img2 from '@/assets/images/home/anime.jpeg'
import img1 from '@/assets/images/home/real.png'
import i18n from '@/languages'

export const styleList = [
  {
    id: 'realistic',
    url: img1,
    checked: true,
    desc: i18n.global.t('home.realistic')
  },
  {
    id: 'anime',
    url: img2,
    checked: false,
    desc: i18n.global.t('home.anime')
  }
]
export type StyleItem = {
  id: string
  url: string
  checked: boolean
  desc: string
  disabled?: boolean
}

export const useStyleListStore = defineStore('styleList', () => {
  const list: Ref<Array<StyleItem>> = ref(styleList)
  function setSelectStyle(id: string) {
    list.value.forEach((item) => {
      if (item.id === id) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
  }
  return {
    list,
    setSelectStyle
  }
})
