import mitt, { type Emitter } from 'mitt'

type Events = {
  panelMenuEvent: number
  headerNextEvent: number
  storyListLoaded: boolean
  addStoryEvent: number
}
const eventBus: Emitter<Events> = mitt<Events>()
export const useEventBus = () => {
  return {
    eventBus
  }
}
