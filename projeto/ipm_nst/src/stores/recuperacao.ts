import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API = '/api'

export const useRecuperacaoStore = defineStore('recuperacao', () => {
  
  const paises = ref([])
  const paisDetalhe = ref(null)
  const indicadores = ref([])
  const pagamentos = ref([])
  const beneficiarios = ref([])
  const marcos = ref([])
  const aCarregar = ref(false)
  const erro = ref(null)

  
  const obterPaisPorCodigo = computed(() => (codigo: string) =>
    paises.value.find((p: any) => p.code === codigo)
  )

  
  async function carregarPaises() {
    aCarregar.value = true
    erro.value = null
    try {
      const res = await fetch(`${API}/countries`)
      paises.value = await res.json()
    } catch (e) {
      erro.value = 'Erro ao carregar países'
    } finally {
      aCarregar.value = false
    }
  }

  async function carregarDetalhe(codigo: string) {
    aCarregar.value = true
    erro.value = null
    try {
      const res = await fetch(`${API}/countries?code=${codigo}`)
      const dados = await res.json()
      paisDetalhe.value = dados[0] ?? null
    } catch (e) {
      erro.value = 'Erro ao carregar detalhe do país'
    } finally {
      aCarregar.value = false
    }
  }

  async function carregarIndicadores() {
    const res = await fetch(`${API}/indicators`)
    indicadores.value = await res.json()
  }

  async function carregarPagamentos(codigoPais: string) {
    const res = await fetch(`${API}/payments?countryCode=${codigoPais}`)
    pagamentos.value = await res.json()
  }

  async function carregarBeneficiarios(codigoPais: string) {
    const res = await fetch(`${API}/beneficiaries?countryCode=${codigoPais}`)
    beneficiarios.value = await res.json()
  }

  async function carregarMarcos(codigoPais: string) {
    const res = await fetch(`${API}/milestones?countryCode=${codigoPais}`)
    marcos.value = await res.json()
  }

  return {
    paises, paisDetalhe, indicadores,
    pagamentos, beneficiarios, marcos, aCarregar, erro,
    obterPaisPorCodigo,
    carregarPaises, carregarDetalhe, carregarIndicadores,
    carregarPagamentos, carregarBeneficiarios, carregarMarcos
  }
})