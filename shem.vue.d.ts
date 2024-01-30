declare module 'vue-i18n'
declare module 'animejs'
declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}
declare interface Window {}
