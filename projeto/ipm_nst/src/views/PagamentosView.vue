<template>
  <div class="pagamentos-container">

    <!--  CARDS -->
    <div class="cards">
      <div class="card blue">
        <p>Total Desembolsado</p>
        <h2>22 640 000 000€</h2>
      </div>

      <div class="card green">
        <p>Total de Pagamentos</p>
        <h2>5/6</h2>
      </div>

      <div class="card purple">
        <p>Beneficiários Únicos</p>
        <h2>428 070</h2>
      </div>

      <div class="card orange">
        <p>Média por Pagamento</p>
        <h2>4 528 000 000€</h2>
      </div>
    </div>

    <!-- 🔘 TABS -->
    <div class="tabs">
      <button>Marcos e Metas</button>
      <button>Indicadores Comuns</button>
      <button class="active">Desembolsos</button>
    </div>

    <div class="subtabs">
      <button class="active">Detalhes de Pagamentos</button>
      <button>Top 100 Beneficiários</button>
    </div>

    <!-- TABELA -->
    <div class="table-section">
      <div class="table-header">
        <h3>Pagamentos Efetuados pela UE</h3>

        <div class="actions">
          <select>
            <option>Categoria</option>
            <option>Saúde</option>
            <option>Clima</option>
            <option>Educação</option>
          </select>

          <button class="export">Exportar</button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Pesquisar por beneficiário ou categoria"
        class="search"
      />

      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Beneficiário</th>
            <th>Montante</th>
            <th>Categoria</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in pagamentos" :key="item.id">
            <td>{{ item.data }}</td>
            <td>{{ item.nome }}</td>
            <td class="valor">{{ item.valor }}</td>
            <td>{{ item.categoria }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

const pagamentos = ref([
  {
    id: 1,
    data: "01/04/2025",
    nome: "Serviço Nacional de Saúde",
    valor: "€50.166.150",
    categoria: "Saúde",
    status: "Em Progresso",
  },
  {
    id: 2,
    data: "16/07/2024",
    nome: "Fundo Ambiental",
    valor: "€1.570.670",
    categoria: "Clima",
    status: "Concluído",
  },
]);
</script>

<style scoped>
.pagamentos-container {
  padding: 20px;
  background: #f5f6fa;
}

/* CARDS */
.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  padding: 20px;
  border-radius: 10px;
  color: white;
}

.blue { background: #2f6fed; }
.green { background: #1db954; }
.purple { background: #a142f4; }
.orange { background: #ff6a00; }

/* TABS */
.tabs, .subtabs {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.tabs button,
.subtabs button {
  padding: 10px 15px;
  border: none;
  background: #ddd;
  border-radius: 20px;
  cursor: pointer;
}

.active {
  background: #2f6fed;
  color: white;
}

/* TABLE */
.table-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 10px;
}

.search {
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.valor {
  color: green;
  font-weight: bold;
}
</style>