export type UseRequestReturns = {
  upload: (v: FormData) => Promise<DrawToVideoResponse>
  newStory: (v: NewStoryParams) => Promise<NewStoryResponse>
  getStories: () => Promise<any>
  updateRoleByPrompt: (storyId: number, roleIndex: number, prompt: string) => Promise<any>
  getShots: (dir: string, filename: string) => Promise<any>
  createVideo: (id: number, index: number, params: CreateVideoParams) => Promise<any>
  nextFenjing: (id: number, index: number) => Promise<any>
  deleteStory: (id: number) => Promise<any>
  setMainVideo: (id: number, index: number, main_video: string) => Promise<any>
  getTasks: (id: number) => Promise<any>
  updateStoryCover: (id: number, prompt: string) => Promise<any>
  getLogs: () => Promise<any>
}

export type CreateVideoParams = {
  main_shot?: string
  gen_shot?: boolean
  last_shot: string
}

export interface NewPieceParams {
  name: string
  style: string
  author: string
}

export interface NewPieceResponse {
  id: number
}
export interface NewStoryResponse {
  id: number
  task?: {
    error: string
  }
}

export interface NewStoryParams {
  name: string
  style: string
  author: string
  text: string
}

export interface DrawToVideoParams extends FormData {
  file: Blob
}

export interface DrawToVideoResponse {
  id: number
}

export type GetVideoByIdResponse = string

export interface TaskItemResponse {
  error: string
  id: number
  procces: {
    result: Array<string>
    start_time: number
    stop_time: number
    sub_task: string
    total: number
  }
  status: VideoTaskStatus
  text: string
}

export type VideoTaskStatus = 'failed' | 'success' | 'running' | 'queue'
