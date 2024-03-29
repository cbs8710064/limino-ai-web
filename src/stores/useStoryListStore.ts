import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useRequest } from '@/api/useRequest'
import { useEventBus } from '../hooks/useBus'
import { downloadVideoPath } from '@/const'
type TypeIds = {
  storyIdx: number // selected story idx
  chatIdx: number // selected chat idx
  roleIdx: number // selected role idx
  shotIdx: number // selected shot idx
}
// type PageType = 'story' | 'cover' | 'character' | 'paragraph' | 'post'
const { eventBus } = useEventBus()
export type StoryChildrenItem = StoryItem | CharacterItem | ArticleItem
export type StoryItem = {
  video: string
  description: {
    chat_process: any[]
  }
  roles: {
    roles: any[]
  }
  id: number
  name: string
  url: string
  selected: boolean
  author: string
  text: string
  style: string
  children: Array<StoryChildrenItem>
  cover?: string
  ready?: boolean
  hasTask?: boolean
}
export type VideoItem = {
  id: number
  name: string
  url: string
  selected: boolean
}
export type CharacterItem = {
  name: string
  url: string
  id: number
  selected: boolean
}
export type ArticleItem = {
  id: number
  name: string
  url: string
  selected: boolean
  article: string
}
export type StoryList = StoryItem[]
export type StoryChildrenItemType = 'video' | 'article' | 'character'
export type MergeList = Array<{
  idx: number
  url: string
}>

const idsKey = 'ids'
const { getStories, deleteStory, getTasks } = useRequest()
const newIds = getIds()
// Solve the problem of reassigning selected to true during rotation
export const ids: TypeIds = newIds || {
  storyIdx: 0,
  chatIdx: 0,
  roleIdx: 0,
  shotIdx: 0
}
localStorage.removeItem(idsKey)
// 用于同步任务队列结束后刷新页面保存刷新前列表选中的值
export function setIds(v: TypeIds | null) {
  if (v) {
    localStorage.setItem(idsKey, JSON.stringify(v))
  }
}

export function getIds() {
  const idData = localStorage.getItem(idsKey)
  const val = idData ? JSON.parse(idData) : null
  return val
}

let flag = false
export const useStoryListStore = defineStore('storyList', () => {
  const list: Ref<StoryList> = ref([])
  const tasksList = ref([])
  // get list from internet
  // 通过接口同步状态数据
  async function getStoryList() {
    let res = await getStories()
    const tasks = await getTasks(3)
    eventBus.emit('loopTaskEvent', tasks)
    tasksList.value = tasks
    const genvideoTasks = tasks.filter(
      (it: { func: string; status: number }) => it.status !== 4 && it.func === 'gen_video'
    )
    if (res && res.length) {
      res = res.sort((a: StoryItem, b: StoryItem) => b.id - a.id)
      const { chatIdx, roleIdx, shotIdx, storyIdx } = ids
      res.forEach((item: StoryItem) => {
        const val = genvideoTasks.filter((d: any) => {
          if (d.args[0] === item.id && (d.status === 1 || d.status === 2 || d.status === 3)) {
            return d
          }
        })
        if (val.filter((d: any) => d.status === 1 || d.status === 2).length) {
          item.hasTask = true
        }
        // item.selected = false
        if (item?.roles && item.roles?.roles && item.roles.roles?.length) {
          item.roles.roles.forEach(
            (
              role: {
                name_en: any
                name: any
                text: any
                selected: boolean
              },
              idx: number
            ) => {
              const nowRoleIdx = roleIdx > -1 ? roleIdx : 0
              if (idx === nowRoleIdx) {
                ids.roleIdx = nowRoleIdx
                role.selected = true
              } else {
                role.selected = false
              }
            }
          )
        }
        if (item.description && item.description.chat_process.length) {
          const nowChatIdx = chatIdx > -1 ? chatIdx : 0
          item.description.chat_process.forEach(
            (
              child: {
                [x: string]: any
                main_video: any
                text: any
                text_en: any
                totalVideos: any
                process: any
                videos: any
                shots: any[]
                selected: boolean
              },
              idx: number
            ) => {
              child.text = child.text_en || child.text

              // 处理故事选中数据
              if (idx === nowChatIdx) {
                child.selected = true
                // 处理分镜
                if (child.shots && child.shots.length) {
                  const shotList = [...child.shots]
                  const nowShotIdx = shotIdx > -1 ? shotIdx : 0
                  child.shots = shotList.map((url, idx) => {
                    if (idx === nowShotIdx) {
                      return {
                        url,
                        idx,
                        selected: true
                      }
                    } else {
                      return {
                        url,
                        idx,
                        selected: false
                      }
                    }
                  })
                }
              } else {
                child.selected = false
              }
              child.totalVideos = child.videos.length
              const taskRuns: any = val.filter((ch: any) => {
                const [id, chatIdx] = ch.args
                if (ch.status <= 2 && item.id === id && chatIdx === idx) {
                  return ch
                }
              })
              if (child?.videos && child.videos.length) {
                const [v] = child.videos
                v.chatIdx = idx
                child.main_video = v.url

                const status = taskRuns.length ? 2 : 3
                child.process = status
                child.status = status
              } else {
                if (val && val.length) {
                  val.forEach((c: any) => {
                    const { args, status, percent } = c
                    const [id, chatIdx] = args
                    if (item.id === id && chatIdx === idx) {
                      child.status = status
                      child.process = status
                      child.chatIdx = chatIdx
                    }
                  })
                }
              }
            }
          )
        }
      })
      if (res && res.length) {
        const storyId = list.value.findIndex((it) => it.selected)
        if (storyId && storyId > -1) {
          res.forEach((item: any, i: number) => {
            if (i === storyId) {
              item.selected = true
            }
          })
        } else {
          if (ids.storyIdx > -1) {
            res[ids?.storyIdx || 0].selected = true
          }
        }
      }
      list.value = res
      if (!flag) {
        eventBus.emit('storyListLoaded', true)
        flag = true
      }
    } else {
      list.value = []
    }
    return res
  }
  // 设置选中的故事
  function setStorySelected(id: number) {
    list.value.forEach((item, idx) => {
      if (id > -1) {
        ids.chatIdx = 0
        ids.roleIdx = 0
        ids.shotIdx = 0
        if (item.id === id) {
          item.selected = true
          ids.storyIdx = idx
        } else {
          item.selected = false
        }
      } else {
        ids.storyIdx = -1
        item.selected = false
      }
    })
    setChatSelected(0)
  }
  // 新增故事
  function addStory(val: StoryItem) {
    list.value.forEach((item) => (item.selected = false))
    list.value.unshift(val)
  }
  // 选中的故事
  const selectedStory = computed(() => list.value.find((item) => item.selected))
  // 更新当前选中故事的文本
  function updateContentByStory(content: string) {
    list.value.forEach((item) => {
      if (item.selected) {
        item.text = content
      }
    })
  }
  // 删除故事
  function delStory(id: number) {
    return deleteStory(id)
  }
  // 设置角色选中
  function selectRoleByStoryId(storyId: number, roleIdx: number) {
    ids.roleIdx = roleIdx || 0
    list.value.forEach((item) => {
      if (item.id === storyId) {
        if (item?.roles && item.roles?.roles && item.roles.roles?.length) {
          item.roles.roles.forEach((child: { selected: boolean }, idx: number) => {
            if (idx === roleIdx) {
              child.selected = true
            } else {
              child.selected = false
            }
          })
        }
      }
    })
  }
  // 选中的角色
  const selectStoryRole = computed(() => {
    let role: any = {}
    list.value.forEach((item) => {
      if (item.selected) {
        if (item?.roles?.roles) {
          item.roles.roles.find((child: { selected: boolean }) => {
            if (child.selected) {
              role = child
            }
          })
        }
      }
    })
    return role
  })
  // 获取下标
  const getSelectedIdAndIdx = () => {
    if (list.value && list.value.length) {
      const val = list.value.find((item) => item.selected)
      let idx = -1
      let chatIdx = -1
      if (val && val.roles?.roles && val.roles.roles?.length) {
        idx = val.roles.roles.findIndex((child) => child.selected)
      }
      if (
        val &&
        val.description &&
        val.description.chat_process &&
        val.description.chat_process.length
      ) {
        chatIdx = val.description.chat_process.findIndex((child) => child.selected)
      }
      return {
        id: val?.id, // story id
        idx, // role index
        chatIdx // chat index
      }
    }
    return {
      id: null,
      idx: -1
    }
  }
  // 设置剧本选中
  const setChatSelected = (idx: number) => {
    ids.chatIdx = idx || 0
    list.value.forEach((item) => {
      if (
        item.selected &&
        item.description &&
        item.description.chat_process &&
        item.description.chat_process.length
      ) {
        item.description.chat_process.forEach((child, index) => {
          if (idx === index) {
            child.selected = true
          } else {
            child.selected = false
          }
        })
      }
    })
  }
  // 选择的剧本
  const selectedChat = computed(() => {
    if (selectedStory.value?.description && selectedStory.value.description.chat_process.length) {
      return selectedStory.value.description.chat_process.find((item) => item.selected)
    }
    return { text: '' }
  })
  // 当前选择的故事是否存在故事
  const selectStoryHasVideo = computed(() => {
    if (!selectedStory.value) {
      return false
    } else {
      if (selectedStory.value.description && selectedStory.value.description.chat_process.length) {
        let flag = false
        selectedStory.value.description.chat_process.some((c) => {
          if (c.videos && c.videos.length) {
            c.videos.forEach((v: { url: any; status: number }) => {
              if (v.url || (v.status && v.status === 3)) {
                flag = true
                return
              }
            })
          }
        })
        return flag
      } else {
        return false
      }
    }
  })
  // 获取主要故事的集合
  const getMainVideoList = () => {
    if (selectedStory.value) {
      const list: MergeList = []
      selectedStory.value.description.chat_process.forEach((item, idx) => {
        if (item.main_video) {
          const url = downloadVideoPath + item.main_video
          list.push({ url, idx })
        }
      })
      return list
    }
    return []
  }

  // 当前故事是否有任务队列
  const selectedStoryHasTask = computed(() => {
    if (!selectedStory.value) {
      return false
    } else {
      if (selectedStory.value.description && selectedStory.value.description.chat_process.length) {
        let flag = false
        selectedStory.value.description.chat_process.some((c) => {
          if (c.process === 1 || c.process === 2) {
            flag = true
            return
          }
        })
        return flag
      } else {
        return false
      }
    }
  })

  return {
    list,
    tasksList,
    selectedStory,
    getStoryList,
    setStorySelected,
    addStory,
    updateContentByStory,
    delStory,
    selectRoleByStoryId,
    selectStoryRole,
    getSelectedIdAndIdx,
    setChatSelected,
    selectedChat,
    selectStoryHasVideo,
    getMainVideoList,
    selectedStoryHasTask
  }
})
