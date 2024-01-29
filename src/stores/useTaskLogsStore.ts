import { useRequest } from '@/api/useRequest'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
const { getTasks } = useRequest()

export const useTaskStore = defineStore('taskLogsStore', () => {})
