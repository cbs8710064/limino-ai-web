import type { UseScrollCallback, UseScrollCallbackParams } from '@/types/hooks'
import { debounce } from '@/utils/utils'
import { onMounted, onUnmounted } from 'vue'

export default function useScroll(callBack: UseScrollCallback, delay: number = 2) {
  let oldScrollTop: number = 0
  const handleScroll = () => {
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

    const scrollStep = scrollTop - oldScrollTop
    oldScrollTop = scrollTop
    const val: UseScrollCallbackParams = {
      top: scrollTop,
      direction: scrollStep > 0 ? 'up' : 'down'
    }
    callBack(val)
  }

  const scrollFun = debounce(handleScroll, delay)
  onMounted(() => {
    window.addEventListener('scroll', scrollFun)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', scrollFun)
  })
}
