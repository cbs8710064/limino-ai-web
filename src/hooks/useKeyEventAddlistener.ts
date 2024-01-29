import { onMounted, onUnmounted } from "vue"

type KeyboardEventType = 'keydown' | 'keyup' | 'keypress'; 
export default function useKeyEventAddlistener(type: KeyboardEventType, callBack: (e:KeyboardEvent) => void): Function {
    window.addEventListener(type, callBack)
    return () => {
        window.removeEventListener(type, callBack)
    }
};