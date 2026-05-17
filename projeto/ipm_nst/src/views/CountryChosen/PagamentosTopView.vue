<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// --- 1. CONTRATO DE TIPAGEM REAL DA DB ---
interface KohesioProjeto {
  Project_EU_Budget: number | null;
  Total_Eligible_Expenditure_amount: number | null;
  Beneficiary_Unique_Identifier: string | null;
}

const route = useRoute()
const projetos = ref<KohesioProjeto[]>([])
const aCarregar = ref(false)

// --- 2. CHAMADA DIRETA AO ENDPOINT DO PAÍS SELECIONADO ---
async function carregarKpisPagamentos() {
  const paisId = route.params.country as string
  if (!paisId) return

  aCarregar.value = true
  try {
    const res = await fetch(`http://localhost:3000/${paisId.toLowerCase()}-kohesio`)
    if (res.ok) {
      projetos.value = await res.json()
    }
  } catch (error) {
    console.error('Erro ao ler KPIs de desembolsos:', error)
  } finally {
    aCarregar.value = false
  }
}

// --- 3. CÁLCULOS MATEMÁTICOS SOBRE A TUA DB ---
const totalDesembolsado = computed(() => {
  return projetos.value.reduce((acc, p) => acc + Number(p.Project_EU_Budget || 0), 0)
})

const contagemPagamentos = computed(() => projetos.value.length)

const beneficiariosUnicos = computed(() => {
  const lista = projetos.value
    .map(p => p.Beneficiary_Unique_Identifier)
    .filter((b): b is string => !!b)
  return new Set(lista).size
})

const mediaPorPagamento = computed(() => {
  if (!contagemPagamentos.value) return 0
  return totalDesembolsado.value / contagemPagamentos.value
})

// Formata os valores monetários grandes de forma compacta (Ex: 14.5M €)
function formatarMoeda(valor: number): string {
  if (!valor) return '0 M €'
  const milhoes = valor / 1000000
  return `${milhoes.toLocaleString('pt-PT', { maximumFractionDigits: 2 })} M €`
}

watch(() => route.params.country, () => carregarKpisPagamentos())
onMounted(() => carregarKpisPagamentos())
</script>

<template>
  <div class="pagamentos-top-container">
    <p class="context-subtitle">
      Detalhe dos pagamentos efetuados pela UE a cada país, discriminando datas, montantes e tipologias
    </p>

    <div class="kpi-row-grid">
      <div class="kpi-block azul">
        <div class="kpi-icon">€</div>
        <div class="kpi-content">
          <span class="label">Total Desembolsado</span>
          <h3 v-if="!aCarregar">{{ formatarMoeda(totalDesembolsado) }}</h3>
          <h3 v-else class="pulse">...</h3>
        </div>
      </div>

      <div class="kpi-block verde">
        <div class="kpi-icon">📅</div>
        <div class="kpi-content">
          <span class="label">Total de Pagamentos</span>
          <h3 v-if="!aCarregar">{{ contagemPagamentos }}</h3>
          <h3 v-else class="pulse">...</h3>
        </div>
      </div>

      <div class="kpi-block roxo">
        <div class="kpi-icon">👤</div>
        <div class="kpi-content">
          <span class="label">Beneficiários Únicos</span>
          <h3 v-if="!aCarregar">{{ beneficiariosUnicos }}</h3>
          <h3 v-else class="pulse">...</h3>
        </div>
      </div>

      <div class="kpi-block laranja">
        <div class="kpi-icon">💸</div>
        <div class="kpi-content">
          <span class="label">Média por Pagamento</span>
          <h3 v-if="!aCarregar">{{ formatarMoeda(mediaPorPagamento) }}</h3>
          <h3 v-else class="pulse">...</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagamentos-top-container { width: 100%; }
.context-subtitle { color: #667085; font-size: 13px; margin: 0 0 16px; }

.kpi-row-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;
}

.kpi-block {
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.kpi-block.azul { background: #3b82f6; }
.kpi-block.verde { background: #10b981; }
.kpi-block.roxo { background: #a855f7; }
.kpi-block.laranja { background: #f97316; }

.kpi-icon {
  font-size: 1.6rem;
  background: rgba(255, 255, 255, 0.2);
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-content h3 { margin: 4px 0 0; font-size: 1.35rem; font-weight: 800; }
.kpi-content .label { font-size: 0.78rem; font-weight: 600; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.02em; }

.pulse { animation: opacityPulse 1s infinite alternate; }
@keyframes opacityPulse { from { opacity: 0.4; } to { opacity: 1; } }

@media (max-width: 1024px) { .kpi-row-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .kpi-row-grid { grid-template-columns: 1fr; } }
</style>
