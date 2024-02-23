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

  const timeCountDown: { [key in TaskType]: TypeSetInterval | null } = {
    gen_cover: null,
    gen_merged_video: null,
    gen_role: null,
    gen_shots: null,
    gen_video: null,
    init_story: null
  }
  const oldTaskData: { [key in TaskType]: TaskResponse | null } = {
    gen_cover: null,
    gen_merged_video: null,
    gen_role: null,
    gen_shots: null,
    gen_video: null,
    init_story: null
  }
  // const handleLoopCountDown = (type: TaskType) => {
  //   // 只允许同时轮询一种类似的数据
  //   if (timeCountDown[type]) {
  //     clearInterval(timeCountDown[type] as TypeSetInterval)
  //   }
  //   // 没有缓存数据，直接返回
  //   if (!oldTaskData[type]) {
  //     return
  //   }
  //   // 有缓存数据，有状态1的数据就轮询递减left_time
  //   timeCountDown[type] = setInterval(() => {
  //     if (oldTaskData[type] && tasks.value[type]) {
  //       // @ts-ignore
  //       const { queue, total_time } = oldTaskData[type]
  //       // @ts-ignore
  //       tasks.value[type]?.left_time = total_time - 1
  //     }
  //   }, 1000)
  // }
  const sigleTime = 400
  // 处理in line task的数据
  // const handleInlineTask = (type: TaskType, list: Array<TaskResponse>) => {
  //   const task = list.find((item) => item.status === 1)

  //   // 存在运行中的数据并且没有缓存数据的时候，先缓存数据写入total_time
  //   if (task && !oldTaskData[type]) {
  //     const { queue } = task
  //     // 队列为0的时候直接返回，清空原缓存
  //     if (!queue) {
  //       oldTaskData[type] = null
  //       return
  //     }
  //     oldTaskData[type] = { ...task, left_time: sigleTime * queue }
  //   } else if (oldTaskData[type]) {
  //     // 没有in line任务时，清空原缓存
  //     oldTaskData[type] = null
  //   }
  // }
  // use eventBus instead of fetch addListener event loopTaskEvent
  const handleLoopTaskOnEvent = async (taskStatus: number = 2, type: TaskType) => {
    eventBus.off('loopTaskEvent')
    // handleLoopCountDown(type)
    return new Promise((resolve, reject) => {
      handleTask(taskStatus, type)
        .then(() => {
          eventBus.on('loopTaskEvent', async (list) => {
            // handleInlineTask(type, list)

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
