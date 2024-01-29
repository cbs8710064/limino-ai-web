
import type { NoticeOpenFuns } from '@/types/plugins'
import { getCurrentInstance, type ComponentInternalInstance } from 'vue'
export const useNotice = () => {
    const { globalProperties } = (getCurrentInstance() as ComponentInternalInstance).appContext.config
    const notice: NoticeOpenFuns = globalProperties.$notice
    return notice

}