<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRecuperacaoStore } from '@/stores/recuperacao'

const pesquisaBenef = ref('')
const categoriaBenef = ref('')
const route = useRoute()
const store = useRecuperacaoStore()
const subTab = ref(0)
const pesquisa = ref('')
const categoria = ref('')
const mostrarExportar = ref(false)

onMounted(async () => {
  if (route.params.country) {
    await store.carregarPagamentos(route.params.country as string)
    await store.carregarBeneficiarios(route.params.country as string)
  }
})

const pagamentosFiltrados = computed(() =>
  (store.pagamentos as any[]).filter(p =>
    (!pesquisa.value || p.beneficiario?.toLowerCase().includes(pesquisa.value.toLowerCase()) || p.data?.includes(pesquisa.value)) &&
    (!categoria.value || p.categoria === categoria.value)
  )
)

const beneficiariosFiltrados = computed(() =>
  (store.beneficiarios as any[]).filter(b =>
    (!pesquisaBenef.value || b.nome?.toLowerCase().includes(pesquisaBenef.value.toLowerCase())) &&
    (!categoriaBenef.value || b.categoria === categoriaBenef.value)
  )
)
</script>

<template>
  <div class="pag-wrapper">
    <div class="subtabs-wrapper">
      <button class="subtab" :class="{ active: subTab === 0 }" @click="subTab = 0">Detalhes de Pagamentos</button>
      <button class="subtab" :class="{ active: subTab === 1 }" @click="subTab = 1">Top 100 Beneficiários</button>
    </div>

    <!-- Pagamentos -->
    <div v-show="subTab === 0" class="table-container">
      <div class="table-header">
        <div>
          <h3>Pagamentos Efetuados pela UE</h3>
          <p>Discriminação de datas, montantes e tipologias</p>
        </div>
        <button class="btn-exportar" @click="mostrarExportar = true">📊 Exportar</button>
      </div>
      <div class="filtros">
        <input v-model="pesquisa" class="search-input" placeholder="Pesquisar por beneficiário ou categoria">
        <select v-model="categoria" class="select-filter">
          <option value="">Selecione uma opção</option>
          <option>Digital</option>
          <option>Clima</option>
          <option>Saúde</option>
          <option>Educação</option>
          <option>Infraestruturas</option>
        </select>
      </div>
      <table>
        <thead><tr><th>Data</th><th>Beneficiário</th><th>Montante</th><th>Categoria</th><th>Status</th></tr></thead>
        <tbody>
          <tr v-for="p in pagamentosFiltrados" :key="p.id">
            <td>{{ p.data }}</td>
            <td>{{ p.beneficiario }}</td>
            <td class="montante">{{ p.montante }}</td>
            <td>{{ p.categoria }}</td>
            <td><span class="badge" :class="p.status === 'pago' ? 'badge-done' : 'badge-prog'">{{ p.status === 'pago' ? 'Concluído' : 'Em Progresso' }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Beneficiários -->
    <div v-show="subTab === 1" class="table-container">
      <div class="table-header">
        <div>
          <h3>Top 100 Beneficiários</h3>
          <p>Maiores recetores de fundos no país</p>
        </div>
        <button class="btn-exportar" @click="mostrarExportar = true">📊 Exportar</button>
      </div>
      <div class="filtros">
        <input v-model="pesquisaBenef" class="search-input" placeholder="Pesquisar pelo nome do beneficiário">
        <select v-model="categoriaBenef" class="select-filter">
          <option value="">Selecione uma opção</option>
          <option>Digital</option>
          <option>Clima</option>
          <option>Saúde</option>
          <option>Educação</option>
          <option>Infraestruturas</option>
        </select>
      </div>
      <table>
        <thead><tr><th>Rank</th><th>Nome do Beneficiário</th><th>Valor Total</th><th>Nº Pagamentos</th><th>Categoria</th><th>Último Pagamento</th></tr></thead>
        <tbody>
          <tr v-for="b in beneficiariosFiltrados" :key="b.id">
            <td><strong>{{ b.rank }}</strong></td>
            <td>{{ b.nome }}</td>
            <td class="montante">{{ b.total }}</td>
            <td>{{ b.numeroPagamentos }}</td>
            <td>{{ b.categoria }}</td>
            <td>{{ b.ultimoPagamento }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal exportar -->
    <div v-if="mostrarExportar" class="modal-fundo" @click.self="mostrarExportar = false">
      <div class="modal-escuro">
        <button class="modal-fechar" @click="mostrarExportar = false">✕</button>
        <div style="font-size:38px;margin-bottom:12px;">⬇️</div>
        <div>Os dados foram exportados com sucesso.<br>Verifique a pasta de Transferências no seu dispositivo.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pag-wrapper { padding: 20px 40px; }
.subtabs-wrapper {
  background: white;
  border-radius: 999px;
  padding: 4px;
  display: flex;
  margin: 0 0 16px 0;
  box-shadow: 0 1px 6px rgba(0,0,0,0.05);
  width: 100%;
}

.subtab {
  flex: 1;
  padding: 9px;
  border: none;
  background: none;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  color: #31499a;
  cursor: pointer;
  transition: all 0.2s;
}

.subtab.active {
  background: #eef2ff;
  color: #20306b;
  box-shadow: inset 0 0 0 1px rgba(49, 73, 154, 0.16);
}

.subtab:not(.active):hover {
  background: rgba(49, 73, 154, 0.08);
}

.table-container { 
  background: white; 
  border-radius: 10px; 
  padding: 20px 24px; 
  box-shadow: 0 1px 6px rgba(0,0,0,0.05); 
  }
.table-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin-bottom: 14px; 
  }
.table-header h3 { 
  font-size: 15px; 
  color: #31499a; 
  font-weight: 800; 
  margin: 0 0 2px; 
  }
.table-header p { 
  font-size: 11px; 
  color: #888; 
  margin: 0; 
  }
.filtros { 
  display: flex; 
  gap: 10px; 
  margin-bottom: 14px; }
.search-input { 
  flex: 1; 
  border: 1px solid #dde0e8; 
  border-radius: 8px; 
  padding: 7px 10px; 
  font-size: 12px; 
  background: #f8f9fc; 
  outline: none; 
  }
.select-filter { 
  border: 1px solid #dde0e8; 
  border-radius: 8px; 
  padding: 7px 10px; 
  font-size: 12px; 
  background: white; 
  outline: none; 
  cursor: pointer; 
  min-width: 150px; 
  }
table { 
  width: 100%; 
  border-collapse: collapse; 
  }
th { font-size: 11px; font-weight: 700; color: #888; text-align: left; padding: 7px 10px; border-bottom: 1px solid #dde0e8; }
td { font-size: 12px; padding: 10px; border-bottom: 1px solid #f0f0f6; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #f8f9fc; }
.montante { 
  color: #2b4fa0; 
  font-weight: 700; 
  }
.badge { 
  border-radius: 20px; 
  padding: 3px 9px; 
  font-size: 11px; 
  font-weight: 700; 
  }
.badge-done { 
  background: #e0f5e8; 
  color: #2d7a4f; 
  }
.badge-prog { 
  background: #e8eef8; 
  color: #2b4fa0; 
  }
.btn-exportar { 
  background: #1a7a2a; 
  color: white; 
  border: none; 
  border-radius: 8px; 
  padding: 8px 14px; 
  font-size: 12px; 
  font-weight: 700; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  }
.modal-fundo { 
  position: fixed; 
  inset: 0; 
  background: rgba(0,0,0,0.4); 
  z-index: 1000; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  }
.modal-escuro { 
  background: #555; 
  color: white; 
  text-align: center; 
  border-radius: 14px; 
  padding: 26px 30px; 
  max-width: 340px; 
  width: 90%; 
  position: relative; 
  }
.modal-fechar { 
  position: absolute; 
  top: 10px; 
  right: 13px; 
  background: none; 
  border: none; 
  font-size: 17px; 
  cursor: pointer; 
  color: white; 
  }
</style>