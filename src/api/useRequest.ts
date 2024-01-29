import type {
  CreateVideoParams,
  DrawToVideoResponse,
  NewStoryParams,
  NewStoryResponse,
  UseRequestReturns
} from '@/types/api'
import { service } from './request'

/**
 *
 * @param params
 * @returns
 */
function upload(params: FormData): Promise<DrawToVideoResponse> {
  return service.post('/upload', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 *
 * @param params
 * @returns
 */
function newStory(params: NewStoryParams): Promise<NewStoryResponse> {
  return service.post('/stories/new', params)
}

/**
 * get all stories of the owner
 * @returns
 */
function getStories(): Promise<any> {
  return service.get('/stories')
}

/**
 *
 * @param storyId story id
 * @param roleIndex role index
 * @param prompt
 * @returns
 */
function updateRoleByPrompt(storyId: number, roleIndex: number, prompt: string): Promise<any> {
  return service.post(`/stories/${storyId}/roles/${roleIndex}`, prompt)
}
/**
 *
 * @param dir
 * @param filename
 * @returns
 */
function getShots(dir: string, filename: string): Promise<any> {
  return service.get(`/shots/${dir}/${filename}`)
}

/**
 *
 * @param id story id
 * @param index script idx
 * @param params
 * @returns
 */
function createVideo(id: number, index: number, params: CreateVideoParams): Promise<any> {
  return service.post(`/stories/${id}/scripts/${index}`, params)
}
/**
 *
 * @param id story id
 * @param index script index
 * @returns
 */
function nextFenjing(id: number, index: number): Promise<any> {
  return service.post(`/stories/${id}/scripts/${index}`, { gen_shot: true })
}

/**
 *
 * @param id story id
 * @returns
 */
function deleteStory(id: number): Promise<any> {
  return service.post('/stories/delete?id=' + id)
}
/**
 *
 * @param id story id
 * @param index  script index
 * @param main_video  main video url
 * @returns
 */
function setMainVideo(id: number, index: number, main_video: string): Promise<any> {
  return service.post(`/stories/${id}/scripts/${index}`, {
    main_video
  })
}

/**
 *
 * @param status 1 in the queue , 2 in the running, 3 success tasks, 4 faild tasks
 * @returns
 */
function getTasks(status: number = 1) {
  return service.get(`/tasks?status=${status}`)
}

/**
 *
 * @param id
 * @param prompt
 * @returns
 */
function updateStoryCover(id: number, prompt: string) {
  return service.post(`/stories/${id}/cover?prompt=${encodeURIComponent(prompt)}`)
}

function getLogs() {
  return service.get('/getlogs')
}

export const useRequest = (): UseRequestReturns => {
  return {
    upload,
    newStory,
    getStories,
    updateRoleByPrompt,
    getShots,
    createVideo,
    nextFenjing,
    deleteStory,
    setMainVideo,
    getTasks,
    updateStoryCover,
    getLogs
  }
}
