<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

interface KohesioProjeto {
  Operation_Unique_Identifier: string;
  Operation_Name_English: string;
  Operation_Start_Date: string;
  Operation_End_Date: string;
  Project_EU_Budget: number;
  Beneficiary_Unique_Identifier: string;
  Category_Label: string;
}

const route = useRoute()
const listaProjetos = ref<KohesioProjeto[]>([])
const aCarregar = ref(false)
const pesquisa = ref('')
const filtroStatus = ref('')

async function carregarTabelaPagamentos() {
  const paisId = route.params.country as string
  if (!paisId) return

  aCarregar.value = true
  try {
    const res = await fetch(`http://localhost:3000/${paisId.toLowerCase()}-kohesio`)
    if (res.ok) {
      listaProjetos.value = await res.json()
    }
  } catch (err) {
    console.error('Erro ao ler tabela Kohesio:', err)
  } finally {
    aCarregar.value = false
  }
}

// --- LÓGICA DE FILTRAGEM INTELIGENTE ---
const projetosFiltrados = computed(() => {
  return listaProjetos.value.filter(p => {
    // 1. Filtro por Texto (Nome do projeto, Beneficiário ou Categoria)
    const termo = pesquisa.value.toLowerCase()
    const bateTexto =
      (p.Operation_Name_English || '').toLowerCase().includes(termo) ||
      (p.Beneficiary_Unique_Identifier || '').toLowerCase().includes(termo) ||
      (p.Category_Label || '').toLowerCase().includes(termo)

    // 2. Filtro por Estado (Calulado com base no ano de fim "2025" vs ano atual de 2026)
    const concluido = (p.Operation_End_Date || '').includes('2024') || (p.Operation_End_Date || '').includes('2025')
    const estadoCalculado = concluido ? 'Concluído' : 'Em curso'
    const bateStatus = !filtroStatus.value || estadoCalculado === filtroStatus.value

    return bateTexto && bateStatus
  })
})

function extrairIdBeneficiario(url: string | null): string {
  if (!url) return 'Geral'
  return url.split('/').pop() || 'ID Autónomo'
}

watch(() => route.params.country, () => carregarTabelaPagamentos())
onMounted(() => carregarTabelaPagamentos())
</script>

<template>
  <div class="pagamentos-tabela-panel">

    <div class="table-card-frame">
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

      <div v-if="aCarregar" class="table-loading">
        A carregar dados financeiros em tempo real...
      </div>

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
              <td class="category-cell" :title="p.Category_Label">
                {{ p.Category_Label }}
              </td>
              <td style="text-align: center;">
                <span :class="['status-tag', (p.Operation_End_Date.includes('2024') || p.Operation_End_Date.includes('2025')) ? 'concluido' : 'em-curso']">
                  {{ (p.Operation_End_Date.includes('2024') || p.Operation_End_Date.includes('2025')) ? 'Concluído' : 'Em curso' }}
                </span>
              </td>
            </tr>
            <tr v-if="projetosFiltrados.length === 0">
              <td colspan="5" class="empty-table-row">
                Nenhum pagamento registado nesta categoria para o país selecionado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<style scoped>
.pagamentos-tabela-panel { width: 100%; margin-top: 12px; }

.table-card-frame {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(20, 28, 55, 0.05);
  border: 1px solid #f1f5f9;
}

.table-actions-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.search-box-wrapper { flex: 1; }
.input-pesquisa {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.88rem;
  outline: none;
}

.select-status {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.88rem;
  outline: none;
  cursor: pointer;
}

.table-responsive { overflow-x: auto; }
.custom-table { width: 100%; border-collapse: collapse; text-align: left; }

.custom-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.82rem;
  padding: 12px 14px;
  border-bottom: 2px solid #e2e8f0;
}

.custom-table td {
  padding: 14px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.88rem;
  color: #334155;
  vertical-align: middle;
}

.date-cell { font-weight: 600; color: #64748b; }
.amount-cell { font-weight: 700; color: #1e3a8a; }

.beneficiary-info { display: flex; flex-direction: column; gap: 2px; }
.b-id { font-size: 0.72rem; font-weight: 700; color: #2563eb; }
.p-title { font-weight: 600; color: #1e293b; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.category-cell { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #475569; }

.status-tag { padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; display: inline-block; }
.status-tag.concluido { background: #d1fae5; color: #065f46; }
.status-tag.em-curso { background: #dbeafe; color: #1e40af; }

.table-loading, .empty-table-row { text-align: center; padding: 40px; color: #64748b; font-weight: 500; }
</style>
