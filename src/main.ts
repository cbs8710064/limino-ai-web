import './assets/main.css'
import 'nprogress/nprogress.css'
import 'virtual:uno.css'
import 'ant-design-vue/dist/reset.css'
import '@/styles/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as directives from '@/directives/index'
// import '@/utils/vConsole'
import MessagePlugin from './plugins/messagePlugin/install'
import LoadingPlugin from './plugins/loadingPlugin/install'
import App from './App.vue'
import router from './router'
import i18n from './languages'
import BackTopPlugin from './plugins/backTopPlugin/install'
const pinia = createPinia()
const app = createApp(App)
Object.keys(directives).forEach((key) => {
  const dircts: any = directives
  app.directive(key, dircts[key])
})

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(MessagePlugin)
app.use(LoadingPlugin)
app.use(BackTopPlugin, {
  right: 16,
  bottom: 42,
  activityTop: 300
})
app.mount('#app')
