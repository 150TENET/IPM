<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// --- 1. CONTRATOS DE TIPAGEM ESTRITA (Sem Any) ---
interface KohesioProjeto {
  Project_EU_Budget: number | null;
  Total_Eligible_Expenditure_amount: number | null;
}

interface MilestoneRow {
  Country?: string;
  country?: string;
  CountryCode?: string;
  countryCode?: string;
  Status?: string;
  status?: string;
  Type?: string;
  type?: string;
  'Milestone or Target'?: string;
  'Milestone/Target'?: string;
  Estado?: string;
  estado?: string;
}

const route = useRoute()
const projetosKohesio = ref<KohesioProjeto[]>([])
const listaMarcosMetasRaw = ref<MilestoneRow[]>([])
const aCarregar = ref(false)

// --- 2. DICIONÁRIO ALARGADO DE NORMALIZAÇÃO DE PAÍSES (Suporta toda a UE) ---
const mapearPaisParaDB = (param: string): string => {
  const p = param.toLowerCase()
  const dicionario: Record<string, string> = {
    it: 'italy', italy: 'italy',
    es: 'spain', spain: 'spain', espana: 'spain',
    pt: 'portugal', portugal: 'portugal',
    at: 'austria', austria: 'austria',
    ro: 'romania', romania: 'romania',
    bg: 'bulgaria', bulgaria: 'bulgaria',
    se: 'sweden', sweden: 'sweden',
    pl: 'poland', poland: 'poland',
    be: 'belgium', belgium: 'belgium',
    de: 'germany', germany: 'germany',
    fr: 'france', france: 'france',
    nl: 'netherlands', islands: 'netherlands',
    fi: 'finland', dk: 'denmark', ie: 'ireland'
  }
  return dicionario[p] || p
}

// --- 3. RECOLHA DE DADOS DIRETA DO BACKEND ---
async function carregarMetricasMarcosTopo() {
  const param = (route.params.country as string || '').toLowerCase()
  if (!param) return

  aCarregar.value = true
  projetosKohesio.value = [] // Limpeza preventiva para novos países

  try {
    const [resKohesio, resMilestones] = await Promise.all([
      fetch(`http://localhost:3000/${param}-kohesio`),
      fetch(`http://localhost:3000/milestones`)
    ])

    if (resKohesio.ok) {
      projetosKohesio.value = await resKohesio.json()
    }
    if (resMilestones.ok) {
      listaMarcosMetasRaw.value = await resMilestones.json()
    }
  } catch {
    console.warn(`Dados não encontrados para o país: ${param}. Redirecionado para zero.`)
  } finally {
    aCarregar.value = false
  }
}

// --- 4. FILTRAGEM DE LINHAS EXCLUSIVAS DO PAÍS ATIVO ---
const linhasDoPaisAtual = computed<MilestoneRow[]>(() => {
  const paisAlvo = mapearPaisParaDB(route.params.country as string || '')

  return (listaMarcosMetasRaw.value || []).filter((item: MilestoneRow) => {
    const nomeNaDb = (item.Country || item.country || '').toLowerCase()
    const codigoNaDb = (item.CountryCode || item.countryCode || '').toLowerCase()
    const nomeTraduzidoDaDb = mapearPaisParaDB(codigoNaDb || nomeNaDb)

    return nomeNaDb === paisAlvo || codigoNaDb === paisAlvo || nomeTraduzidoDaDb === paisAlvo
  })
})

// --- 5. OPERAÇÕES MATEMÁTICAS SOBRE OS MONTANTES ---
const fundosTotais = computed(() => {
  return projetosKohesio.value.reduce((acc, p) => acc + Number(p.Total_Eligible_Expenditure_amount || 0), 0)
})

const valorPagoUE = computed(() => {
  return projetosKohesio.value.reduce((acc, p) => acc + Number(p.Project_EU_Budget || 0), 0)
})

const percentagemOrcamento = computed(() => {
  if (!fundosTotais.value) return 0
  return Math.round((valorPagoUE.value / fundosTotais.value) * 100)
})

// --- 6. CONTADORES FILTRADOS COM DETETOR DINÂMICO DE CHAVES ---
const totalMarcos = computed(() => {
  return separarPorTipoEstrategico('milestone').length
})

const marcosConcluidos = computed(() => {
  return separarPorTipoEstrategico('milestone').filter(m => verificarEstadoLinha(m)).length
})

const totalMetas = computed(() => {
  return separarPorTipoEstrategico('target').length
})

const metasAtingidas = computed(() => {
  return separarPorTipoEstrategico('target').filter(m => verificarEstadoLinha(m)).length
})

// --- 7. DETETOR UNIVERSAL DE TIPOS (Resolve o bug das Metas a 0) ---
function separarPorTipoEstrategico(tipoDesejado: 'milestone' | 'target') {
  return linhasDoPaisAtual.value.filter((m: MilestoneRow) => {
    // Recolhe todas as colunas possíveis onde o tipo de indicador costuma ser guardado
    const valoresPossiveis = [
      m['Milestone or Target'],
      m['Milestone/Target'],
      m.Type,
      m.type
    ]

    let eTarget = false
    let eMilestone = false

    for (const val of valoresPossiveis) {
      if (!val) continue
      const str = String(val).toLowerCase()
      if (str.includes('target') || str.includes('meta') || str === 't') {
        eTarget = true
      }
      if (str.includes('milestone') || str.includes('marco') || str === 'm') {
        eMilestone = true
      }
    }

    // Varredura de contingência profunda usando conversão segura de chaves (Sem any)
    if (!eTarget && !eMilestone) {
      const objetoGenerico = m as Record<string, unknown>
      for (const chave of Object.keys(objetoGenerico)) {
        const conteudo = objetoGenerico[chave]
        if (typeof conteudo === 'string') {
          const strVal = conteudo.toLowerCase()
          if (strVal === 'target' || strVal === 'meta') eTarget = true
          if (strVal === 'milestone' || strVal === 'marco') eMilestone = true
        }
      }
    }

    if (tipoDesejado === 'target') {
      return eTarget
    } else {
      // Se não for explicitamente uma meta, classifica como marco para preencher o painel
      return eMilestone || !eTarget
    }
  })
}

function verificarEstadoLinha(m: MilestoneRow): boolean {
  const camposStatus = [m.Status, m.status, m.Estado, m.estado]
  for (const val of camposStatus) {
    if (!val) continue
    const s = String(val).toLowerCase()
    if (s.includes('fulfil') || s.includes('conclu') || s.includes('done') || s.includes('atendido') || s.includes('achieved')) {
      return true
    }
  }
  return false
}

function formatarMoedaM(valor: number): string {
  if (!valor) return '0 M €'
  const milhoes = valor / 1000000
  return `${milhoes.toLocaleString('pt-PT', { maximumFractionDigits: 0 })} M €`
}

watch(() => route.params.country, () => carregarMetricasMarcosTopo())
onMounted(() => carregarMetricasMarcosTopo())
</script>

<template>
  <div class="marcos-top-wrapper">
    <p class="subtitle-context">
      Objetivos específicos de cada país, detalhados com descrições, prazos e o respetivo estado de execução
    </p>

    <div class="metrics-grid">
      <div class="kpi-card">
        <div class="icon-box azul">€</div>
        <div class="kpi-info">
          <span class="kpi-label">Fundos Totais</span>
          <h2 v-if="!aCarregar" class="kpi-value">{{ formatarMoedaM(fundosTotais) }}</h2>
          <h2 v-else class="kpi-value loading">...</h2>
        </div>
      </div>

      <div class="kpi-card">
        <div class="icon-box verde">📈</div>
        <div class="kpi-info">
          <span class="kpi-label">Valor Pago</span>
          <h2 v-if="!aCarregar" class="kpi-value">{{ formatarMoedaM(valorPagoUE) }}</h2>
          <h2 v-else class="kpi-value loading">...</h2>
          <span class="kpi-subtext">{{ percentagemOrcamento }}% do orçamento total</span>
        </div>
      </div>

      <div class="kpi-card">
        <div class="icon-box roxo">✓</div>
        <div class="kpi-info">
          <span class="kpi-label">Marcos Concluídos</span>
          <h2 v-if="!aCarregar" class="kpi-value">{{ marcosConcluidos.toLocaleString() }} / {{ totalMarcos.toLocaleString() }}</h2>
          <h2 v-else class="kpi-value loading">...</h2>
        </div>
      </div>

      <div class="kpi-card">
        <div class="icon-box laranja">🎯</div>
        <div class="kpi-info">
          <span class="kpi-label">Metas Atingidas</span>
          <h2 v-if="!aCarregar" class="kpi-value">{{ metasAtingidas.toLocaleString() }} / {{ totalMetas.toLocaleString() }}</h2>
          <h2 v-else class="kpi-value loading">...</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marcos-top-wrapper { width: 100%; }
.subtitle-context { color: #667085; font-size: 13px; margin: 0 0 20px 0; }
.metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; width: 100%; }

.kpi-card {
  background-color: #ffffff;
  border-radius: 14px;
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 24px rgba(20, 28, 55, 0.05);
  border: 1px solid #f1f5f9;
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
}
.icon-box.azul { background-color: #eff6ff; color: #1e40af; }
.icon-box.verde { background-color: #ecfdf5; color: #065f46; }
.icon-box.roxo { background-color: #faf5ff; color: #6b21a8; }
.icon-box.laranja { background-color: #fff7ed; color: #c2410c; }

.kpi-info { display: flex; flex-direction: column; }
.kpi-label { font-size: 0.82rem; color: #94a3b8; font-weight: 600; }
.kpi-value { margin: 4px 0 0 0; font-size: 1.4rem; font-weight: 800; color: #21407a; }
.kpi-value.loading { color: #cbd5e1; }
.kpi-subtext { font-size: 0.78rem; color: #64748b; margin-top: 4px; font-weight: 500; }

@media (max-width: 768px) { .metrics-grid { grid-template-columns: 1fr; } }
</style>
