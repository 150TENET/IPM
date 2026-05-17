<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// --- 1. CONTRATOS DE TIPAGEM REAL DA DB (Sem Any) ---
interface KohesioProjeto {
  Operation_Unique_Identifier: string;
  Operation_Name_English: string;
  Operation_Start_Date: string;
  Operation_End_Date: string;
  Project_EU_Budget: number;
  Beneficiary_Unique_Identifier: string;
  Category_Label: string;
  Policy_Objective_Label: string;
}

interface BeneficiarioAgrupado {
  id: string;
  totalValue: number;
  numPayments: number;
  category: string;
  lastPayment: string;
}

const route = useRoute()
const listaProjetos = ref<KohesioProjeto[]>([])
const aCarregar = ref(false)

// Estados de Controlo de Interface
const abaAtiva = ref<'detalhes' | 'top100'>('detalhes')
const pesquisa = ref('')
const filtroStatus = ref('')

// --- 2. CARREGAMENTO REAL DA BASE DE DADOS ---
async function carregarDadosPagamentos() {
  const param = (route.params.country as string || '').toLowerCase()
  if (!param) return

  aCarregar.value = true
  try {
    const res = await fetch(`http://localhost:3000/${param}-kohesio`)
    if (res.ok) {
      listaProjetos.value = await res.json()
    } else {
      listaProjetos.value = []
    }
  } catch (err) {
    console.error('Erro ao ler registos Kohesio para a tabela:', err)
    listaProjetos.value = []
  } finally {
    aCarregar.value = false
  }
}

// --- 3. LÓGICA DA OPÇÃO A: DETALHES DE PAGAMENTOS ---
const projetosFiltrados = computed(() => {
  return listaProjetos.value.filter(p => {
    const termo = pesquisa.value.toLowerCase()
    const bateTexto =
      (p.Operation_Name_English || '').toLowerCase().includes(termo) ||
      (p.Beneficiary_Unique_Identifier || '').toLowerCase().includes(termo) ||
      (p.Category_Label || '').toLowerCase().includes(termo)

    const concluido = (p.Operation_End_Date || '').includes('2024') || (p.Operation_End_Date || '').includes('2025')
    const estadoCalculado = concluido ? 'Concluído' : 'Em curso'
    const bateStatus = !filtroStatus.value || estadoCalculado === filtroStatus.value

    return bateTexto && bateStatus
  })
})

// --- 4. LÓGICA DA OPÇÃO B: GERADOR AUTOMÁTICO DO TOP 100 ---
const topBeneficiarios = computed<BeneficiarioAgrupado[]>(() => {
  const grupos: Record<string, BeneficiarioAgrupado> = {}

  listaProjetos.value.forEach((p: KohesioProjeto) => {
    const bId = p.Beneficiary_Unique_Identifier
      ? p.Beneficiary_Unique_Identifier.split('/').pop() || 'Ref Geral'
      : 'Ref Geral'

    const valor = Number(p.Project_EU_Budget || 0)

    let categoriaLimpa = 'Clima'
    const pilar = (p.Policy_Objective_Label || '').toLowerCase()
    if (pilar.includes('social') || pilar.includes('education')) {
      categoriaLimpa = 'Social'
    } else if (pilar.includes('smart') || pilar.includes('digital')) {
      categoriaLimpa = 'Digital'
    }

    if (!grupos[bId]) {
      grupos[bId] = {
        id: bId,
        totalValue: 0,
        numPayments: 0,
        category: categoriaLimpa,
        lastPayment: p.Operation_Start_Date || 'dd/mm/aaaa'
      }
    }

    grupos[bId].totalValue += valor
    grupos[bId].numPayments += 1
  })

  return Object.values(grupos)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 100)
})

function extrairIdBeneficiario(url: string | null): string {
  if (!url) return 'Geral'
  return url.split('/').pop() || 'ID Autónomo'
}

watch(() => route.params.country, () => carregarDadosPagamentos())
onMounted(() => carregarDadosPagamentos())
</script>

<template>
  <div class="pagamentos-container-panel">

    <div class="sub-nav-tabs-frame">
      <button
        :class="['sub-tab-link', abaAtiva === 'detalhes' ? 'active' : '']"
        @click="abaAtiva = 'detalhes'"
      >
        Detalhes de Pagamentos
      </button>
      <button
        :class="['sub-tab-link', abaAtiva === 'top100' ? 'active' : '']"
        @click="abaAtiva = 'top100'"
      >
        Top 100 Beneficiários
      </button>
    </div>

    <div class="table-card-frame">

      <div v-if="abaAtiva === 'detalhes'">
        <div class="table-actions-row">
          <div class="search-box-wrapper">
            <input
              v-model="pesquisa"
              type="text"
              placeholder="Pesquisar por beneficiário ou categoria..."
              class="input-pesquisa"
            />
          </div>
          <div class="filter-dropdown-wrapper">
            <select v-model="filtroStatus" class="select-status">
              <option value="">Filtrar por Status (Todos)</option>
              <option value="Concluído">Concluído</option>
              <option value="Em curso">Em curso</option>
            </select>
          </div>
        </div>

        <div v-if="aCarregar" class="table-loading">A ler dados do Kohesio...</div>
        <div v-else class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th style="width: 110px;">Data Início</th>
                <th>Beneficiário / Projeto</th>
                <th style="width: 140px;">Montante UE</th>
                <th>Categoria de Intervenção</th>
                <th style="width: 120px; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in projetosFiltrados" :key="p.Operation_Unique_Identifier">
                <td class="date-cell">{{ p.Operation_Start_Date }}</td>
                <td>
                  <div class="beneficiary-info">
                    <span class="b-id">Ref: {{ extrairIdBeneficiario(p.Beneficiary_Unique_Identifier) }}</span>
                    <span class="p-title" :title="p.Operation_Name_English">{{ p.Operation_Name_English }}</span>
                  </div>
                </td>
                <td class="amount-cell">
                  {{ Number(p.Project_EU_Budget).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }) }}
                </td>
                <td class="category-cell" :title="p.Category_Label">{{ p.Category_Label }}</td>
                <td style="text-align: center;">
                  <span :class="['status-tag', (p.Operation_End_Date.includes('2024') || p.Operation_End_Date.includes('2025')) ? 'concluido' : 'em-curso']">
                    {{ (p.Operation_End_Date.includes('2024') || p.Operation_End_Date.includes('2025')) ? 'Concluído' : 'Em curso' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="abaAtiva === 'top100'">
        <div v-if="aCarregar" class="table-loading">A calcular ordenação do ranking...</div>
        <div v-else class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th style="width: 70px; text-align: center;">Rank</th>
                <th>Nome do Beneficiário</th>
                <th style="width: 160px;">Valor Total Recebido</th>
                <th style="width: 140px; text-align: center;">Nº de Projetos</th>
                <th style="width: 130px;">Categoria Principal</th>
                <th style="width: 130px;">Último Registo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(b, index) in topBeneficiarios" :key="b.id">
                <td style="text-align: center;"><span class="rank-circle">{{ index + 1 }}</span></td>
                <td class="b-name-cell">Entidade Beneficiária — {{ b.id }}</td>
                <td class="amount-cell">
                  {{ b.totalValue.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }) }}
                </td>
                <td style="text-align: center; font-weight: 700; color: #475569;">{{ b.numPayments }} pagamentos</td>
                <td><span class="cat-pill">{{ b.category }}</span></td>
                <td class="date-cell">{{ b.lastPayment }}</td>
              </tr>
              <tr v-if="topBeneficiarios.length === 0">
                <td colspan="6" class="empty-row">Sem registos para o país selecionado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.pagamentos-container-panel { width: 100%; margin-top: 10px; }

/* Moldura Centralizada das Sub-Abas */
.sub-nav-tabs-frame {
  display: flex;
  background: #ffffff;
  border-radius: 30px;
  padding: 4px;
  margin: 0 auto 20px auto; /* 👈 Centralização horizontal total */
  border: 1px solid #e2e8f0;
  max-width: 500px;
  width: 100%;
}

.sub-tab-link {
  flex: 1;
  padding: 10px 20px;
  border: none;
  background: transparent;
  font-size: 0.88rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  border-radius: 25px;
  transition: all 0.2s ease;
  text-align: center;
}

.sub-tab-link.active {
  background: #edf2f7;
  color: #1e3a8a;
}

.table-card-frame {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(20, 28, 55, 0.05);
  border: 1px solid #f1f5f9;
}

.table-actions-row { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.search-box-wrapper { flex: 1; }
.input-pesquisa { width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.88rem; outline: none; }
.select-status { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; font-size: 0.88rem; cursor: pointer; }

.table-responsive { overflow-x: auto; }
.custom-table { width: 100%; border-collapse: collapse; text-align: left; }
.custom-table th { background: #f8fafc; color: #475569; font-weight: 700; font-size: 0.82rem; padding: 12px 14px; border-bottom: 2px solid #e2e8f0; }
.custom-table td { padding: 14px; border-bottom: 1px solid #f1f5f9; font-size: 0.88rem; color: #334155; vertical-align: middle; }

.date-cell { font-weight: 600; color: #64748b; }
.amount-cell { font-weight: 700; color: #1e3a8a; }
.beneficiary-info { display: flex; flex-direction: column; gap: 2px; }
.b-id { font-size: 0.72rem; font-weight: 700; color: #2563eb; }
.p-title { font-weight: 600; color: #1e293b; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.b-name-cell { font-weight: 600; color: #1e293b; }

.category-cell { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #475569; }

.status-tag { padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; display: inline-block; }
.status-tag.concluido { background: #d1fae5; color: #065f46; }
.status-tag.em-curso { background: #dbeafe; color: #1e40af; }

.rank-circle {
  width: 26px;
  height: 26px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 800;
}

.cat-pill {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
}

.table-loading, .empty-row { text-align: center; padding: 40px; color: #64748b; font-weight: 500; }
</style>
