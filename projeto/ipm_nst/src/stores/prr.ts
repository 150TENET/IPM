import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API = '/api'

export const usePrrStore = defineStore('prr', () => {
  
  const countries = ref([])
  const countryDetail = ref(null)
  const indicators = ref([])
  const payments = ref([])
  const beneficiaries = ref([])
  const milestones = ref([])
  const loading = ref(false)
  const error = ref(null)

  
  const getCountryByCode = computed(() => (code: string) =>
    countries.value.find((c: any) => c.code === code)
  )

  
  async function fetchCountries() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API}/countries`)
      countries.value = await res.json()
    } catch (e) {
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
    } catch (e) {
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