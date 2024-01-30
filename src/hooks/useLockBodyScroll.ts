/**
 * A hook that controls whether the page scrolls vertically
 * @returns {UseLockBodyReturns}
 */

import type { UseLockBodyReturns } from '@/types/hooks'

export default function useLockBodyScroll(): UseLockBodyReturns {
  const bodyStyle = document.body.style
  const lockBodyScroll = () => {
    bodyStyle.overflow = 'hidden'
  }
  const unLockBodyScroll = () => {
    bodyStyle.overflow = ''
  }
  return {
    lockBodyScroll,
    unLockBodyScroll
  }
}
