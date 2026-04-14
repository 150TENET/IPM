import { createRouter, createWebHistory } from 'vue-router'
import IndicadoresView from '@/views/IndicadoresView.vue'

const routes = [{ path: '/indicadores', component: IndicadoresView }]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
