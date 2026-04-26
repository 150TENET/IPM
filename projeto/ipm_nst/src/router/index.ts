import { createRouter, createWebHistory } from 'vue-router'

import InicioView from '@/views/InicioView.vue'
import PaisesView from '@/views/PaisesView.vue'
import PagamentosView from '@/views/PagamentosView.vue'
import IndicadoresView from '@/views/CountryChosen/IndicadoresView.vue'
import MarcosAndMetasView from '@/views/CountryChosen/MarcosAndMetasView.vue'
import MarcosAndMetasTopView from '@/views/CountryChosen/MarcosAndMetasTopView.vue'
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
        components:
        {
          default: MarcosAndMetasView,
          top: MarcosAndMetasTopView, // Exibe MarcosAndMetasView na área "top" da moldura
        }
      },
      {
        path: 'indicadores', // Relativo: /:country/indicadores
        name: 'indicadores',
        component: IndicadoresView,
      },
      {
        path: 'pagamentos', // Relativo: /:country/pagamentos
        name: 'pagamentos',
        component: PagamentosView,
      },
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
