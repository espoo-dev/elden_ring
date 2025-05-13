import { createRouter, createWebHistory } from 'vue-router'
import ProgressionTracker from '../views/ProgressionTracker.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: ProgressionTracker
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router