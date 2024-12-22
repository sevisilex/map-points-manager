import { createRouter, createWebHistory } from 'vue-router'
import MapView from '../views/MapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE),
  routes: [
    {
      path: '/',
      name: 'map',
      component: MapView,
    },
  ],
})

export default router
