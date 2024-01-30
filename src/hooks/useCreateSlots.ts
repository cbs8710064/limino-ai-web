import { defineComponent, h, ref, type Slot } from 'vue'
// The higher-order component renders the slot virtual node and binds the ref
export default function useCreateSlots(slots: Readonly<{ [name: string]: Slot<any> }>) {
  return defineComponent({
    setup(props, context) {
      const slotRef = ref(null)
      const [defaultSlot] = slots.default()
      // expose ref
      context.expose({
        slotRef
      })
      return () => h(defaultSlot, { ref: slotRef })
    }
  })
}
