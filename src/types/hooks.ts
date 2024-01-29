export type UseScrollCallbackDirection = 'up' | 'down'
export type UseScrollCallbackParams = {
    top: number;
    direction: UseScrollCallbackDirection
}
export type UseScrollCallback = (params: UseScrollCallbackParams) => void

export type UseDocumentCallBack = (e: Event) => void


export interface UseLockBodyReturns {
    lockBodyScroll: () => void;
    unLockBodyScroll: () => void
}