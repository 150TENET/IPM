import { createRouter, createWebHistory } from 'vue-router'
import EntrarView from '@/views/EntrarView.vue'
import InicioView from '@/views/InicioView.vue'
import PaisesView from '@/views/PaisesView.vue'
import DetalhePaisView from '@/views/DetalhePaisView.vue'
import ComparacaoView from '@/views/ComparacaoView.vue'

const rotas = [
  {
    path: '/entrar',
    name: 'entrar',
    component: EntrarView
  },
  {
    path: '/',
    name: 'inicio',
    component: InicioView
  },
  {
    path: '/paises',
    name: 'paises',
    component: PaisesView
  },
  {
    path: '/paises/:codigo',
    name: 'detalhe-pais',
    component: DetalhePaisView,
    props: true
  },
  {
    path: '/comparacao',
    name: 'comparacao',
    component: ComparacaoView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: rotas,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
