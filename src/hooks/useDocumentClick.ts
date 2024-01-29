import type { UseDocumentCallBack } from "@/types/hooks"
import { onMounted, onUnmounted } from "vue"
/**
 * 
 * @param callBack 
 */
export const useDocumentClick = (callBack: UseDocumentCallBack) => {
    onMounted(() => {
        document.addEventListener('click', callBack, false)
    })
    onUnmounted(() => {
        document.removeEventListener('click', callBack, false)
    })
}