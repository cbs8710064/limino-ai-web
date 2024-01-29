import { useRequest } from '@/api/useRequest'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
const { getTasks } = useRequest()

export type TaskType = 'gen_video' | 'gen_shots' | 'gen_role' | 'gen_cover' | 'init_story'
type TaskResponse = {
  args: any[]
  func: TaskType
  id: number
  status: number
  user: string
}
export const useTaskStore = defineStore('taskStore', () => {
  const tasks: Ref<{ [key in TaskType]: any }> = ref({
    gen_video: null,
    gen_shots: null,
    gen_role: null,
    gen_cover: null,
    init_story: null
  })
  let time: ReturnType<typeof setInterval>
  const updateTaskState = (type: TaskType, val: TaskResponse | null) => {
    switch (type) {
      case 'gen_cover':
        tasks.value.gen_cover = val
        return
      case 'gen_role':
        tasks.value.gen_role = val
        return
      case 'gen_shots':
        tasks.value.gen_shots = val
        return
      case 'gen_video':
        tasks.value.gen_video = val
        return
      case 'init_story':
        // eslint-disable-next-line no-case-declarations
        let storyId: any = null
        if (val) {
          const { args }: any = val
          args && args.length ? (storyId = args[0]) : ''
        }

        tasks.value.init_story = { ...val, storyId }
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
          reject()
        }
      } else {
        reject()
      }
    })
  }

  const loopTasks = async (taskStatus: number = 2, type: TaskType, loopDelay: number = 5000) => {
    if (time) {
      clearLoop()
    }
    if (loopDelay < 5000) {
      throw new Error('The value of LoopDelay must be greater than 5000')
    }
    try {
      await handleTask(taskStatus, type)
      time = setInterval(async () => {
        try {
          await handleTask(taskStatus, type)
        } catch (e) {
          updateTaskState(type, null)
          clearInterval(time)
          location.reload()
        }
      }, loopDelay)
    } catch (err: any) {
      updateTaskState(type, null)
      clearInterval(time)
    }
  }

  const clearLoop = () => {
    time ? clearInterval(time) : ''
  }

  return {
    tasks,
    clearLoop,
    loopTasks
  }
})
