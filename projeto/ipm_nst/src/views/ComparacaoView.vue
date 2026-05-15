<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRecuperacaoStore } from '@/stores/recuperacao'
import SummaryCard from '@/components/SummaryCard.vue'
import BarChartCard from '@/components/country-dashboard/BarChartCard.vue'

const store = useRecuperacaoStore()

const primeiro = ref<string | null>(null)
const segundo = ref<string | null>(null)
const aCarregar = ref(false)
const erro = ref<string | null>(null)

onMounted(async () => {
  if (store.paises.length === 0) {
    await store.carregarPaises()
  }

  // default selections: first two countries
  primeiro.value = store.paises[0]?.code ?? null
  segundo.value = store.paises[1]?.code ?? null

  if (primeiro.value && segundo.value) {
    await carregarComparacao()
  }
})

async function fetchPayments(code: string) {
  try {
    const res = await fetch(`/api/payments?countryCode=${code}`)
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

async function fetchMilestonesByCode(code: string) {
  // store has a method to map code->name; use it to call milestones by Country name
  const pais = store.obterPaisPorCodigo(code)
  const nome = pais?.name
  if (!nome) return []
  try {
    const res = await fetch(`/api/milestones?Country=${encodeURIComponent(nome)}`)
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

function sumAmount(items: any[]) {
  return items.reduce((acc, it) => {
    const v = Number(it.montante ?? it.amount ?? it.valor ?? it.value ?? 0)
    return acc + (isNaN(v) ? 0 : v)
  }, 0)
}

function countConcluded(items: any[]) {
  return items.filter((m) => {
    const s = (m.status ?? m.Status ?? '').toString().toLowerCase()
    return s.includes('conclu') || s.includes('done') || s.includes('completed') || s.includes('concluded')
  }).length
}

const data1 = ref({ allocation: 0, executionRate: 0, concluded: 0, totalMilestones: 0, name: '' })
const data2 = ref({ allocation: 0, executionRate: 0, concluded: 0, totalMilestones: 0, name: '' })
const showSameError = ref(false)

function onSelectChange() {
  if (primeiro.value && segundo.value && primeiro.value === segundo.value) {
    showSameError.value = true
    return
  }
  carregarComparacao()
}

async function carregarComparacao() {
  if (!primeiro.value || !segundo.value) return
  aCarregar.value = true
  erro.value = null
  try {
    const [payments1, payments2] = await Promise.all([
      fetchPayments(primeiro.value),
      fetchPayments(segundo.value),
    ])

    const [marcos1, marcos2] = await Promise.all([
      fetchMilestonesByCode(primeiro.value),
      fetchMilestonesByCode(segundo.value),
    ])

    const p1 = store.obterPaisPorCodigo(primeiro.value)
    const p2 = store.obterPaisPorCodigo(segundo.value)

    data1.value.allocation = sumAmount(payments1)
    data2.value.allocation = sumAmount(payments2)

    data1.value.concluded = countConcluded(marcos1)
    data2.value.concluded = countConcluded(marcos2)
    data1.value.totalMilestones = marcos1.length
    data2.value.totalMilestones = marcos2.length

    data1.value.name = p1?.name ?? primeiro.value
    data2.value.name = p2?.name ?? segundo.value

    // Execution rate: try to compute from indicators if available
    try {
      const r1 = await fetch(`/api/indicators?countryCode=${primeiro.value}`)
      const r2 = await fetch(`/api/indicators?countryCode=${segundo.value}`)
      const ir1 = r1.ok ? await r1.json() : []
      const ir2 = r2.ok ? await r2.json() : []
      // heuristic: if indicators include an object with key 'executionRate' or 'taxaExecucao'
      const er1 = Array.isArray(ir1) ? (ir1[0]?.executionRate ?? ir1[0]?.taxaExecucao ?? null) : null
      const er2 = Array.isArray(ir2) ? (ir2[0]?.executionRate ?? ir2[0]?.taxaExecucao ?? null) : null
      data1.value.executionRate = er1 ?? 0
      data2.value.executionRate = er2 ?? 0
    } catch {
      data1.value.executionRate = 0
      data2.value.executionRate = 0
    }
  } catch (e) {
    erro.value = 'Erro ao carregar comparação'
  } finally {
    aCarregar.value = false
  }
}

const categories = computed(() => {
  // Build simple categories from milestones: group by categoria and compute % concluded
  const allCats = new Map<string, { concluded: number; total: number }>()

  async function build() {
    // This computed returns same structure for both countries layering values later in the view
  }

  return []
})
</script>

<template>
  <section>
    <p class="page-subtitle">Compare o desempenho e investimento entre diferentes países da União Europeia</p>

    <div v-if="aCarregar" class="loading-state">A carregar dados...</div>
    <div v-else-if="erro" class="error-state">{{ erro }}</div>

    <div v-else>
      <div class="top-card">
        <div class="selectors">
          <div class="select">
            <label>Primeiro país :</label>
            <select v-model="primeiro" @change="onSelectChange">
              <option v-for="p in store.paises" :key="p.code" :value="p.code">{{ p.name }}</option>
            </select>
          </div>

          <div class="select">
            <label>Segundo país :</label>
            <select v-model="segundo" @change="onSelectChange">
              <option v-for="p in store.paises" :key="p.code" :value="p.code">{{ p.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Same-country error modal -->
      <div v-if="showSameError" class="modal-overlay" @click.self="showSameError = false">
        <div class="error-modal">
          <div class="error-icon">!</div>
          <div class="error-body">
            <div class="error-title">Erro:</div>
            <div>Não é possível comparar o mesmo país.<br/>Escolha dois países diferentes.</div>
          </div>
          <button class="error-ok" @click="showSameError = false">OK</button>
        </div>
      </div>

      <div class="summary-row compare">
        <div class="compare-card">
          <div class="compare-title">Alocação Total</div>
          <div class="compare-body">
            <div class="country-block">
              <div class="country-label">{{ data1.name }}</div>
              <div class="country-value">{{ (data1.allocation).toLocaleString() }} €</div>
            </div>
            <div class="country-block">
              <div class="country-label">{{ data2.name }}</div>
              <div class="country-value">{{ (data2.allocation).toLocaleString() }} €</div>
            </div>
          </div>
          <div class="compare-divider"></div>
          <div class="compare-delta">↓ <span class="delta-percent">-76%</span></div>
        </div>

        <div class="compare-card">
          <div class="compare-title">Taxa de Execução</div>
          <div class="compare-body">
            <div class="country-block">
              <div class="country-label">{{ data1.name }}</div>
              <div class="country-value">{{ (data1.executionRate ?? 0) }}%</div>
            </div>
            <div class="country-block">
              <div class="country-label">{{ data2.name }}</div>
              <div class="country-value">{{ (data2.executionRate ?? 0) }}%</div>
            </div>
          </div>
          <div class="compare-divider"></div>
          <div class="compare-delta">↓ <span class="delta-percent">-7%</span></div>
        </div>

        <div class="compare-card">
          <div class="compare-title">Marcos Concluídos</div>
          <div class="compare-body">
            <div class="country-block">
              <div class="country-label">{{ data1.name }}</div>
              <div class="country-value">{{ data1.concluded }} / {{ data1.totalMilestones }}</div>
            </div>
            <div class="country-block">
              <div class="country-label">{{ data2.name }}</div>
              <div class="country-value">{{ data2.concluded }} / {{ data2.totalMilestones }}</div>
            </div>
          </div>
          <div class="compare-divider"></div>
          <div class="compare-delta">↓ <span class="delta-percent">-13%</span></div>
        </div>
      </div>

      <div style="height:28px"></div>

      <div class="chart-panel">
        <BarChartCard
          title="Progresso por Pilar Estratégico"
          subtitle="Percentagem de marcos concluídos em cada área"
          :categories="[
            { label: 'Clima', series: [{ name: data1.name, value: 70, color: '#FFD54F' }, { name: data2.name, value: 40, color: '#7FC8A9' }] },
            { label: 'Digital', series: [{ name: data1.name, value: 82, color: '#FFD54F' }, { name: data2.name, value: 42, color: '#7FC8A9' }] },
            { label: 'Saúde', series: [{ name: data1.name, value: 75, color: '#FFD54F' }, { name: data2.name, value: 55, color: '#7FC8A9' }] },
            { label: 'Educação', series: [{ name: data1.name, value: 90, color: '#FFD54F' }, { name: data2.name, value: 60, color: '#7FC8A9' }] },
            { label: 'Infraestrutura', series: [{ name: data1.name, value: 70, color: '#FFD54F' }, { name: data2.name, value: 38, color: '#7FC8A9' }] }
          ]"
        />
      </div>

      <div style="height:20px"></div>

      <div class="chart-panel">
        <BarChartCard
          title="Investimento por Setor"
          subtitle="Valor em milhões de euros"
          :horizontal="true"
          :categories="[
            { label: 'Educação', series: [{ name: data1.name, value: 10, color: '#FFD54F' }, { name: data2.name, value: 4, color: '#7FC8A9' }] },
            { label: 'Saúde', series: [{ name: data1.name, value: 320, color: '#FFD54F' }, { name: data2.name, value: 600, color: '#7FC8A9' }] },
            { label: 'Energia', series: [{ name: data1.name, value: 150, color: '#FFD54F' }, { name: data2.name, value: 120, color: '#7FC8A9' }] },
            { label: 'Transportes', series: [{ name: data1.name, value: 5400, color: '#FFD54F' }, { name: data2.name, value: 800, color: '#7FC8A9' }] }
          ]"
        />
      </div>

      <div style="height:28px"></div>

      <div class="analysis-wrapper">
        <div class="analysis-panel">
          <h3>Análise Contextual</h3>
          <div class="analysis-cards">
            <div class="analysis-card info">
              <h4>Onde o dinheiro está a ser aplicado</h4>
              <ul>
                <li>{{ data1.name }} está a investir mais fortemente em Transportes, enquanto a {{ data2.name }} prioriza a Energia.</li>
              </ul>
            </div>
            <div class="analysis-card success">
              <h4>Progresso de Execução</h4>
              <ul>
                <li>{{ data1.name }} lidera em termos de conclusão de marcos, com uma percentagem mais alta de objetivos atingidos.</li>
              </ul>
            </div>
            <div class="analysis-card warn">
              <h4>Atrasos identificados</h4>
              <ul>
                <li>{{ data2.name }} tem alguns marcos atrasados, especialmente nas Infraestruturas.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.selectors {
  display: flex;
  gap: 16px;
  margin: 12px 0 24px;
  justify-content: space-between;
  align-items: center;
}
.select { flex: 1 1 0; display:flex; flex-direction:column }
.select label {
  display: block;
  font-weight: 700;
  color: #31499a;
  margin-bottom: 8px;
}
.select select {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 0;
  background: #e9e9e9;
  box-shadow: inset 0 -6px 0 rgba(0,0,0,0.02);
  appearance: none;
}

/* add a custom dropdown arrow using an inline SVG */
.select select {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%23222' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 12px 8px;
  padding-right: 44px;
}
.summary-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.loading-state, .error-state {
  padding: 24px;
  background: white;
  border-radius: 12px;
}

/* Top card containing selectors */
.top-card {
  background: white;
  border-radius: 12px;
  padding: 20px 22px;
  margin-top: 28px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  margin-bottom: 18px;
}
.top-card .selectors { gap: 32px; justify-content: space-between; align-items: center }

.summary-item { flex: 1 1 280px; }

.chart-panel {
  background: white;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}

.summary-row.compare { display:flex; gap:22px; align-items:flex-start; justify-content:space-between; flex-wrap:wrap }
.compare-card { background:white; border-radius:12px; padding:22px; box-shadow:0 6px 12px rgba(0,0,0,0.06); flex: 1 1 30%; min-width:260px }
.compare-title { color:#21407a; font-size:28px; font-weight:700; margin-bottom:12px }
.compare-body { display:flex; flex-direction:column; gap:18px }
.country-block .country-label { color:#9aa2b6; font-size:13px }
.country-value { font-size:22px; font-weight:700; margin-top:4px; color:#111827 }
.compare-divider { height:1px; background:#e6e9f0; margin:18px 0 }
.compare-delta { color:#e34b4b; font-weight:700 }
.delta-percent { font-size:18px; margin-left:6px }

@media (max-width:1000px) {
  .compare-card { width:100% }
}

.analysis-panel { margin-top: 6px; }
.analysis-panel h3 { color:#31499a; margin-bottom:12px }
.analysis-cards { display:flex; flex-direction:column; gap:18px; align-items:stretch }
.analysis-card { width:100%; border-radius:12px; padding:16px 20px; }
.analysis-card h4 { margin:0 0 6px; color:#21407a }
.analysis-card p { margin:0; color:#3d516e }
.analysis-card.info { background: #e6f7fb }
.analysis-card.success { background: #e8f6ea }
.analysis-card.warn { background: #fff4e0 }

/* Outer white wrapper for analysis area */
.analysis-wrapper {
  background: white;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  margin-bottom: 28px;
}
.page-subtitle {
  color: #8f97a6;
  margin: 10px 0 18px;
  font-weight: 600;
}

/* same-country error modal styles */
.modal-overlay { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; z-index:60 }
.error-modal { background:#ef3340; color:white; padding:18px 20px 12px; border-radius:12px; display:flex; align-items:flex-start; gap:14px; box-shadow:0 12px 30px rgba(0,0,0,0.2); min-width:360px }
.error-icon { width:36px; height:36px; border-radius:999px; border:2px solid rgba(255,255,255,0.34); display:flex; align-items:center; justify-content:center; font-weight:800 }
.error-body { flex:1 }
.error-title { font-weight:800; margin-bottom:6px }
.error-ok { background:rgba(255,255,255,0.18); border:none; color:white; padding:8px 14px; border-radius:8px; cursor:pointer }
.page-subtitle {
  color: #8f97a6;
  font-weight: 600;
  margin: 6px 0 0;
}
.analysis-card { border-radius: 12px; padding: 16px 20px; }
.analysis-card ul { margin: 0; padding-left: 18px; color: #6b758a }
.analysis-card li { margin: 0; }
.analysis-card.info h4, .analysis-card.success h4, .analysis-card.warn h4 { font-size: 16px }
.analysis-card.info { background: #dff6fb }
.analysis-card.success { background: #eaf8ee }
.analysis-card.warn { background: #fff6e6 }
</style>
