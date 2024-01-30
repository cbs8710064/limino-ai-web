/// <reference types="vite/client" />
/// <reference lib="dom"/>
interface ImportMetaEnv {
  readonly VITE_APP_APIPATH: string
  readonly VITE_APP_VIDEOPATH: string
}

declare const window: Window & typeof globalThis
