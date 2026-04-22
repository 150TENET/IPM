import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API = '/api'

type Pais = {
  code: string
  name: string
  flag: string
}

export const useRecuperacaoStore = defineStore('recuperacao', () => {
  const paises = ref<Pais[]>([])
  const paisDetalhe = ref<Pais | null>(null)
  const indicadores = ref<unknown[]>([])
  const pagamentos = ref<unknown[]>([])
  const beneficiarios = ref<unknown[]>([])
  const marcos = ref<unknown[]>([])
  const aCarregar = ref(false)
  const erro = ref<string | null>(null)

  const obterPaisPorCodigo = computed(
    () => (codigo: string) => paises.value.find((p) => p.code === codigo),
  )

  async function carregarPaises() {
    aCarregar.value = true
    erro.value = null
    try {
      const res = await fetch(`${API}/countries`)
      if (!res.ok) {
        throw new Error(`Falha na API de países (${res.status})`)
      }

      const dados = await res.json()
      if (!Array.isArray(dados)) {
        throw new Error('Formato inválido para a lista de países')
      }

      paises.value = dados
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : 'Erro desconhecido'
      erro.value = `Erro ao carregar países: ${mensagem}`
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
    } catch {
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
    paises,
    paisDetalhe,
    indicadores,
    pagamentos,
    beneficiarios,
    marcos,
    aCarregar,
    erro,
    obterPaisPorCodigo,
    carregarPaises,
    carregarDetalhe,
    carregarIndicadores,
    carregarPagamentos,
    carregarBeneficiarios,
    carregarMarcos,
  }
})
