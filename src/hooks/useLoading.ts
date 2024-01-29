

import { getCurrentInstance, type ComponentInternalInstance } from 'vue'
export const useloading = () => {
    const { globalProperties } = (getCurrentInstance() as ComponentInternalInstance).appContext.config
    const loading: {
        open: () => void;
        close: () => void
    } = globalProperties.$loading
    return loading
}