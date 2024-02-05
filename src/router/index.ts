import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'

NProgress.configure({
  easing: 'ease-in',
  speed: 400,
  showSpinner: false,
  trickleSpeed: 300,
  minimum: 0.3,
  parent: '#app'
})
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/HomeView.vue')
    },
    {
      path: '/workbench',
      name: 'workbench',
      redirect: { name: 'story' },
      component: () => import('@/views/workbench/IndexLayout.vue'),
      children: [
        {
          name: 'story',
          path: 'story',
          component: () => import('@/views/workbench/StoryView.vue')
        },
        {
          name: 'cover',
          path: 'cover',
          component: () => import('@/views/workbench/CoverView.vue')
        },
        {
          name: 'character',
          path: 'character',
          component: () => import('@/views/workbench/CharacterView.vue')
        },
        {
          name: 'paragraph',
          path: 'paragraph',
          component: () => import('@/views/workbench/ParagraphView.vue')
        },
        {
          name: 'post',
          path: 'post',
          component: () => import('@/views/workbench/PostView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/404',
      component: () => import('@/views/PageNotFound.vue')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    },
    {
      path: '/logs',
      name: 'logs',
      component: () => import('@/views/LogsView.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeResolve((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
