import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ResumeView from '../views/ResumeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: ResumeView,
    meta: { title: 'Resume' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
