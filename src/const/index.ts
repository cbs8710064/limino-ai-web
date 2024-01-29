// @unocss-include
export const uuidKey = 'user-id'
export const videoPath = import.meta.env.VITE_APP_APIPATH
console.warn('import.meta.env', import.meta.env)
export const langKey = 'local-lang'
export const downloadVideoPath = import.meta.env.VITE_APP_VIDEOPATH
export const languagesList = [
  { label: 'English', value: 'en-US', icon: 'i-circle-flags-en' },
  { label: '中文', value: 'zh-CN', icon: 'i-circle-flags-cn' }
]
