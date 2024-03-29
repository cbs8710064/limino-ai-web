import { useRequest } from '@/api/useRequest'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
const { getTasks } = useRequest()
import { ids, setIds } from '@/stores/useStoryListStore'
import { useEventBus } from '@/hooks/useBus'
const { eventBus } = useEventBus()
type TypeSetInterval = ReturnType<typeof setInterval>

export type TaskType =
  | 'gen_video'
  | 'gen_shots'
  | 'gen_role'
  | 'gen_cover'
  | 'init_story'
  | 'gen_merged_video'
export type TaskResponse = {
  args: any[]
  func: TaskType
  id: number
  status: number
  user: string
  percent?: number
  queue?: number
  left_time?: number
  total_time?: number
  storyId?: number
}

// type TimeType = ReturnType<typeof setInterval>
export const useTaskStore = defineStore('taskStore', () => {
  const tasks: Ref<{ [key in TaskType]: TaskResponse | null }> = ref({
    gen_video: null,
    gen_shots: null,
    gen_role: null,
    gen_cover: null,
    init_story: null,
    gen_merged_video: null
  })

  const updateTaskState = (type: TaskType, val: TaskResponse | null) => {
    switch (type) {
      case 'gen_cover':
      case 'gen_role':
      case 'gen_shots':
      case 'gen_video':
      case 'gen_merged_video':
        tasks.value[type] = val
        return
      case 'init_story':
        // eslint-disable-next-line no-case-declarations
        let storyId: number | undefined
        if (val) {
          const { args }: any = val
          args && args.length ? (storyId = args[0]) : ''
          tasks.value.init_story = { ...val, storyId }
        } else {
          tasks.value.init_story = null
        }

        return
    }
  }

  const handleTask = async (taskStatus: number, type: TaskType) => {
    const res = await getTasks(taskStatus)
    return new Promise((resolve, reject) => {
      if (res && res.length) {
        const task = res.find((c: TaskResponse) => c.func === type)
        if (task) {
          updateTaskState(type, task)
          resolve(task)
        } else {
          updateTaskState(type, null)
          reject(task)
        }
      } else {
        updateTaskState(type, null)
        reject()
      }
    })
  }

  const clearLoop = () => {
    eventBus.off('loopTaskEvent')
  }
  const hasVideoTask = computed(() => tasks.value.gen_video)
  // 处理 传入type的task
  const handleTaskData = (type: TaskType, status: number, list: Array<TaskResponse>) => {
    // const list = storylistStore.tasksList
    return new Promise((resolve, reject) => {
      if (list && list.length) {
        const task = list.find((c: TaskResponse) => c.func === type && c.status <= status)
        if (task) {
          updateTaskState(type, task)
          resolve(task)
        } else {
          updateTaskState(type, null)
          reject()
        }
      } else {
        updateTaskState(type, null)
        reject()
      }
    })
  }

  // use eventBus instead of fetch addListener event loopTaskEvent
  const handleLoopTaskOnEvent = async (taskStatus: number = 2, type: TaskType) => {
    eventBus.off('loopTaskEvent')
    return new Promise((resolve, reject) => {
      handleTask(taskStatus, type)
        .then(() => {
          eventBus.on('loopTaskEvent', async (list) => {
            try {
              await handleTaskData(type, taskStatus, list)
            } catch (err: any) {
              resolve(true)
              if (type === 'gen_cover' || type === 'gen_role' || type === 'gen_shots') {
                if (ids) {
                  setIds(ids)
                }
                location.reload()
              }
            }
          })
        })
        .catch((err) => {
          resolve(true)
        })
    })
  }
  return {
    tasks,
    clearLoop,
    // loopTasks,
    hasVideoTask,
    handleLoopTaskOnEvent
  }
})
