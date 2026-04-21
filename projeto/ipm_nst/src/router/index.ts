import { createRouter, createWebHistory } from 'vue-router'

import InicioView from '@/views/InicioView.vue'
import PaisesView from '@/views/PaisesView.vue'
import PagamentosView from '@/views/PagamentosView.vue'
import IndicadoresView from '@/views/CountryChosen/IndicadoresView.vue'
import MarcosAndMetasView from '@/views/CountryChosen/MarcosAndMetasView.vue'
import CountryChosenView from '@/views/CountryChosen/MainLayout.vue'

const rotas = [
  {
    path: '/',
    name: 'inicio',
    component: InicioView, // Sem moldura
  },
  {
    path: '/paises',
    name: 'paises',
    component: PaisesView, // Sem moldura
  },
  {
    path: '/pagamentos', // Movemos para aqui para ter a moldura e o país
    name: 'pagamentos',
    component: PagamentosView,
  },
  {
    path: '/:country', // O parâmetro do país (ex: /portugal)
    component: CountryChosenView, // ESTA É A TUA MOLDURA (Layout)
    children: [
      {
        path: '', // Rota padrão quando entras no país (ex: /portugal/)
        redirect: { name: 'marcosandmetas' },
      },
      {
        path: 'marcosandmetas', // Sem a barra "/" no início para ser relativo ao pai
        name: 'marcosandmetas',
        component: MarcosAndMetasView,
      },
      {
        path: 'indicadores', // Relativo: /:country/indicadores
        name: 'indicadores',
        component: IndicadoresView,
      }
    ],
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
