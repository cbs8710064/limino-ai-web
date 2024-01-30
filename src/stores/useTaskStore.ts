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
type TimeType = ReturnType<typeof setInterval>
export const useTaskStore = defineStore('taskStore', () => {
  const tasks: Ref<{ [key in TaskType]: any }> = ref({
    gen_video: null,
    gen_shots: null,
    gen_role: null,
    gen_cover: null,
    init_story: null
  })

  const tasksTime: {
    [key in TaskType]: TimeType | null
  } = {
    gen_video: null,
    gen_shots: null,
    gen_role: null,
    gen_cover: null,
    init_story: null
  }
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
        let storyId: number | null = null
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
    if (tasksTime[type]) {
      console.log('---loop', 0)

      clearLoop()
    }
    if (loopDelay < 5000) {
      throw new Error('The value of LoopDelay must be greater than 5000')
    }
    try {
      await handleTask(taskStatus, type)
      tasksTime[type] = setInterval(async () => {
        try {
          await handleTask(taskStatus, type)
        } catch (e) {
          updateTaskState(type, null)
          clearInterval(tasksTime[type] as TimeType)
          if (type === 'gen_cover' || type === 'gen_role' || type === 'gen_shots') {
            location.reload()
          }
        }
      }, loopDelay)
    } catch (err: any) {
      updateTaskState(type, null)
      clearInterval(tasksTime[type] as TimeType)
    }
  }

  const clearLoop = () => {
    let key: TaskType
    for (key in tasksTime) {
      if (key === 'gen_cover') {
        tasksTime.gen_cover ? clearInterval(tasksTime.gen_cover) : ''
      }
      if (key === 'gen_role') {
        tasksTime.gen_role ? clearInterval(tasksTime.gen_role) : ''
      }
      if (key === 'gen_shots') {
        tasksTime.gen_shots ? clearInterval(tasksTime.gen_shots) : ''
      }
      if (key === 'gen_video') {
        tasksTime.gen_video ? clearInterval(tasksTime.gen_video) : ''
      }
      if (key === 'init_story') {
        tasksTime.init_story ? clearInterval(tasksTime.init_story) : ''
      }
    }
  }

  return {
    tasks,
    clearLoop,
    loopTasks
  }
})
