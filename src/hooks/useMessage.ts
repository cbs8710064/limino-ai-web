
import type { MessageOpenFuns } from '@/types/plugins'
import { getCurrentInstance, type ComponentInternalInstance } from 'vue'
export const useMessage = () => {
    const { globalProperties } = (getCurrentInstance() as ComponentInternalInstance).appContext.config
    const message: MessageOpenFuns = globalProperties.$message
    return message

}