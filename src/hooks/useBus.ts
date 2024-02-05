import mitt, { type Emitter } from 'mitt'

type Events = {
  panelMenuEvent: number
  // 工作台菜单按钮点击事件
  headerNextEvent: number
  // 故事首次列表加载完毕事件
  storyListLoaded: boolean
  // 新增故事事件
  addStoryEvent: number
  // 轮训任务事件
  loopTaskEvent: Array<any>
  // 故事封面绘制完成
  gen_cover_completed: boolean
  // 角色绘制完成
  gen_role_completed: boolean
  // 分镜图绘制完成
  gen_shots_completed: boolean
  // 视频合并完成
  gen_merged_video_completed: boolean
}
const eventBus: Emitter<Events> = mitt<Events>()
export const useEventBus = () => {
  return {
    eventBus
  }
}
