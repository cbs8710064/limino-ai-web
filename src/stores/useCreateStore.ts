import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

const stepKey = 'step-number'
export const useCreateStore = defineStore('create', () => {
  const step: Ref<number> = ref(getStep())
  function setStep(val: number) {
    localStorage.setItem(stepKey, val.toString())
    step.value = val
  }
  function getStep() {
    const localStep = localStorage.getItem(stepKey)
    return localStep ? Number(localStep) : 1
  }

  return { setStep, step }
})
