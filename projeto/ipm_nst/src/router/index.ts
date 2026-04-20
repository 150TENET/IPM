import { createRouter, createWebHistory } from 'vue-router'

import InicioView from '@/views/InicioView.vue'
import PaisesView from '@/views/PaisesView.vue'
import PagamentosView from '@/views/PagamentosView.vue'
import IndicadoresView from '@/views/IndicadoresView.vue'
import MarcosAndMetasView from '@/views/MarcosAndMetasView.vue'

const rotas = [
  {
    path: '/',
    name: 'inicio',
    component: InicioView,
  },
  {
    path: '/paises',
    name: 'paises',
    component: PaisesView,
  },
  {
    path: '/pagamentos',
    name: 'pagamentos',
    component: PagamentosView,
  },
  {
    path: '/indicadores',
    name: 'indicadores',
    component: IndicadoresView,
  },
  {
    path: '/marcosandmetas',
    name: 'marcosandmetas',
    component: MarcosAndMetasView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: rotas,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
