<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SummaryCard from '@/components/SummaryCard.vue';

const milestones = ref([]);

// Simulando a chamada à API do teu json-server
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/porto.listings'); // Substitui pelo teu endpoint real de marcos
    const data = await response.json();
    milestones.value = data.slice(0, 5); // Apenas os 5 mais recentes
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
});
</script>

<template>
  <div class="dashboard-bg">
    <div class="summary-grid">
      <SummaryCard
        title="Fundos Totais"
        value="30.3M €"
        icon="payments"
        color="blue"
      />

      <SummaryCard
        title="Valor Pago"
        value="19.8M €"
        subtitle="65.35% do total"
        icon="trending_up"
        color="green"
      />
    </div>
  </div>
</template>

<style>
/* Estilo para o fundo e para a grelha */
.dashboard-bg {
  min-height: 100vh;
  padding: 2rem;
}

.summary-grid {
  display: flex;    /* Coloca lado a lado */
  flex-wrap: wrap;  /* Se não couber, salta para baixo */
  gap: 1.5rem;      /* Espaço entre cartões */
  justify-content: center; /* Centraliza na tela */
}
</style>
