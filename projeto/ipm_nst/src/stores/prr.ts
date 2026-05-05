import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API = '/api'

type Country = {
  code: string
  name?: string
  flag?: string
  [key: string]: unknown
}

export const usePrrStore = defineStore('prr', () => {

  const countries = ref<Country[]>([])
  const countryDetail = ref<Country | null>(null)
  const indicators = ref<unknown[]>([])
  const payments = ref<unknown[]>([])
  const beneficiaries = ref<unknown[]>([])
  const milestones = ref<unknown[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)


  const getCountryByCode = computed(() => (code: string) =>
    countries.value.find((c) => c.code === code)
  )


  async function fetchCountries() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API}/countries`)
      countries.value = await res.json()
    } catch {
      error.value = 'Erro ao carregar países'
    } finally {
      loading.value = false
    }
  }

  async function fetchCountryDetail(code: string) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API}/countries?code=${code}`)
      const data = await res.json()
      countryDetail.value = data[0] ?? null
    } catch {
      error.value = 'Erro ao carregar detalhe do país'
    } finally {
      loading.value = false
    }
  }

  async function fetchIndicators() {
    const res = await fetch(`${API}/indicators`)
    indicators.value = await res.json()
  }

  async function fetchPayments(countryCode: string) {
    const res = await fetch(`${API}/payments?countryCode=${countryCode}`)
    payments.value = await res.json()
  }

  async function fetchBeneficiaries(countryCode: string) {
    const res = await fetch(`${API}/beneficiaries?countryCode=${countryCode}`)
    beneficiaries.value = await res.json()
  }

  async function fetchMilestones(countryCode: string) {
    const res = await fetch(`${API}/milestones?countryCode=${countryCode}`)
    milestones.value = await res.json()
  }

  return {
    countries, countryDetail, indicators,
    payments, beneficiaries, milestones, loading, error,
    getCountryByCode,
    fetchCountries, fetchCountryDetail, fetchIndicators,
    fetchPayments, fetchBeneficiaries, fetchMilestones
  }
})
