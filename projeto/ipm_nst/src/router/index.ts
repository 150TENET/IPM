import { createRouter, createWebHistory } from 'vue-router'
import EntrarView from '@/views/EntrarView.vue'
import InicioView from '@/views/InicioView.vue'
import PaisesView from '@/views/PaisesView.vue'
import PagamentosView from '@/views/PagamentosView.vue' 

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
    path: '/pagamentos',
    name: 'pagamentos',
    component: PagamentosView
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